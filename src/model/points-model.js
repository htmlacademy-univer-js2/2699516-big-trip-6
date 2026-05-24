import { getInitialPoints } from '../mock/point.js';
import { mockOffer } from '../mock/offer.js';
import { mockDestination } from '../mock/destination.js';
import Observable from '../framework/observable.js';

export default class PointModel extends Observable {
  #points = getInitialPoints();
  #destinations = mockDestination;
  #offers = mockOffer;

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

  updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      return false;
    }

    this.#points[index] = { ...this.#points[index], ...updatedPoint };
    this._notify(updateType, updatedPoint);

    return true;
  }

  addPoint(updateType, point) {
    this.#points.push(point);
    this._notify(updateType);
  }

  deletePoint(updateType, pointId) {
    this.#points = this.#points.filter((point) => point.id !== pointId);
    this._notify(updateType);
  }
}
