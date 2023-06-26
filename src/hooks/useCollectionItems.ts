import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getBucketFileList, getGroupInfoByName } from '../utils/gfSDK';
import { generateGroupName } from '../utils';
import { useListedStatus } from './useListedStatus';
import { Tree, str2tree, tree2str } from '../utils/tree';

export const cache: { [str: string]: any } = {};

export const useCollectionItems = (bucketName: string) => {
  // 0 owner
  // 1 Waiting for purchase
  // 2 purchase
  const { address } = useAccount();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [num, setNum] = useState(0);

  const { checkListed } = useListedStatus();
  useEffect(() => {
    if (bucketName && address) {
      getBucketFileList({ bucketName })
        .then((result: any) => {
          const { body, code } = result;

          if (code == 0) {
            const { key_count, objects } = body;

            const strColl = objects.map((item: any) => {
              const {
                object_info: { object_name, id },
              } = item;
              // folder
              let hasFolder = false;
              if (object_name.indexOf('/')) hasFolder = true;
              return hasFolder
                ? object_name.slice(0, -1) + '__' + id + '/'
                : object_name + '__' + id;
              // return object_name;
            });

            const tree = new Tree(strColl.join('\n'));

            const _objInfo: { [str: string]: any } = {};

            const t = objects.map(async (item: any) => {
              const {
                object_info: { bucket_name, object_name, id: objectId },
              } = item;
              // folder
              if (object_name.slice(-1) === '/') return {};

              const groupName = generateGroupName(bucket_name, object_name);
              const { groupInfo } = await getGroupInfoByName(
                groupName,
                address as string,
              );
              if (!groupInfo) {
                _objInfo[objectId] = item;
                return item;
              } else {
                const { id } = groupInfo;
                const result = await checkListed(id);

                const t = {
                  ...item,
                  groupId: id,
                  listed: !!result,
                  price: result,
                };
                _objInfo[objectId] = t;
                return t;
              }
            });
            Promise.all(t)
              .then(() => {
                // res = res.filter((item: any) => !!item.object_info);

                tree.orderTraverse((item: any) => {
                  const { _id } = item;
                  Object.assign(item, _objInfo[_id] || {});
                });

                cache[bucketName] = tree;

                setList(tree.list);
              })
              .catch((error) => {
                setList([]);
              })
              .finally(() => {
                setLoading(false);
              });

            setNum(key_count);
          } else {
            setList([]);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [bucketName, address]);

  return { loading, list, num };
};
