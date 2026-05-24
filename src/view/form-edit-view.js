import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { humanizeDateTime } from '../utils/date-format.js';
import { escapeHTML } from '../utils/escape.js';
import { ButtonText } from '../const.js';

function createDestinationSection(state) {
  if (!state.description && (!state.pictures || state.pictures.length === 0)) {
    return '';
  }

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${state.description ? `<p class="event__destination-description">${escapeHTML(state.description)}</p>` : ''}
      ${state.pictures?.length > 0 ? `
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${state.pictures.map((picture) => `
              <img class="event__photo" src="${picture.src}" alt="${picture.description || 'Event photo'}">
            `).join('')}
          </div>
        </div>
      ` : ''}
    </section>
  `;
}

function createFormButtons(isEdit) {
  if (isEdit) {
    return `
      <button class="event__save-btn  btn  btn--blue" type="submit">${ButtonText.SAVE}</button>
      <button class="event__reset-btn" type="button">${ButtonText.DELETE}</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Close event</span>
      </button>
    `;
  }

  return `
    <button class="event__save-btn  btn  btn--blue" type="submit">${ButtonText.SAVE}</button>
    <button class="event__reset-btn" type="button">Cancel</button>
  `;
}

function createFormTemplate(state, allOffers, destinations, isEdit) {
  const currentOffers = allOffers.find((item) => item.type === state.type)?.offers || [];

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${state.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${allOffers.map((offer) => `
                  <div class="event__type-item">
                    <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}" ${state.type === offer.type ? 'checked' : ''}>
                    <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${offer.type}</label>
                  </div>
                `).join('')}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${state.type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text"
                   name="event-destination" value="${escapeHTML(state.destination || '')}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinations.map((destination) => `
                <option value="${escapeHTML(destination.name)}"></option>
              `).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text"
                   name="event-start-time" value="${humanizeDateTime(state.dateFrom)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text"
                   name="event-end-time" value="${humanizeDateTime(state.dateTo)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text"
                   name="event-price" value="${state.basePrice}">
          </div>

          ${createFormButtons(isEdit)}
        </header>
        <section class="event__details">
          ${currentOffers.length > 0 ? `
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
                ${currentOffers.map((offer) => `
                  <div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1" type="checkbox"
                           name="event-offer-${offer.id}" ${state.offers?.includes(offer.id) ? 'checked' : ''}>
                    <label class="event__offer-label" for="event-offer-${offer.id}-1">
                      <span class="event__offer-title">${escapeHTML(offer.title)}</span>
                      &plus;&euro;&nbsp;
                      <span class="event__offer-price">${offer.price}</span>
                    </label>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
          ${createDestinationSection(state)}
        </section>
      </form>
    </li>
  `;
}

export default class CreateForm extends AbstractStatefulView {
  #allOffers = null;
  #destinations = null;
  #isEdit = false;
  #onSubmit = null;
  #onCancelClick = null;
  #onDeleteClick = null;
  #startDatepicker = null;
  #endDatepicker = null;

  constructor({ point, destination, offers, destinations, isEdit = false, onFormSubmit, onCancelClick, onDeleteClick }) {
    super();
    this.#allOffers = offers;
    this.#destinations = destinations;
    this.#isEdit = isEdit;
    this.#onSubmit = onFormSubmit;
    this.#onCancelClick = onCancelClick;
    this.#onDeleteClick = onDeleteClick;

    this._setState({
      type: point?.type || 'flight',
      destination: isEdit ? (destination?.name || '') : '',
      dateFrom: isEdit ? (point?.dateFrom || '') : '',
      dateTo: isEdit ? (point?.dateTo || '') : '',
      basePrice: isEdit ? (point?.basePrice ?? '') : (point?.basePrice ?? 0),
      offers: point?.offers || [],
      description: isEdit ? (destination?.description || '') : '',
      pictures: isEdit ? (destination?.pictures || []) : []
    });

    this._restoreHandlers();
  }

  get template() {
    return createFormTemplate(this._state, this.#allOffers, this.#destinations, this.#isEdit);
  }

  setSaving() {
    const saveButton = this.element.querySelector('.event__save-btn');

    if (saveButton) {
      saveButton.textContent = ButtonText.SAVING;
      saveButton.disabled = true;
    }
  }

  setDeleting() {
    const deleteButton = this.element.querySelector('.event__reset-btn');

    if (deleteButton) {
      deleteButton.textContent = ButtonText.DELETING;
      deleteButton.disabled = true;
    }
  }

  resetButtons() {
    const saveButton = this.element.querySelector('.event__save-btn');

    if (saveButton) {
      saveButton.textContent = ButtonText.SAVE;
      saveButton.disabled = false;
    }

    if (this.#isEdit) {
      const deleteButton = this.element.querySelector('.event__reset-btn');

      if (deleteButton) {
        deleteButton.textContent = ButtonText.DELETE;
        deleteButton.disabled = false;
      }
    }
  }

  removeElement() {
    if (this.#startDatepicker) {
      this.#startDatepicker.destroy();
      this.#startDatepicker = null;
    }

    if (this.#endDatepicker) {
      this.#endDatepicker.destroy();
      this.#endDatepicker = null;
    }

    super.removeElement();
  }

  _restoreHandlers() {
    const form = this.element.querySelector('form');
    const resetBtn = this.element.querySelector('.event__reset-btn');
    const rollupBtn = this.element.querySelector('.event__rollup-btn');
    const typeGroup = this.element.querySelector('.event__type-group');
    const destinationInput = this.element.querySelector('.event__input--destination');
    const priceInput = this.element.querySelector('.event__input--price');
    const offersSection = this.element.querySelector('.event__available-offers');

    if (form) {
      form.addEventListener('submit', this.#formSubmitHandler);
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', this.#isEdit ? this.#deleteClickHandler : this.#cancelClickHandler);
    }
    if (rollupBtn) {
      rollupBtn.addEventListener('click', this.#cancelClickHandler);
    }
    if (typeGroup) {
      typeGroup.addEventListener('change', this.#typeChangeHandler);
    }
    if (destinationInput) {
      destinationInput.addEventListener('change', this.#destinationChangeHandler);
    }
    if (priceInput) {
      priceInput.addEventListener('input', this.#priceInputHandler);
      priceInput.addEventListener('change', this.#priceChangeHandler);
    }
    if (offersSection) {
      offersSection.addEventListener('change', this.#offerChangeHandler);
    }

    this.#setDatepicker();
  }

  #setDatepicker() {
    const startElement = this.element.querySelector('#event-start-time-1');
    const endElement = this.element.querySelector('#event-end-time-1');

    if (!startElement || !endElement) {
      return;
    }

    this.#startDatepicker = flatpickr(startElement, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateFrom || null,
      onChange: this.#startDateChangeHandler,
    });

    this.#endDatepicker = flatpickr(endElement, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateTo || null,
      minDate: this._state.dateFrom || null,
      onChange: this.#endDateChangeHandler,
    });
  }

  #startDateChangeHandler = ([selectedDate]) => {
    if (!selectedDate) {
      return;
    }

    this._setState({
      dateFrom: selectedDate.toISOString(),
    });

    if (this.#endDatepicker) {
      this.#endDatepicker.set('minDate', selectedDate);
    }
  };

  #endDateChangeHandler = ([selectedDate]) => {
    if (!selectedDate) {
      return;
    }

    this._setState({
      dateTo: selectedDate.toISOString(),
    });
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#destinations.find((item) => item.name === evt.target.value);

    if (!selectedDestination) {
      this.shake(() => {
        evt.target.value = this._state.destination;
      });
      return;
    }

    this.updateElement({
      destination: evt.target.value,
      description: selectedDestination.description || '',
      pictures: selectedDestination.pictures || []
    });
  };

  #priceInputHandler = (evt) => {
    evt.target.value = evt.target.value.replace(/\D/g, '');
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      basePrice: evt.target.value
    });
  };

  #offerChangeHandler = (evt) => {
    const offerId = evt.target.name.replace('event-offer-', '');
    const offers = evt.target.checked
      ? [...this._state.offers, offerId]
      : this._state.offers.filter((id) => id !== offerId);

    this._setState({ offers });
  };

  #formSubmitHandler = async (evt) => {
    evt.preventDefault();

    const selectedDestination = this.#destinations.find((item) => item.name === this._state.destination);

    if (!selectedDestination) {
      const destinationInput = this.element.querySelector('.event__input--destination');
      this.shake(() => {
        destinationInput.value = this._state.destination;
      });
      return;
    }

    await this.#onSubmit(this._state);
  };

  #deleteClickHandler = async (evt) => {
    evt.preventDefault();
    await this.#onDeleteClick();
  };

  #cancelClickHandler = (evt) => {
    evt.preventDefault();
    this.#onCancelClick();
  };
}
