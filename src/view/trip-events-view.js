import AbstractView from '../framework/view/abstract-view.js';
function createTripEventsTemplate() {
  return `
      <ul class="trip-events__list"></ul>
  `;
}

export default class TripEvents extends AbstractView{
  get template() {
    return createTripEventsTemplate();
  }
}
