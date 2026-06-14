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
    isFavorite: point.isFavorite,
    offers: point.offers,
  };
}

function adaptPointToServer(point) {
  const adaptedPoint = {
    type: point.type,
    destination: point.destination,
    base_price: point.basePrice,
    date_from: point.dateFrom,
    date_to: point.dateTo,
    isFavorite: point.isFavorite,
    offers: point.offers,
  };

  if (point.id) {
    adaptedPoint.id = point.id;
  }

  return adaptedPoint;
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

  createPoint(point) {
    const adaptedPoint = adaptPointToServer(point);

    return this._load({
      url: 'points',
      method: 'POST',
      body: JSON.stringify(adaptedPoint),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(ApiService.parseResponse)
      .then(adaptPointToClient);
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

  deletePoint(pointId) {
    return this._load({
      url: `points/${pointId}`,
      method: 'DELETE',
    });
  }
}
