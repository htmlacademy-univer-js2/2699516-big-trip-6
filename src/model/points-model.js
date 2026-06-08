import Observable from '../framework/observable.js';

export default class PointModel extends Observable {
  #tripApi = null;
  #points = [];
  #destinations = [];
  #offers = [];
  #hasLoadError = false;

  constructor({tripApi}) {
    super();
    this.#tripApi = tripApi;
  }

  hasLoadError() {
    return this.#hasLoadError;
  }

  async init() {
    try {
      this.#points = await this.#tripApi.getPoints();
    } catch {
      this.#points = [];
      this.#hasLoadError = true;
    }

    try {
      this.#destinations = await this.#tripApi.getDestinations();
    } catch {
      this.#destinations = [];
    }

    try {
      this.#offers = await this.#tripApi.getOffers();
    } catch {
      this.#offers = [];
    }
  }

  getPoints() {
    return [...this.#points];
  }

  setPoints(points) {
    this.#points = points;
  }

  getDestinations() {
    return this.#destinations;
  }

  getOffers() {
    return this.#offers;
  }

  getDestinationById(id) {
    return this.#destinations.find((item) => item.id === id);
  }

  getOffersByType(type) {
    return this.#offers.find((item) => item.type === type);
  }

  getOffersById(type, itemsId) {
    const offersType = this.getOffersByType(type);

    if (!offersType) {
      return [];
    }

    return offersType.offers.filter((item) => itemsId?.includes(item.id));
  }

  async updatePoint(updateType, point) {
    const updatedPoint = await this.#tripApi.updatePoint(point);
    const index = this.#points.findIndex((item) => item.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points[index] = updatedPoint;
    this._notify(updateType, updatedPoint);
  }

  async addPoint(updateType, point) {
    const newPoint = await this.#tripApi.createPoint(point);
    this.#points.push(newPoint);
    this._notify(updateType);
  }

  async deletePoint(updateType, pointId) {
    await this.#tripApi.deletePoint(pointId);
    this.#points = this.#points.filter((point) => point.id !== pointId);
    this._notify(updateType);
  }
}
