import AbstractView from '../framework/view/abstract-view.js';

function createEmptyPointsTemplate() {
  return `
    <section class="trip-events">
      <p class="trip-events__msg">Нужно добавить новое событие</p>
    </section>
  `;
}

export default class EmptyPointsView extends AbstractView {
  get template() {
    return createEmptyPointsTemplate();
  }
}
