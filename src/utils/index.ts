import { format, utcToZonedTime } from 'date-fns-tz';
import ReactDOM from 'react-dom';
import BN from 'bn.js';
import Identicon from 'identicon.js';
import sha265 from 'sha256';

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

// const formatStr = "MMM-dd-yyyy hh:mm:ss aa '+UTC'";
const formatStr = 'MMM-dd-yyyy';

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

export const generateGroupName = (bucketName: string, objName?: string) => {
  if (objName) {
    return `dm_o_${bucketName}_${objName}`;
  } else {
    return `dm_b_${bucketName}`;
  }
};

export const parseGroupName = (groupName: string) => {
  let name = groupName;
  let type = 'Collection';
  if (name.indexOf('dm_') === 0) {
    if (name.indexOf('dm_o_') === 0) {
      type = 'Data';
    }
    name = name.split('_').slice(-1)[0];
  }
  return {
    type,
    name,
  };
};

export const defaultImg = (name: string, width: number) => {
  if (!name) return '';
  const sha = sha265(name);
  const dataBase = new Identicon(sha, width).toString();
  return `data:image/png;base64,${dataBase}`;
};

export const parseFileSize = (size: number) => {
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let index = 0;
  index = Math.floor(Math.log(size) / Math.log(1024));
  const _size = size / Math.pow(1024, index);
  return _size.toFixed(2) + unitArr[index];
};
