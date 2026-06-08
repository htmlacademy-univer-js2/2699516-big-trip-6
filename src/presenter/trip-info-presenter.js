import TripInfoView from '../view/trip-info-view.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { getTripTitle, getTripDates, getTripCost } from '../utils/trip-info.js';

export default class TripInfoPresenter {
  #container = null;
  #pointsModel = null;
  #tripInfoComponent = null;

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#pointsModel.addObserver(this.#handleModelChange);
    this.#render();
  }

  #handleModelChange = () => {
    this.#render();
  };

  #render() {
    const points = this.#pointsModel.getPoints();
    const prevComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView({
      title: getTripTitle(points, this.#pointsModel),
      dates: getTripDates(points),
      cost: getTripCost(points, this.#pointsModel),
    });

    if (prevComponent === null) {
      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevComponent);
    remove(prevComponent);
  }
}
