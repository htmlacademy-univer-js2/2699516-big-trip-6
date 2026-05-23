import AbstractView from '../framework/view/abstract-view.js';

function createEmptyPointsTemplate() {
  return `
    <p class="trip-events__msg">Нужно добавить новое событие</p>
  `;
}

export default class EmptyPointsView extends AbstractView {
  get template() {
    return createEmptyPointsTemplate();
  }
}
