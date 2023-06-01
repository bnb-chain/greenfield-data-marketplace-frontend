import { GF_RPC_URL, GF_CHAIN_ID } from '../env';
import { Client } from '@bnb-chain/greenfield-chain-sdk';

export const client = Client.create(GF_RPC_URL, String(GF_CHAIN_ID));

export const getSps = async () => {
  const sps = await client.sp.getStorageProviders();
  const finalSps = (sps ?? []).filter(
    (v: any) => v?.description?.moniker !== 'QATest',
  );

  return finalSps;
};

export const selectSp = async () => {
  const finalSps = await getSps();
  const selectIndex = 0;
  const secondarySpAddresses = [
    ...finalSps.slice(0, selectIndex),
    ...finalSps.slice(selectIndex + 1),
  ].map((item) => item.operatorAddress);
  const selectSpInfo = {
    endpoint: finalSps[selectIndex].endpoint,
    primarySpAddress: finalSps[selectIndex]?.operatorAddress,
    sealAddress: finalSps[selectIndex].sealAddress,
    secondarySpAddresses,
  };

  return selectSpInfo;
};

export const getBucketList = async (address: string) => {
  const sps = await client.sp.getStorageProviders();
  const finalSps = (sps ?? []).filter(
    (v: any) => v?.description?.moniker !== 'QATest',
  );
  console.log(finalSps);
  const bucketList = client.bucket.getUserBuckets({
    address,
    endpoint: finalSps[0].endpoint,
  });

  return bucketList;
};

export const getBucketFileList = async ({ bucketName, endpoint }: any) => {
  const fileList = await client.object.listObjects({
    bucketName,
    endpoint,
  });

  return fileList;
};
