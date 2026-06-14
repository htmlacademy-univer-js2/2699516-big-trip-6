import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import { humanizeDate, humanizeTime, getDuration } from '../utils/date-format.js';
import { escapeHTML } from '../utils/escape.js';

function createPointTemplate(point, destination, offers) {
  const offersList = Array.isArray(offers) && offers.length > 0 ? offers.map((offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${escapeHTML(offer.title)}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `).join('') : '';

  const favoriteClass = point.isFavorite ? 'event__favorite-btn--active' : '';
  const destinationName = destination ? escapeHTML(destination.name) : '';

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dayjs(point.dateFrom).format('YYYY-MM-DD')}">${humanizeDate(point.dateFrom)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${point.type} ${destinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dayjs(point.dateFrom).format()}">${humanizeTime(point.dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dayjs(point.dateTo).format()}">${humanizeTime(point.dateTo)}</time>
          </p>
          <p class="event__duration">${getDuration(point.dateFrom, point.dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersList}
        </ul>
        <button class="event__favorite-btn ${favoriteClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
}


export default class Point extends AbstractView {

  #point = null;
  #destination = null;
  #offers = [];
  #onEditClick = null;
  #onFavoriteClick = null;


  constructor({ point, offers, destination, onEditClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#onEditClick = onEditClick;
    this.#onFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editHandlerClick);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteHandlerClick);
  }

  get template() {
    return createPointTemplate(this.#point, this.#destination, this.#offers);
  }

  #editHandlerClick = (evt) => {
    evt.preventDefault();
    this.#onEditClick();
  };

  #favoriteHandlerClick = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };
}
