import { useCallback, useEffect, useState } from 'react';
import { generateGroupName, parseGroupName } from '../utils';
import {
  getCollectionInfo,
  getGroupInfoByName,
  headGroupNFT,
  getObjectInfo,
} from '../utils/gfSDK';
import { useListedStatus } from './useListedStatus';

interface IType {
  groupId?: string;
  bucketId?: string;
  objectId?: string;
  address: string;
  groupName?: string;
}
export const useResourceInfo = ({
  groupId,
  bucketId,
  objectId,
  address,
  groupName,
}: IType) => {
  const [baseInfo, setBaseInfo] = useState(<any>{});
  const [loading, setLoading] = useState(true);

  //   const { type, name } = parseGroupName(groupName);

  const { checkListed } = useListedStatus();

  const getBaseInfo = useCallback(async () => {
    const info: any = {};

    let bucketInfoRes: any;

    let objectInfo: any;
    if (objectId) {
      objectInfo = await getObjectInfo(objectId);
    }

    if (bucketId && !groupName) {
      bucketInfoRes = await getCollectionInfo(bucketId);
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
          .then((result: any) => {
            const [listed, groupResult] = result;
            const {
              groupInfo: { extra, owner },
            } = groupResult;
            const { price, url, desc } = JSON.parse(extra);
            setBaseInfo({
              name: parseGroupName(groupName as string).name,
              price,
              url,
              desc,
              owner,
              listed,
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
  }, [groupId, address, bucketId, objectId]);
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
  }, [groupId, address, bucketId, objectId]);

  return { baseInfo, loading };
};
