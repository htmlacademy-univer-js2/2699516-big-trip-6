import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { SortType } from '../const.js';

dayjs.extend(duration);

const getDurationDiff = (point) => dayjs(point.dateTo).diff(dayjs(point.dateFrom));

const sortPointsByType = {
  [SortType.DAY]: (firstPoint, secondPoint) => dayjs(firstPoint.dateFrom).diff(dayjs(secondPoint.dateFrom)),
  [SortType.TIME]: (firstPoint, secondPoint) => getDurationDiff(secondPoint) - getDurationDiff(firstPoint),
  [SortType.PRICE]: (firstPoint, secondPoint) => secondPoint.basePrice - firstPoint.basePrice,
};

function sortPoints(points, sortType) {
  const sortFn = sortPointsByType[sortType];

  if (!sortFn) {
    return [...points];
  }

  return [...points].sort(sortFn);
}

export { sortPoints };
