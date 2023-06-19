import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

export const getMillisecond = (second: number) => {
  return second * 1000;
};

export const convertToSecond = (millisecond: number) => {
  return Math.floor(millisecond / 1000);
};

export const getUtcZeroTimestamp = () => {
  dayjs.extend(utc);

  return dayjs().utc().valueOf();
};

export const convertTimeStampToDate = (utcTimestamp: number) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  // utc-0 timezone
  const tz = 'Iceland';

  return dayjs(utcTimestamp).tz(tz).format();
};

export const formatTime = (utcZeroTimestamp = 0) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const curTimezone = dayjs.tz.guess();
  const zeroToCurTimezone = dayjs(utcZeroTimestamp).tz(curTimezone);
  const now = dayjs();

  if (zeroToCurTimezone.isBefore(now, 'day')) {
    return zeroToCurTimezone.format('MMM D, YYYY');
  }

  if (zeroToCurTimezone.isSame(now, 'day')) {
    return zeroToCurTimezone.format('HH:mm A');
  }

  return '--';
};

export const formatFullTime = (
  utcZeroTimestamp = 0,
  format?: 'MMM D, YYYY HH:mm A' | 'YYYY-MM-DD HH:mm:ss',
) => {
  const formatStyle = format || 'MMM D, YYYY HH:mm A';
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const curTimezone = dayjs.tz.guess();

  return `${dayjs(utcZeroTimestamp)
    .tz(curTimezone)
    .format(formatStyle)} (UTC${dayjs(utcZeroTimestamp)
    .tz(curTimezone)
    .format('Z')})`;
};
