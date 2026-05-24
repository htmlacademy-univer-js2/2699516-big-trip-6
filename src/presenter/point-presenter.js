import { render, replace, remove } from '../framework/render.js';
import Point from '../view/route-point-view.js';
import CreateForm from '../view/form-edit-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #point = null;
  #allOffers = null;
  #pointOffers = [];
  #destination = null;
  #destinations = null;
  #mode = Mode.DEFAULT;
  #pointComponent = null;
  #pointFormComponent = null;
  #pointsListComponent = null;

  #handleModeChange = null;
  #handleDataChange = null;

  #escKeyHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyHandler);
    }
  };

  constructor(allOffers, destination, pointOffers, pointsListComponent, destinations, onModeChange, onDataChange) {
    this.#allOffers = allOffers;
    this.#destination = destination;
    this.#pointOffers = pointOffers;
    this.#destinations = destinations;
    this.#pointsListComponent = pointsListComponent;
    this.#handleModeChange = onModeChange;
    this.#handleDataChange = onDataChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevFormComponent = this.#pointFormComponent;

    this.#pointComponent = new Point({
      point: this.#point,
      offers: this.#pointOffers,
      destination: this.#destination,
      onEditClick: () => {
        this.#replacePointToForm();
        document.addEventListener('keydown', this.#escKeyHandler);
      },
      onFavoriteClick: () => {
        this.#handleFavoriteClick();
      }
    });

    this.#pointFormComponent = new CreateForm({
      point: this.#point,
      destination: this.#destination,
      offers: this.#allOffers,
      destinations: this.#destinations,
      onFormSubmit: (state) => {
        const selectedDestination = this.#destinations.find((item) => item.name === state.destination);
        const updatedPoint = {
          ...this.#point,
          type: state.type,
          basePrice: Number(state.basePrice),
          dateFrom: state.dateFrom,
          dateTo: state.dateTo,
          destination: selectedDestination ? selectedDestination.id : this.#point.destination,
          offers: state.offers,
        };
        this.#handleDataChange(updatedPoint);
        this.#replaceFormToPoint();
        document.removeEventListener('keydown', this.#escKeyHandler);
      },
      onCancelClick: () => {
        this.#replaceFormToPoint();
        document.removeEventListener('keydown', this.#escKeyHandler);
      }
    });

    if (prevPointComponent === null) {
      render(this.#pointComponent, this.#pointsListComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    } else {
      replace(this.#pointFormComponent, prevFormComponent);
    }

    remove(prevPointComponent);
    remove(prevFormComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyHandler);
    }
  }

  #replacePointToForm() {
    if (this.#mode === Mode.EDITING) {
      return;
    }
    this.#handleModeChange();
    replace(this.#pointFormComponent, this.#pointComponent);
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }
    replace(this.#pointComponent, this.#pointFormComponent);
    this.#mode = Mode.DEFAULT;
  }

  #handleFavoriteClick = () => {
    const updatedPoint = {
      ...this.#point,
      is_favorite: !this.#point.is_favorite
    };
    this.#handleDataChange(updatedPoint);
  };
}
