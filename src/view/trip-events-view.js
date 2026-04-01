import AbstractView from '../framework/view/abstract-view.js';
function createTripEventsTemplate() {
  return `
    <section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>
      <ul class="trip-events__list"></ul>
    </section>
  `;
}

export default class TripEvents extends AbstractView{
  get template() {
    return createTripEventsTemplate();
  }
}