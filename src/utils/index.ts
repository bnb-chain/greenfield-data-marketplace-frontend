import { format, utcToZonedTime } from 'date-fns-tz';

export const trimLongStr = (
  str: string,
  maxLength = 14,
  headLen = 4,
  footLen = 8,
) => {
  if (!str) {
    return '';
  }
  if (str.length > maxLength) {
    const head = str.substring(0, headLen);
    const foot = str.substring(str.length - footLen, str.length);
    return `${head}...${foot}`;
  }
  return str;
};

const formatStr = "MMM-dd-yyyy hh:mm:ss aa '+UTC'";

export const formatDateUTC = (date: number | string) => {
  const numDate = Number(date);
  const zonedTime = utcToZonedTime(numDate, 'UTC');
  return format(zonedTime, formatStr, { timeZone: 'UTC' });
};
