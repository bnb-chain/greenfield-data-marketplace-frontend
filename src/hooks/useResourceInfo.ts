import { useEffect, useState } from 'react';
import { parseGroupName } from '../utils';
import { headGroupNFT } from '../utils/gfSDK';

export const useResourceInfo = (groupId: string) => {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    headGroupNFT(groupId)
      .then((result) => {
        const {
          metaData: { attributes, groupName },
        } = result as any;
        const [owner, , , , extra] = attributes;
        const { type, name } = parseGroupName(groupName);
        return {
          ...result,
          name,
          groupName,
          type,
          ownerAddress: owner.value,
          price: JSON.parse(extra.value).price,
        };
      })
      .catch((err) => {
        setInfo({});
      })
      .finally(() => {
        setLoading(false);
      });
  }, [groupId]);

  return { info, loading };
};
