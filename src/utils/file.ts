import { isValidUrl } from '@bnb-chain/greenfield-js-sdk';

const IP_REGEX = /^(\d+\.){3}\d+$/g;
const ALLOW_REGEX = /^[a-z0-9][a-z0-9.\-]{1,61}[a-z0-9]$/g;
const dotdotComponent = '..';
const dotComponent = '.';
const slashSeparator = '/';

export interface getObjectPropsType {
  bucketName: string;
  objectName: string;
  endpoint?: string;
  duration?: number;
  userAddress: string;
  domain: string;
  seedString: string;
}

export interface requestParamsType {
  url: string;
  headers: Headers;
  method: string;
}

export interface putObjectPropsType {
  bucketName: string;
  objectName: string;
  txnHash: string;
  body: Blob;
  endpoint?: string;
  duration?: number;
  userAddress: string;
  domain: string;
  seedString: string;
}

const hasBadPathComponent = (path: string): boolean => {
  const newPath = path.trim();
  for (const p of newPath.split(slashSeparator)) {
    switch (p.trim()) {
      case dotdotComponent:
      case dotComponent:
        return true;
    }
  }
  return false;
};

const isUTF8 = (str: string): boolean => {
  try {
    new TextDecoder('utf-8').decode(new TextEncoder().encode(str));
    return true;
  } catch {
    return false;
  }
};
const validateBucketName = (bucketName?: string) => {
  if (!bucketName) {
    throw new Error('Bucket name is empty, please check.');
  }
  const length = bucketName.length;
  if (length < 3 || length > 63) {
    throw new Error(
      `Bucket name length is required to be between 3~63, please check.`,
    );
  }
  if (bucketName.match(IP_REGEX)) {
    throw new Error(
      'The bucket name %s cannot be formatted as an IP address, please check.',
    );
  }
  if (
    bucketName.includes('..') ||
    bucketName.includes('.-') ||
    bucketName.includes('-.')
  ) {
    throw new Error('Bucket name contains invalid characters, please check.');
  }
  if (!bucketName.match(ALLOW_REGEX)) {
    throw new Error(
      'Bucket name can only include lowercase letters, numbers, commas and hyphen, please check.',
    );
  }
  if (
    bucketName[0] === '-' ||
    bucketName[length - 1] === '-' ||
    bucketName[0] === '.' ||
    bucketName[length - 1] === '.'
  ) {
    throw new Error(
      'Bucket name %must start and end with a lowercase letter or number, please check.',
    );
  }
};
const validateObjectName = (objectName?: string) => {
  if (!objectName) {
    throw new Error('Object name is empty, please check.');
  }
  if (objectName.length > 1024) {
    throw new Error('Object name is limited to 1024 at most, please check.');
  }
  if (hasBadPathComponent(objectName)) {
    throw new Error('Object name error, please check.');
  }
  if (!isUTF8(objectName)) {
    throw new Error('Object name is not in UTF-8 format, please check.');
  }
  if (objectName.includes(`//`)) {
    throw new Error(`Object name that contains a "//" is not supported`);
  }
};
const generateUrlByBucketName = (endpoint = '', bucketName: string) => {
  if (!isValidUrl(endpoint)) {
    throw new Error('Invalid endpoint');
  }
  validateBucketName(bucketName);
  const { protocol } = new URL(endpoint);
  return endpoint.replace(`${protocol}//`, `${protocol}//${bucketName}.`);
};
export {
  generateUrlByBucketName,
  validateBucketName,
  validateObjectName,
  isUTF8,
  hasBadPathComponent,
};
