import AbstractView from '../framework/view/abstract-view.js';
import { FilterMessage } from '../const.js';

function createEmptyPointsTemplate(filterType) {
  return `
    <p class="trip-events__msg">${FilterMessage[filterType]}</p>
  `;
}

export default class EmptyPointsView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyPointsTemplate(this.#filterType);
  }
}
