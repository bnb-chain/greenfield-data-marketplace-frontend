import { useCallback, useEffect, useState } from 'react';
import { generateGroupName, parseGroupName } from '../utils';
import {
  getCollectionInfo,
  getGroupInfoByName,
  headGroupNFT,
  getObjectInfo,
  getObjectInfoByName,
} from '../utils/gfSDK';
import { useListedStatus } from './useListedStatus';

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

  //   const { type, name } = parseGroupName(groupName);

  const { checkListed } = useListedStatus();

  const getBaseInfo = useCallback(async () => {
    const info: any = {};

    let bucketInfoRes: any;
    console.log(objectId, '-------objectId111');
    let objectName = '';
    let bucketName = '';
    if (groupName) {
      const { name, type, bucketName: _ } = parseGroupName(groupName);
      if (type === 'Data') {
        objectName = name;
        bucketName = _;
      }
    }
    let objectInfo: any;
    if (objectId) {
      console.log(objectId, '------objectInfo22');
      objectInfo = await getObjectInfo(objectId);

      objectName = objectInfo.object_name;
    }
    console.log(
      groupId,
      bucketId,
      objectId,
      address,
      groupName,
      update,
      '------useResourceInfo',
    );
    if (bucketId && !groupName) {
      bucketInfoRes = await getCollectionInfo(bucketId);
      console.log(bucketInfoRes, '------bucketInfoRes');
      const {
        bucketInfo: { bucketName },
      } = bucketInfoRes;
      console.log(bucketInfoRes);
      if (bucketName) {
        groupName = generateGroupName(bucketName);
      }
    }

    // owner collection & list
    if (groupName) {
      if (groupId) {
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
            const { name, type, bucketName } = parseGroupName(
              groupName as string,
            );

            const objectInfo = {};
            if (objectName && bucketName) {
              console.log(objectName, bucketName, '-----objectName,bucketName');
              const obj = await getObjectInfoByName(bucketName, objectName);
              console.log(obj, '----objectInfo');
            }
            setBaseInfo({
              name,
              type,
              price,
              url,
              desc,
              owner,
              listed,
              groupName,
              extra,
              bucketName,
            });
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        const {
          bucketInfo: { bucketName, owner },
        } = bucketInfoRes;
        setBaseInfo({
          name: bucketName,
          listed: false,
          owner,
        });
        setLoading(false);
      }
    }

    console.log(bucketId, info);
  }, [groupId, address, bucketId, objectId, update]);
  useEffect(() => {
    getBaseInfo();
    // const _promise = groupId
    //   ? Promise.resolve(false)
    //   : checkListed(groupId as string);
    // if (!objectId) {
    //   console.log(groupName, address);
    //   Promise.all([_promise, getGroupInfoByName(groupName, address)])
    //     .then((result: any) => {
    //       const [listed, groupResult] = result;
    //       const {
    //         groupInfo: { extra, owner, groupName },
    //       } = groupResult;
    //       const { price, url, desc } = JSON.parse(extra);
    //       setBaseInfo({
    //         name: parseGroupName(groupName).name,
    //         price,
    //         url,
    //         desc,
    //         owner,
    //         listed,
    //       });
    //     })
    //     .finally(() => {
    //       setLoading(false);
    //     });
    // } else {
    // }
  }, [groupId, address, bucketId, objectId, update]);

  return { baseInfo, loading };
};
