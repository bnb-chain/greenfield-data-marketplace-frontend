import styled from '@emotion/styled';
import { Button, Table } from '@totejs/uikit';
import { usePagination } from '../../hooks/usePagination';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { CreateGroup, getBucketList } from '../../utils/gfSDK';
import { GF_CHAIN_ID } from '../../env';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { formatDateUTC, generateGroupName } from '../../utils/';
import { ListModal } from '../modal/listModal';
import { useCollectionList } from '../../hooks/useCollectionList';
import { useDelist } from '../../hooks/useDelist';

const CollectionList = () => {
  const { handlePageChange, page } = usePagination();

  const { address } = useAccount();
  const { list, loading } = useCollectionList();
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState({});

  const { switchNetwork } = useSwitchNetwork();
  const navigator = useNavigate();

  const { delist } = useDelist();

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
        const { bucket_info, listed, groupId } = data;
        const { bucket_name, id } = bucket_info;
        return (
          <div>
            <Button
              size={'sm'}
              onClick={async () => {
                if (!listed) {
                  sessionStorage.setItem('resource_type', '0');
                  setDetail(bucket_info);
                  await switchNetwork?.(GF_CHAIN_ID);
                  setOpen(true);
                } else {
                  console.log(groupId);
                  console.log(await delist(groupId));
                }
              }}
            >
              {!listed ? 'List' : 'Delist'}
            </Button>
            <Button
              onClick={() => {
                sessionStorage.setItem('collection_name', bucket_name);
                sessionStorage.setItem('resource_type', '0');
                navigator(`/resource?id=${id}&type=collection&tab=overview`);
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
      <ListModal
        isOpen={open}
        handleOpen={() => {
          setOpen(false);
        }}
        detail={detail}
      ></ListModal>
    </Container>
  );
};

export default CollectionList;

const Container = styled.div`
  width: 1123px;
`;
