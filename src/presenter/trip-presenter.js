
import Point from '../view/route-point-view.js';
import CreateForm from '../view/form-edit-view.js';
import TripEvents from '../view/trip-events-view.js';
import Filter from '../view/filters-view.js';      
import Sort from '../view/sort-view.js';      
import EmptyPointsView from '../view/empty-points-view.js';     

import { render, RenderPosition } from '../framework/render.js';
import { filters } from '../mock/filter.js';
import { sorts } from '../mock/sort.js';

export default class TripPresenter {

  #container = null;
  #pointsModel = null;
  #pointView = [];

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    const points = this.#pointsModel.getPoints();
    const destinations = this.#pointsModel.getDestinations();

    let tripControls = document.querySelector('.trip-controls');
    if (!tripControls) {
      tripControls = document.createElement('section');
      tripControls.className = 'trip-controls';
      tripControls.innerHTML = '<h2 class="visually-hidden">Filter</h2>';
      const tripMain = document.querySelector('.trip-main');
      if (tripMain) tripMain.appendChild(tripControls);
    }

    render(new Filter(filters), tripControls, RenderPosition.BEFOREEND);
    render(new Sort(sorts), tripControls, RenderPosition.BEFOREEND);


    if (points.length === 0) {
      render(new EmptyPointsView(), this.#container, RenderPosition.BEFOREEND);
      return;
    }

    const tripEventsComponent = new TripEvents();
    render(tripEventsComponent, this.#container, RenderPosition.BEFOREEND);

    const eventsList = document.querySelector('.trip-events__list');
    if (!eventsList) return;

    eventsList.innerHTML = '';

    points.forEach(point => {
      const destination = destinations.find(dest => dest.id === point.destination);
      const offersByType = this.#pointsModel.getOffersByType(point.type);
      const pointOffers = offersByType ? offersByType.offers.filter(offer =>
        point.offers?.includes(offer.id)
      ) : [];

      this.#renderPoint(point, pointOffers, destination);
    });
  }

  #renderPoint(point, offers, destination) {
    let currentForm = null;
    let escKeyHandler = null;

    const pointView = new Point(point, destination, offers);

    const eventsList = document.querySelector('.trip-events__list');
    render(pointView, eventsList, RenderPosition.BEFOREEND);
    this.#pointView.push(pointView);

    const closeForm = () => {
      if (currentForm) {
        currentForm.element.replaceWith(pointView.element);
        currentForm = null;
      }
      if (escKeyHandler) {
        document.removeEventListener('keydown', escKeyHandler);
        escKeyHandler = null;
      }
    };

    const onOpenEditButtonClick = () => {
      if (currentForm) {
        closeForm();
      }

      escKeyHandler = (evt) => {
        if (evt.key === 'Escape') {
          evt.preventDefault();
          closeForm();
        }
      };

      const form = new CreateForm(
        point,
        destination,
        offers,
        closeForm,
        closeForm,
        closeForm
      );
      
      pointView.element.replaceWith(form.element);
      form.setHandlers();
      currentForm = form;
      document.addEventListener('keydown', escKeyHandler);
    };

    pointView.setRollupClickHandler(onOpenEditButtonClick);
  }
}