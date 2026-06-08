import AbstractView from '../framework/view/abstract-view.js';
import { FilterMessage } from '../const.js';

function createEmptyPointsTemplate(message) {
  return `
    <p class="trip-events__msg">${message}</p>
  `;
}

export default class EmptyPointsView extends AbstractView {
  #message = '';

  constructor(message) {
    super();
    this.#message = message;
  }

  get template() {
    return createEmptyPointsTemplate(this.#message);
  }

  static createFromFilter(filterType) {
    return new EmptyPointsView(FilterMessage[filterType]);
  }
}
