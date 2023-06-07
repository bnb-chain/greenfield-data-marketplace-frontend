import { format, utcToZonedTime } from 'date-fns-tz';
import ReactDOM from 'react-dom';
import BN from 'bn.js';

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

export const batchUpdate = (fn: () => void) => {
  ReactDOM.unstable_batchedUpdates(fn);
};

export const delay = (s: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, s * 1000);
  });
};

export const removeTrailingZero = (str: string) => {
  return str.replace(/0+$/, '');
};

/**
 * divide BN with 10^n
 * for example:
 * divide10Exp(123456789, 3) => 123456.789
 * @param origin
 * @param pow
 */
const ZERO = new BN(0);
export const divide10Exp = (origin: BN, pow: number) => {
  if (origin.eq(ZERO)) {
    return '0';
  }
  const divisor = new BN(10).pow(new BN(pow));
  if (origin.lt(divisor)) {
    const str = origin.toString(10, pow);
    return '0.' + removeTrailingZero(str);
  } else {
    const mod = origin.mod(divisor);
    const intPartStr = origin.div(divisor).toString();
    if (mod.eq(ZERO)) {
      return intPartStr;
    } else {
      return intPartStr + '.' + removeTrailingZero(mod.toString(10, pow));
    }
  }
};
