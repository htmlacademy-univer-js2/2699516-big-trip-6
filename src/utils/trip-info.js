import dayjs from 'dayjs';

const MAX_VISIBLE_DESTINATIONS = 3;


function getDestinationNames(points, pointsModel) {
  const sortedPoints = [...points].sort((firstPoint, secondPoint) =>
    dayjs(firstPoint.dateFrom).diff(dayjs(secondPoint.dateFrom))
  );

  return sortedPoints
    .map((point) => pointsModel.getDestinationById(point.destination)?.name)
    .filter((name, index, names) => name && names.indexOf(name) === index);
}

function getTripTitle(points, pointsModel) {
  const destinationNames = getDestinationNames(points, pointsModel);

  if (destinationNames.length === 0) {
    return '';
  }

  if (destinationNames.length <= MAX_VISIBLE_DESTINATIONS) {
    return destinationNames.join(' — ');
  }

  return `${destinationNames[0]} —...— ${destinationNames[destinationNames.length - 1]}`;
}

function getTripDates(points) {
  if (points.length === 0) {
    return '';
  }

  const sortedByStart = [...points].sort((firstPoint, secondPoint) =>
    dayjs(firstPoint.dateFrom).diff(dayjs(secondPoint.dateFrom))
  );
  const sortedByEnd = [...points].sort((firstPoint, secondPoint) =>
    dayjs(firstPoint.dateTo).diff(dayjs(secondPoint.dateTo))
  );

  const dateFrom = dayjs(sortedByStart[0].dateFrom).format('D MMM').toUpperCase();
  const dateTo = dayjs(sortedByEnd[sortedByEnd.length - 1].dateTo).format('D MMM').toUpperCase();

  return `${dateFrom} — ${dateTo}`;
}

function getOffersPrice(point, pointsModel) {
  const offersByType = pointsModel.getOffersByType(point.type);

  if (!offersByType) {
    return 0;
  }

  return point.offers.reduce((sum, offerId) => {
    const offer = offersByType.offers.find((item) => item.id === offerId);
    return sum + (offer?.price || 0);
  }, 0);
}

function getTripCost(points, pointsModel) {
  return points.reduce((sum, point) => sum + point.basePrice + getOffersPrice(point, pointsModel), 0);
}

export {
  getTripTitle,
  getTripDates,
  getTripCost,
};
