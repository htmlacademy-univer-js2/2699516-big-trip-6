
import TripEvents from '../view/trip-events-view.js';
import Filter from '../view/filters-view.js';
import Sort from '../view/sort-view.js';
import EmptyPointsView from '../view/empty-points-view.js';
import PointPresenter from './point-presenter.js';
import { render } from '../framework/render.js';
import { filters } from '../mock/filter.js';
import { sorts } from '../mock/sort.js';

export default class TripPresenter {
  #tripControlFilters = null;
  #tripEvents = null;
  #routePointListElement = null;
  #pointsModel = null;
  #pointPresenters = new Map();

  #pointsArray = [];


  constructor({ container, pointsModel }) {
    this.#tripControlFilters = document.querySelector('.trip-controls__filters');
    this.#tripEvents = container.querySelector('.trip-events');
    this.#routePointListElement = new TripEvents();
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#pointsArray = [...this.#pointsModel.getPoints()];
    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((pointPresenter) => {
      pointPresenter.resetView();
    });
  };

  #handlePointDataChange = (updatedPoint) => {
    this.#pointsModel.updatePoint(updatedPoint);
    this.#pointsArray = [...this.#pointsModel.getPoints()];
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPoint(point) {
    const destination = this.#pointsModel.getDestinationById(point.destination);
    const offersByType = this.#pointsModel.getOffersByType(point.type);
    const pointOffers = offersByType ? offersByType.offers.filter((offer) =>
      point.offers?.includes(offer.id)
    ) : [];

    const pointPresenter = new PointPresenter(
      this.#pointsModel.getOffers(),
      destination,
      pointOffers,
      this.#routePointListElement.element,
      this.#pointsModel.getDestinations(),
      this.#handleModeChange,
      this.#handlePointDataChange
    );

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderBoard() {
    if (this.#pointsArray.length > 0) {
      if (this.#tripControlFilters) {
        render(new Filter(filters), this.#tripControlFilters);
      }
      render(new Sort(sorts), this.#tripEvents);
      render(this.#routePointListElement, this.#tripEvents);

      for (let i = 0; i < this.#pointsArray.length; i++) {
        this.#renderPoint(this.#pointsArray[i]);
      }
    } else {
      render(new EmptyPointsView(), this.#tripEvents);
    }
  }
}
