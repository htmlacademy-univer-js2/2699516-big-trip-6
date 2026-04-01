import AbstractView from '../framework/view/abstract-view.js';

function formatDateTime(dateString) {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', '');
}

function createFormTemplate(point, destination, offers){
  const isNew = !point;
  const pointData = point || {
    type: 'flight',
    basePrice: 0,
    dateRrom: '',
    dateTo: '',
    isFavorite: false,
    offers: []
  };

  return `
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${pointData.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${pointData.type === 'taxi' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>
              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${pointData.type === 'bus' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>
              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${pointData.type === 'train' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>
              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${pointData.type === 'ship' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>
              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${pointData.type === 'drive' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>
              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${pointData.type === 'flight' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>
              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${pointData.type === 'check-in' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>
              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${pointData.type === 'sightseeing' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>
              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${pointData.type === 'restaurant' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${pointData.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" 
                 name="event-destination" value="${destination ? destination.name : ''}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destination ? `<option value="${destination.name}"></option>` : ''}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" 
                 name="event-start-time" value="${formatDateTime(pointData.dateFrom)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" 
                 name="event-end-time" value="${formatDateTime(pointData.dateTo)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" 
                 name="event-price" value="${pointData.basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${isNew ? 'Save' : 'Save'}</button>
        <button class="event__reset-btn" type="reset">${isNew ? 'Cancel' : 'Delete'}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${offers.map((offer) => `
              <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" 
                       name="event-offer-${offer.id}" ${pointData.offers?.includes(offer.id) ? 'checked' : ''}>
                <label class="event__offer-label" for="event-offer-${offer.id}-1">
                  <span class="event__offer-title">${offer.title}</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${offer.price}</span>
                </label>
              </div>
            `).join('')}
          </div>
        </section>
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination ? destination.description : ''}</p>
        </section>
      </section>
    </form>
  `;
}

export default class CreateForm extends AbstractView{

  #point = null;
  #destination = null;
  #offers = [];
  #onSubmit = null;
  #onRollupClick = null;
  #onCancelClick = null;

  constructor(point = null, destination = null, offers = [], onSubmit, onRollupClick,onCancelClick) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#onSubmit = onSubmit;
    this.#onRollupClick = onRollupClick;
    this.#onCancelClick = onCancelClick;
  }

  get template() {
    return createFormTemplate(this.#point, this.#destination, this.#offers);
  }

  setHandlers() {
    const formElement = this.element.querySelector('form');
    const rollupBtn = this.element.querySelector('.event__rollup-btn');
    const resetBtn = this.element.querySelector('.event__reset-btn');

    if (formElement) {
      formElement.addEventListener('submit', (evt) => {
        evt.preventDefault();
        this.#onSubmit();
      });
    }

    if (rollupBtn) {
      rollupBtn.addEventListener('click', () => {
        this.#onRollupClick();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', (evt) => {
        evt.preventDefault();
        this.#onCancelClick();
      });
    }
  }
}
