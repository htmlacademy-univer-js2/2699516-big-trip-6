import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';

function humanizeDate(date) {
  if (!date) {
    return '';
  }
  return dayjs(date).format('MMM D').toUpperCase();
}

function humanizeDateTime(date) {
  if (!date) {
    return '';
  }
  return dayjs(date).format(DATE_TIME_FORMAT);
}

function humanizeTime(date) {
  if (!date) {
    return '';
  }
  return dayjs(date).format('HH:mm');
}

function getDuration(dateFrom, dateTo) {
  if (!dateFrom || !dateTo) {
    return '';
  }
  const durationDiff = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));
  const hours = Math.floor(durationDiff.asHours());
  const minutes = durationDiff.minutes();

  return hours > 0
    ? `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`
    : `${minutes}M`;
}

export {
  DATE_TIME_FORMAT,
  humanizeDate,
  humanizeDateTime,
  humanizeTime,
  getDuration,
};
