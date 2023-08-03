import { IReturnOffChainAuthKeyPairAndUpload } from '@bnb-chain/greenfield-js-sdk';
import { getUtcZeroTimestamp } from '../time';
import { GF_CHAIN_ID } from '../../env';

const isEmpty = (obj: object) => {
  return Object.keys(obj).length === 0;
};
const GREENFIELD_CHAIN_ID = GF_CHAIN_ID;
export const setOffChainData = ({
  address,
  chainId,
  offChainData,
}: {
  address: string;
  chainId: number;
  offChainData: IReturnOffChainAuthKeyPairAndUpload;
}) => {
  const key = `${address}-${chainId}`;
  const oldData = localStorage.getItem(key);

  const newSpAddresses = offChainData.spAddresses;

  // Compatible the previous version data
  const parseOldData = (oldData && JSON.parse(oldData)) || [];
  const compatibleOldData = Array.isArray(parseOldData)
    ? parseOldData
    : [parseOldData];
  // Removing old data containing input sp data
  const pruneOldData =
    compatibleOldData
      .filter((item: IReturnOffChainAuthKeyPairAndUpload) => {
        const oldSpAddresses = item.spAddresses;
        const prune = oldSpAddresses.filter((x: string) =>
          newSpAddresses.includes(x),
        );

        return prune.length === 0;
      })
      .map((item: IReturnOffChainAuthKeyPairAndUpload) => {
        const oldSpAddresses = item.spAddresses;
        const prune = oldSpAddresses.filter(
          (x: string) => !newSpAddresses.includes(x),
        );

        return {
          ...item,
          spAddresses: prune,
        };
      }) || [];

  localStorage.setItem(key, JSON.stringify([...pruneOldData, offChainData]));
};

export const getOffChainList = ({
  address,
  chainId = GREENFIELD_CHAIN_ID,
}: {
  address: string;
  chainId?: number | string;
}) => {
  const key = `${address}-${chainId}`;
  const localData = localStorage.getItem(key);
  const parseLocalData = (localData && JSON.parse(localData)) || [];
  const compatibleLocalData = Array.isArray(parseLocalData)
    ? parseLocalData
    : [parseLocalData];

  return compatibleLocalData as IReturnOffChainAuthKeyPairAndUpload[];
};
export const getSpOffChainData = ({
  address,
  chainId = GREENFIELD_CHAIN_ID,
  spAddress,
}: {
  address: string;
  chainId?: number | string;
  spAddress: string;
}): IReturnOffChainAuthKeyPairAndUpload => {
  const key = `${address}-${chainId}`;
  const localData = localStorage.getItem(key);
  const curTime = getUtcZeroTimestamp();

  // Compatible the previous version data
  const parseLocalData = (localData && JSON.parse(localData)) || [];
  const compatibleOldData = Array.isArray(parseLocalData)
    ? parseLocalData
    : [parseLocalData];

  const offChainDataItem = compatibleOldData
    .filter((item: IReturnOffChainAuthKeyPairAndUpload) => {
      return item.expirationTime > curTime;
    })
    .find((item: IReturnOffChainAuthKeyPairAndUpload) => {
      return item.spAddresses.includes(spAddress);
    });

  return isEmpty(offChainDataItem) ? {} : offChainDataItem;
};

export const removeOffChainData = (address: string, chainId: number) => {
  const key = `${address}-${chainId}`;
  localStorage.removeItem(key);
};

export const checkSpOffChainDataAvailable = (
  spOffChainData: IReturnOffChainAuthKeyPairAndUpload,
) => {
  const curTime = getUtcZeroTimestamp();

  return !isEmpty(spOffChainData) && spOffChainData.expirationTime > curTime;
};

export const checkOffChainDataAvailable = (
  offChainList: IReturnOffChainAuthKeyPairAndUpload[],
) => {
  if (isEmpty(offChainList)) return false;
  const curTime = getUtcZeroTimestamp();
  const checkedOffChainData = offChainList.filter(
    (item: IReturnOffChainAuthKeyPairAndUpload) => {
      return item.expirationTime > curTime;
    },
  );

  return !isEmpty(checkedOffChainData);
};

export const checkHaveSp = (spAddress: string, spAddresses: string[]) => {
  return spAddresses.includes(spAddress);
};

export const getGAOptions = (name: string) => {
  const options: Record<string, string> = {
    MetaMask: 'dc.walletconnect.modal.metamak.click',
    'Trust Wallet': 'dc.walletconnect.modal.trustwallet.click',
  };

  return options[name];
};

export const getGNFDChainId = () => {
  return GREENFIELD_CHAIN_ID;
};
