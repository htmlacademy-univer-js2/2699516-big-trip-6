import dayjs from 'dayjs';
import { FilterType } from '../const.js';

const isPointFuture = (dateFrom) => dayjs(dateFrom).isAfter(dayjs());

const isPointPresent = (dateFrom, dateTo) => {
  const now = dayjs();
  return !now.isBefore(dayjs(dateFrom)) && !now.isAfter(dayjs(dateTo));
};

const isPointPast = (dateTo) => dayjs(dateTo).isBefore(dayjs());

const filterPointsByType = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point.dateTo)),
};

export {
  filterPointsByType,
  isPointFuture,
  isPointPresent,
  isPointPast,
};
