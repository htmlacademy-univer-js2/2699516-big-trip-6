import ApiService from '../framework/api-service.js';

/* eslint-disable camelcase */
function adaptPointToClient(point) {
  return {
    id: point.id,
    type: point.type,
    destination: point.destination,
    basePrice: point.base_price,
    dateFrom: point.date_from,
    dateTo: point.date_to,
    is_favorite: point.is_favorite,
    offers: point.offers,
  };
}

function adaptPointToServer(point) {
  return {
    id: point.id,
    type: point.type,
    destination: point.destination,
    base_price: point.basePrice,
    date_from: point.dateFrom,
    date_to: point.dateTo,
    is_favorite: point.is_favorite,
    offers: point.offers,
  };
}
/* eslint-enable camelcase */

export default class TripApi extends ApiService {
  getPoints() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse)
      .then((points) => points.map(adaptPointToClient));
  }

  getDestinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  getOffers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  updatePoint(point) {
    const adaptedPoint = adaptPointToServer(point);

    return this._load({
      url: `points/${point.id}`,
      method: 'PUT',
      body: JSON.stringify(adaptedPoint),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(ApiService.parseResponse)
      .then(adaptPointToClient);
  }
}
