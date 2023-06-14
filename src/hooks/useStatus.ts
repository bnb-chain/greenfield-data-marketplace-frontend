import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { checkAddressInGroup } from '../utils/gfSDK';

export const useStatus = (
  groupName: string,
  groupOwner: string,
  member: string,
) => {
  // -1 do not login
  // 0 owner
  // 1 Waiting for purchase
  // 2 purchase
  const { address } = useAccount();
  const [status, setStatus] = useState(address ? 0 : -1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (address) setStatus(0);
    if (address && address !== groupOwner) {
      checkAddressInGroup(groupName, groupOwner, member)
        .then((result) => {
          if (result) {
            setStatus(2);
          } else {
            setStatus(1);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [groupName, address]);

  return { loading, status };
};
