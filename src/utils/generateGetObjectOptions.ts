import {
  generateUrlByBucketName,
  isValidUrl,
} from '@bnb-chain/greenfield-chain-sdk';
import {
  getObjectPropsType,
  requestParamsType,
  validateBucketName,
  validateObjectName,
} from './file';

import { encodeObjectName } from '.';
import { getClient } from './gfSDK';

export const generateGetObjectOptions = async (
  configParam: getObjectPropsType,
): Promise<requestParamsType> => {
  const { bucketName, objectName, endpoint, userAddress, domain, seedString } =
    configParam;
  if (!isValidUrl(endpoint)) {
    throw new Error('Invalid endpoint');
  }
  validateBucketName(bucketName);
  validateObjectName(objectName);
  const url =
    generateUrlByBucketName(endpoint, bucketName) +
    '/' +
    encodeObjectName(objectName);
  const client = await getClient();
  const { code, body } = await client.offchainauth.sign(seedString);
  if (code !== 0) {
    throw new Error('Failed to sign');
  }
  const headers = new Headers({
    Authorization: body?.authorization || '',
    'X-Gnfd-User-Address': userAddress,
    'X-Gnfd-App-Domain': domain,
  });
  return {
    url,
    headers,
    method: 'get',
  };
};
