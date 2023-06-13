import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../base/request';

export const useAddressTx = (
  address: string,
  type: string,
  page: number,
  pageSize: number,
) => {
  return useQuery(
    ['addressTx', address, type, page, pageSize],
    async () => {
      return (
        await apiClient.get<{ data: any }>(
          `tx/getAssetTransferByAddress?address=${address}&type=${type}&pageSize=${pageSize}&page=${page}`,
        )
      ).data.data;
    },
    {
      enabled: !!address,
      staleTime: 1000 * 5,
      keepPreviousData: true,
    },
  );
};
