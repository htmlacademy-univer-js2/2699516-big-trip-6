import { getRandomPoint } from "../mock/point.js";
import { mockOffer } from "../mock/offer.js";
import { mockDestination } from "../mock/destination.js";

const POINT_COUNT = 4;

export default class PointModel {
  #points = Array.from({ length: POINT_COUNT }, getRandomPoint);
  #destinations = mockDestination;
  #offers = mockOffer;

  getPoints() {
    return this.#points;
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
    if (!offersType) return [];
    return offersType.offers.filter((item) => itemsId?.includes(item.id));
  }
}