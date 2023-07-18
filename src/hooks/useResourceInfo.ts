import { useCallback, useEffect, useState } from 'react';
import { generateGroupName, parseGroupName } from '../utils';
import {
  getCollectionInfo,
  getGroupInfoByName,
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
        const {
          name: _name,
          bucketName: _bucketName,
          type,
        } = parseGroupName(groupName);
        let result;
        if (type === 'Collection') {
          result = await getCollectionInfoByName(_bucketName);
          bucketInfo = result.bucketInfo;
          bucketName = bucketInfo.bucketName;
        } else {
          result = await getObjectInfoByName(_bucketName, _name);
          objectInfo = result.objectInfo;
          bucketName = objectInfo.bucketName;
          objectName = objectInfo.objectName;
        }
      }

      // If it is currently data, it is necessary to determine whether its collection has been listed
      let bucketListed = false;
      let bucketListedId;
      if (bucketName) {
        const groupName = generateGroupName(bucketName);
        const { groupInfo } = await getGroupInfoByName(groupName, address);
        bucketListedId = groupInfo?.id;
        bucketListed = !!(await checkListed(bucketListedId as string));
      }
      // owner list
      if (groupName && groupId) {
        let _promise;
        if (groupId) {
          if (bucketListed || (bucketListedId === groupId && objectInfo))
            _promise = Promise.resolve(true);
          else {
            _promise = checkListed(groupId as string);
          }
        } else {
          _promise = Promise.resolve(false);
        }

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
              bucketListed,
              id: groupId,
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
          bucketListed,
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
