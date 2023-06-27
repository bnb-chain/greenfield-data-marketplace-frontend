import { useCallback, useEffect, useState } from 'react';
import { generateGroupName, parseGroupName } from '../utils';
import {
  getCollectionInfo,
  getGroupInfoByName,
  headGroupNFT,
  getObjectInfo,
  getObjectInfoByName,
  getCollectionInfoByName,
} from '../utils/gfSDK';
import { useListedStatus } from './useListedStatus';
import { toast } from '@totejs/uikit';

interface IType {
  groupId?: string;
  bucketId?: string;
  objectId?: string;
  address: string;
  groupName?: string;
  update?: boolean;
}
export const useResourceInfo = ({
  groupId,
  bucketId,
  objectId,
  address,
  groupName,
  update,
}: IType) => {
  const [baseInfo, setBaseInfo] = useState(<any>{});
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  //   const { type, name } = parseGroupName(groupName);

  const { checkListed } = useListedStatus();

  const getBaseInfo = useCallback(async () => {
    try {
      let bucketInfo: any;
      let objectName = '';
      let bucketName = '';
      if (groupName) {
        const { name, type, bucketName: _ } = parseGroupName(groupName);
        if (type === 'Data') {
          objectName = name;
          bucketName = _;
        }
      }
      if (bucketId || bucketName) {
        let result;
        if (bucketId) {
          result = await getCollectionInfo(bucketId);
        } else {
          result = await getCollectionInfoByName(bucketName);
        }
        bucketInfo = result.bucketInfo;
        const { bucketName: _bucketName } = bucketInfo;
        if (_bucketName) {
          groupName = generateGroupName(_bucketName);
          bucketName = bucketInfo.bucketName;
        }
      }

      let objectInfo: any;
      if (objectId || (objectName && bucketName)) {
        let result;
        if (objectId) {
          result = await getObjectInfo(objectId);
        } else {
          result = await getObjectInfoByName(bucketName, objectName);
        }

        objectInfo = result.objectInfo;
        objectName = objectInfo.objectName;
        bucketName = objectInfo.bucketName;

        groupName = generateGroupName(bucketName, objectName);
      }

      if (groupName && !groupId) {
        const { groupInfo } = await getGroupInfoByName(groupName, address);
        groupId = groupInfo?.id;
      }

      if (groupName && groupId) {
        const { name, bucketName, type } = parseGroupName(groupName);
        let result;
        if (type === 'Collection') {
          result = await getCollectionInfoByName(bucketName);
          bucketInfo = result.bucketInfo;
        } else {
          result = await getObjectInfoByName(bucketName, name);
          objectInfo = result.objectInfo;
        }
      }

      // owner collection & list
      if (groupName && groupId) {
        const _promise = groupId
          ? checkListed(groupId as string)
          : Promise.resolve(false);

        Promise.all([_promise, getGroupInfoByName(groupName, address)])
          .then(async (result: any) => {
            const [listed, groupResult] = result;
            const {
              groupInfo: { extra, owner },
            } = groupResult;
            const { price, url, desc } = JSON.parse(extra);

            setBaseInfo({
              name: objectName || bucketName,
              type: objectName ? 'Data' : 'Collection',
              price,
              url,
              desc,
              owner,
              listed,
              groupName,
              extra,
              bucketName,
              objectInfo,
              bucketInfo,
            });
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setBaseInfo({
          name: objectName || bucketName,
          bucketName,
          listed: false,
          owner: address,
          objectInfo,
          bucketInfo,
          groupName,
        });
        setLoading(false);
      }
    } catch (e: any) {
      setNoData(true);
      setLoading(false);
      toast.error({
        description: e.message,
      });
    }
  }, [groupId, address, bucketId, objectId, update]);
  useEffect(() => {
    setNoData(false);
    setLoading(true);
    getBaseInfo();
  }, [groupId, address, bucketId, objectId, update]);

  return { baseInfo, loading, noData };
};
