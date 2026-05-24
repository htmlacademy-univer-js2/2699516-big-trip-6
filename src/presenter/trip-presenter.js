
import TripEvents from '../view/trip-events-view.js';
import Sort from '../view/sort-view.js';
import EmptyPointsView from '../view/empty-points-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { render, remove } from '../framework/render.js';
import { sorts } from '../mock/sort.js';
import { filterPointsByType } from '../utils/filter.js';
import { sortPoints } from '../utils/sort.js';
import { UserAction, UpdateType, FilterType } from '../const.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #routePointListElement = null;
  #pointsModel = null;
  #filterModel = null;
  #sortModel = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #sortComponent = null;
  #emptyComponent = null;
  #newEventButton = null;
  #shouldOpenNewPointForm = false;
  #uiBlocker = null;

  constructor({ container, pointsModel, filterModel, sortModel, uiBlocker }) {
    this.#tripEventsContainer = container.querySelector('.trip-events');
    this.#newEventButton = document.querySelector('.trip-main__event-add-btn');
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;
    this.#uiBlocker = uiBlocker;
  }

  init() {
    this.#filterModel.addObserver(this.#handleFilterModelChange);
    this.#sortModel.addObserver(this.#handleSortModelChange);
    this.#pointsModel.addObserver(this.#handlePointsModelChange);

    if (this.#newEventButton) {
      this.#newEventButton.addEventListener('click', this.#handleNewEventButtonClick);
    }

    this.#renderBoard();
  }

  #getFilteredAndSortedPoints() {
    const filterType = this.#filterModel.getFilter();
    const sortType = this.#sortModel.getSortType();
    const filteredPoints = filterPointsByType[filterType](this.#pointsModel.getPoints());

    return sortPoints(filteredPoints, sortType);
  }

  #getSortsWithState() {
    const currentSort = this.#sortModel.getSortType();

    return sorts.map((sort) => ({
      ...sort,
      isChecked: sort.type === currentSort,
    }));
  }

  #handleViewAction = async (actionType, payload) => {
    this.#uiBlocker.block();

    try {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          await this.#pointsModel.updatePoint(UpdateType.MINOR, payload);
          break;
        case UserAction.ADD_POINT:
          await this.#pointsModel.addPoint(UpdateType.MAJOR, payload);
          break;
        case UserAction.DELETE_POINT:
          await this.#pointsModel.deletePoint(UpdateType.MAJOR, payload.id);
          break;
      }
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #handlePointsModelChange = (updateType) => {
    if (updateType === UpdateType.MINOR) {
      this.#resetAllEditForms();
      this.#renderBoard();
      return;
    }

    this.#closeNewPointForm();
    this.#renderBoard();
  };

  #handleFilterModelChange = () => {
    this.#sortModel.resetSortType();

    if (!this.#shouldOpenNewPointForm) {
      this.#closeNewPointForm();
    }

    this.#renderBoard();

    if (this.#shouldOpenNewPointForm) {
      this.#openNewPointForm();
      this.#shouldOpenNewPointForm = false;

      if (this.#newEventButton) {
        this.#newEventButton.disabled = true;
      }
    }
  };

  #handleSortModelChange = () => {
    this.#renderPoints();
  };

  #handleSortChange = (sortType) => {
    if (this.#sortModel.getSortType() === sortType) {
      return;
    }

    this.#sortModel.setSortType(UpdateType.MINOR, sortType);
  };

  #handleNewEventButtonClick = () => {
    if (this.#newPointPresenter) {
      return;
    }

    this.#shouldOpenNewPointForm = true;
    this.#resetAllEditForms();
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  };

  #handleModeChange = () => {
    this.#closeNewPointForm();
    this.#resetAllEditForms();
  };

  #resetAllEditForms() {
    this.#pointPresenters.forEach((pointPresenter) => {
      pointPresenter.resetView();
    });
  }

  #openNewPointForm() {
    if (this.#emptyComponent) {
      remove(this.#emptyComponent);
      this.#emptyComponent = null;
    }

    if (!this.#sortComponent) {
      this.#sortComponent = new Sort({
        sorts: this.#getSortsWithState(),
        onSortChange: this.#handleSortChange,
      });
      render(this.#sortComponent, this.#tripEventsContainer);
      this.#sortComponent.setSortChangeHandler();
    }

    if (!this.#routePointListElement) {
      this.#routePointListElement = new TripEvents();
      render(this.#routePointListElement, this.#tripEventsContainer);
    }

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#routePointListElement.element,
      allOffers: this.#pointsModel.getOffers(),
      destinations: this.#pointsModel.getDestinations(),
      onDataChange: this.#handleViewAction,
      onClose: () => {
        this.#closeNewPointForm();
      },
    });

    this.#newPointPresenter.init();
  }

  #closeNewPointForm() {
    if (!this.#newPointPresenter) {
      return;
    }

    this.#newPointPresenter.destroy();
    this.#newPointPresenter = null;

    if (this.#newEventButton) {
      this.#newEventButton.disabled = false;
    }
  }

  #clearBoard() {
    this.#clearPointPresenters();

    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }

    if (this.#routePointListElement) {
      remove(this.#routePointListElement);
      this.#routePointListElement = null;
    }

    if (this.#emptyComponent) {
      remove(this.#emptyComponent);
      this.#emptyComponent = null;
    }
  }

  #clearPointPresenters() {
    this.#pointPresenters.forEach((pointPresenter) => {
      pointPresenter.destroy();
    });
    this.#pointPresenters.clear();
  }

  #renderPoints() {
    if (!this.#routePointListElement) {
      return;
    }

    this.#clearPointPresenters();

    const points = this.#getFilteredAndSortedPoints();

    for (let i = 0; i < points.length; i++) {
      this.#renderPoint(points[i]);
    }
  }

  #renderPoint(point) {
    const destination = this.#pointsModel.getDestinationById(point.destination);
    const offersByType = this.#pointsModel.getOffersByType(point.type);
    const pointOffers = offersByType
      ? offersByType.offers.filter((offer) => point.offers?.includes(offer.id))
      : [];

    const pointPresenter = new PointPresenter(
      this.#pointsModel.getOffers(),
      destination,
      pointOffers,
      this.#routePointListElement.element,
      this.#pointsModel.getDestinations(),
      this.#handleModeChange,
      this.#handleViewAction
    );

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderBoard() {
    this.#clearBoard();

    const allPoints = this.#pointsModel.getPoints();
    const points = this.#getFilteredAndSortedPoints();

    if (points.length === 0) {
      const filterType = allPoints.length === 0
        ? FilterType.EVERYTHING
        : this.#filterModel.getFilter();

      this.#emptyComponent = new EmptyPointsView(filterType);
      render(this.#emptyComponent, this.#tripEventsContainer);
      return;
    }

    this.#sortComponent = new Sort({
      sorts: this.#getSortsWithState(),
      onSortChange: this.#handleSortChange,
    });

    this.#routePointListElement = new TripEvents();

    render(this.#sortComponent, this.#tripEventsContainer);
    this.#sortComponent.setSortChangeHandler();
    render(this.#routePointListElement, this.#tripEventsContainer);

    this.#renderPoints();
  }
}
