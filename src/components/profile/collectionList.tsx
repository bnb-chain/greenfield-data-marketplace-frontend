import styled from '@emotion/styled';
import { Button, Table } from '@totejs/uikit';
import { usePagination } from '../../hooks/usePagination';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { CreateGroup, getBucketList } from '../../utils/gfSDK';
import { GF_CHAIN_ID } from '../../env';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { formatDateUTC } from '../../utils/';

const CollectionList = () => {
  const { handlePageChange, page } = usePagination();

  const { address } = useAccount();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const { switchNetwork } = useSwitchNetwork();
  const navigator = useNavigate();

  useEffect(() => {
    getBucketList(address as string).then((result: any) => {
      setLoading(false);
      const { statusCode, body } = result;
      if (statusCode == 200 && Array.isArray(body)) {
        setList(body as any);
      }
      console.log(result);
    });
  }, [address]);

  const List = useCallback(async (bucketName: string) => {
    const { simulate, broadcast } = await CreateGroup({
      creator: address as string,
      groupName: bucketName,
      members: [],
    });
    const simulateInfo = await simulate({
      denom: 'BNB',
    });
    console.log(simulateInfo);
  }, []);
  const columns = [
    {
      header: 'Data Collection',
      cell: (data: any) => {
        const {
          bucket_info: { bucket_name },
        } = data;
        return <div>{bucket_name}</div>;
      },
    },
    {
      header: 'Data Created',
      width: 160,
      cell: (data: any) => {
        const {
          bucket_info: { create_at },
        } = data;
        return <div>{formatDateUTC(create_at * 1000)}</div>;
      },
    },
    {
      header: 'Price',
      width: 160,
      cell: (data: any) => {
        return <div>-</div>;
      },
    },
    {
      header: 'Total Vol',
      width: 120,
      cell: (data: any) => {
        return <div>-</div>;
      },
    },
    {
      header: 'Action',
      cell: (data: any) => {
        const {
          bucket_info: { id },
        } = data;
        return (
          <div>
            <Button
              size={'sm'}
              onClick={async () => {
                await switchNetwork?.(GF_CHAIN_ID);
                List(`dm_b_${id}`);
              }}
            >
              List
            </Button>
            <Button
              onClick={() => {
                navigator(`/resource?type=collection&tab=overview&id=${id}`);
              }}
              size={'sm'}
              style={{ marginLeft: '6px' }}
            >
              View detail
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <Container>
      <Table
        headerContent={`Latest ${Math.min(
          20,
          list.length,
        )}  Collections (Total of ${list.length})`}
        containerStyle={{ padding: 20 }}
        pagination={{
          current: page,
          pageSize: 20,
          total: list.length,
          onChange: handlePageChange,
        }}
        columns={columns}
        data={list}
        loading={loading}
      />
    </Container>
  );
};

export default CollectionList;

const Container = styled.div`
  width: 1123px;
  height: 664px;
`;
