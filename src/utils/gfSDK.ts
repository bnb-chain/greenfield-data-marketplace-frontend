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

const getRandomSp = async () => {
  const sps = await client.sp.getStorageProviders();
  const finalSps = (sps ?? []).filter(
    (v: any) => v?.description?.moniker !== 'QATest',
  );
  return finalSps[Math.floor(Math.random() * finalSps.length)].endpoint;
};

export const getBucketList = async (address: string) => {
  const endpoint = await getRandomSp();
  const bucketList = client.bucket.getUserBuckets({
    address,
    endpoint,
  });

  return bucketList;
};

export const getBucketFileList = async ({ bucketName }: any) => {
  const endpoint = await getRandomSp();
  const fileList = await client.object.listObjects({
    bucketName,
    endpoint,
  });

  return fileList;
};

interface MsgCreateGroup {
  /** owner defines the account address of group owner who create the group */
  creator: string;
  /** group_name defines the name of the group. it's not globally unique. */
  groupName: string;
  /** member_request defines a list of member which to be add or remove */
  members: string[];

  extra: string;
}

export const CreateGroup = async (params: MsgCreateGroup) => {
  return await client.group.createGroup(params);
};

export const getGroupInfoByName = async (
  groupName: string,
  groupOwner: string,
) => {
  try {
    return await client.group.headGroup(groupName, groupOwner);
  } catch (e) {
    return {};
  }
};

export const checkGroupExistByName = async (
  groupName: string,
  groupOwner: string,
) => {
  const o = await getGroupInfoByName(groupName, groupOwner);
  return Object.keys(o).length;
};

export const checkGroupExistById = async (tokenId: string) => {
  const o = await headGroupNFT(tokenId);
  return Object.keys(o).length;
};

export const checkAddressInGroup = async (
  groupName: string,
  groupOwner: string,
  member: string,
) => {
  try {
    return await client.group.headGroupMember(groupName, groupOwner, member);
  } catch (e) {
    return false;
  }
};

export const headGroupNFT = async (tokenId: string) => {
  try {
    return await client.group.headGroupNFT({ tokenId });
  } catch (e) {
    return {};
  }
};

export const getObjectInfo = async (objectId: string) => {
  return await client.object.headObjectById(objectId);
};

export const mirrorGroup = async (id: string, operator: string) => {
  return await client.crosschain.mirrorGroup({
    groupName: '',
    id,
    operator,
  });
};

export const getCollectionInfo = async (bucketId: string) => {
  return await client.bucket.headBucketById(bucketId);
};
