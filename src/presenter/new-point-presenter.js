import CreateForm from '../view/form-edit-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UserAction } from '../const.js';

export default class NewPointPresenter {
  #container = null;
  #allOffers = null;
  #destinations = null;
  #onDataChange = null;
  #onClose = null;
  #formComponent = null;

  #escKeyHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#onClose();
      document.removeEventListener('keydown', this.#escKeyHandler);
    }
  };

  constructor({ container, allOffers, destinations, onDataChange, onClose }) {
    this.#container = container;
    this.#allOffers = allOffers;
    this.#destinations = destinations;
    this.#onDataChange = onDataChange;
    this.#onClose = onClose;
  }

  init() {
    this.#formComponent = new CreateForm({
      isEdit: false,
      offers: this.#allOffers,
      destinations: this.#destinations,
      point: {
        type: 'flight',
        dateFrom: '',
        dateTo: '',
        basePrice: 0,
        offers: [],
      },
      onFormSubmit: async (state) => {
        const selectedDestination = this.#destinations.find((item) => item.name === state.destination);

        if (!selectedDestination) {
          return;
        }

        const newPoint = {
          type: state.type,
          basePrice: Number(state.basePrice),
          dateFrom: state.dateFrom,
          dateTo: state.dateTo,
          destination: selectedDestination.id,
          offers: state.offers,
          isFavorite: false,
        };

        this.#formComponent.setSaving();

        try {
          await this.#onDataChange(UserAction.ADD_POINT, newPoint);
          document.removeEventListener('keydown', this.#escKeyHandler);
        } catch {
          this.#formComponent.shake();
        } finally {
          this.#formComponent.resetButtons();
        }
      },
      onCancelClick: () => {
        this.#onClose();
        document.removeEventListener('keydown', this.#escKeyHandler);
      },
    });

    render(this.#formComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyHandler);
  }

  destroy() {
    document.removeEventListener('keydown', this.#escKeyHandler);
    remove(this.#formComponent);
    this.#formComponent = null;
  }
}
