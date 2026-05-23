import { render, replace, remove } from '../framework/render.js';
import Point from '../view/route-point-view.js';
import CreateForm from '../view/form-edit-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #point = null;
  #offers = [];
  #destination = null;
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

  constructor(offers, destination, pointsListComponent, onModeChange, onDataChange) {
    this.#offers = offers;
    this.#destination = destination;
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
      offers: this.#offers,
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
      offers: this.#offers,
      destination: this.#destination,
      onFormSubmit: () => {
        const formData = this.#pointFormComponent.getFormData();
        const updatedPoint = {
          ...this.#point,
          ...formData
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
  
    // При первом запуске
    if (prevPointComponent === null) {
      render(this.#pointComponent, this.#pointsListComponent);
      return;
    }
  
    // При обновлении данных
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
    }
  }
  #replacePointToForm() {
    if (this.#mode === Mode.EDITING) {
      return;
    }
    replace(this.#pointFormComponent, this.#pointComponent);
    this.#handleModeChange(this);
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