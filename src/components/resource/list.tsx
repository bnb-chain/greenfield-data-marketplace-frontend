import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { Box, Button, Table } from '@totejs/uikit';
import { usePagination } from '../../hooks/usePagination';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { getBucketFileList } from '../../utils/gfSDK';
import { formatDateUTC } from '../../utils/';
import { ListModal } from '../modal/listModal';
import { GF_CHAIN_ID } from '../../env';
import { useCollectionItems } from '../../hooks/useCollectionItems';

const ProfileList = (props: any) => {
  const { name, listed } = props;

  const { list, loading } = useCollectionItems(name);

  const { handlePageChange, page } = usePagination();

  const { address } = useAccount();
  const [open, setOpen] = useState(false);
  const { switchNetwork } = useSwitchNetwork();
  const [detail, setDetail] = useState({});

  // useEffect(() => {
  //   getBucketFileList({ bucketName }).then((result: any) => {
  //     setLoading(false);
  //     const { statusCode, body } = result;
  //     console.log(body);
  //     if (statusCode == 200 && Array.isArray(body)) {
  //       setList(body as any);
  //     }
  //   });
  // }, [address]);
  console.log(list);
  const columns = [
    {
      header: 'Data',
      cell: (data: any) => {
        const {
          object_info: { object_name },
        } = data;
        return <div>{object_name}</div>;
      },
    },
    {
      header: 'Type',
      width: 160,
      cell: (data: any) => {
        const {
          object_info: { content_type },
        } = data;
        return <div>{content_type.split('/')[1].toLocaleUpperCase()}</div>;
      },
    },
    {
      header: 'Size',
      width: 160,
      cell: (data: any) => {
        const {
          object_info: { payload_size },
        } = data;
        return <div>{(payload_size / 1024).toFixed(2) + 'kb'}</div>;
      },
    },
    {
      header: 'Data Created',
      width: 120,
      cell: (data: any) => {
        const {
          object_info: { create_at },
        } = data;
        return <div>{formatDateUTC(create_at * 1000)}</div>;
      },
    },
    {
      header: 'Price',
      cell: (data: any) => {
        return <div>-</div>;
      },
    },
    {
      header: 'Total Vol',
      cell: (data: any) => {
        return <div>-</div>;
      },
    },
    {
      header: 'Action',
      cell: (data: any) => {
        return (
          <div>
            {listed ? null : (
              <Button
                size={'sm'}
                onClick={async () => {
                  console.log(23);
                  // await switchNetwork?.(GF_CHAIN_ID);
                  setOpen(true);
                }}
              >
                List
              </Button>
            )}
            <Button size={'sm'} style={{ marginLeft: '6px' }}>
              View detail
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <Container>
      <Box h={10} />
      <Table
        headerContent={`Latest ${Math.min(20, list.length)}  Data (Total of ${
          list.length
        })`}
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

export default ProfileList;

const Container = styled.div`
  width: 996px;
`;
