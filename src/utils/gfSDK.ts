import { GF_RPC_URL, GF_CHAIN_ID } from '../env';
import { Client } from '@bnb-chain/greenfield-chain-sdk';

export const getSingleton = function () {
  let client: Client | null;
  return function () {
    if (!client) {
      client = Client.create(GF_RPC_URL, String(GF_CHAIN_ID));
    }
    return client;
  };
};

export const getClient = getSingleton();

export const client = getClient();

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

export const getRandomSp = async () => {
  const sps = await client.sp.getStorageProviders();
  const finalSps = (sps ?? []).filter(
    (v: any) => v?.description?.moniker !== 'QATest',
  );
  return finalSps[Math.floor(Math.random() * finalSps.length)].endpoint;
};

export const multiTx = async (list: any) => {
  return await client.basic.multiTx(list);
};

export const getBucketList = async (address: string) => {
  const endpoint = await getRandomSp();
  const bucketList = client.bucket.getUserBuckets({
    address,
    endpoint,
  });

  return bucketList;
};

export const getQuota = async (bucketName: string) => {
  try {
    const endpoint = await getRandomSp();
    const { code, body } = await client.bucket.getBucketReadQuota({
      bucketName,
      endpoint,
    });
    if (code !== 0 || !body) {
      console.error(`Get bucket read quota met error. Error code: ${code}`);
      return null;
    }
    const { freeQuota, readQuota, consumedQuota } = body;
    return {
      freeQuota,
      readQuota,
      consumedQuota,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('get bucket read quota error', error);
    return null;
  }
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

export const putObjectPolicy = async (
  bucketName: string,
  ObjectName: string,
  srcMsg: any,
) => {
  return await client.object.putObjectPolicy(bucketName, ObjectName, srcMsg);
};

export const putBucketPolicy = async (bucketName: string, srcMsg: any) => {
  return await client.bucket.putBucketPolicy(bucketName, srcMsg);
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

export const getObjectInfoByName = async (
  bucketName: string,
  objectName: string,
) => {
  return await client.object.headObject(bucketName, objectName);
};

export const updateGroupInfo = async (
  address: string,
  groupName: string,
  extra: string,
) => {
  return await client.group.updateGroupExtra({
    operator: address,
    groupOwner: address,
    groupName,
    Extra: extra,
  });
};

export const mirrorGroup = async (
  groupName: string,
  id: string,
  operator: string,
) => {
  return await client.crosschain.mirrorGroup({
    groupName,
    id,
    operator,
  });
};

export const getCollectionInfo = async (bucketId: string) => {
  return await client.bucket.headBucketById(bucketId);
};

export const getCollectionInfoByName = async (bucketName: string) => {
  return await client.bucket.headBucket(bucketName);
};

export const searchKey = async (key: string) => {
  console.log(
    key,
    'dm_',
    JSON.stringify({
      sourceType: 'SOURCE_TYPE_ORIGIN',
      limit: 0,
      offset: 20,
    }),
  );
  try {
    return await client.sp.listGroup(key, 'dm_', {
      sourceType: 'SOURCE_TYPE_ORIGIN',
      limit: 1000,
      offset: 0,
    });
  } catch (e) {
    return [];
  }
};
