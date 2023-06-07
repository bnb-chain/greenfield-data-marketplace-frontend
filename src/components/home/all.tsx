import styled from '@emotion/styled';
import { Button, Table } from '@totejs/uikit';
import { usePagination } from '../../hooks/usePagination';
import { useNavigate } from 'react-router-dom';
import { formatDateUTC, trimLongStr, divide10Exp } from '../../utils';
import { useGetListed } from '../../hooks/useGetListed';
import BN from 'bn.js';

const AllList = () => {
  const { handlePageChange, page } = usePagination();

  const navigator = useNavigate();

  const { list, loading } = useGetListed();

  const columns = [
    {
      header: 'Data',
      cell: (data: any) => {
        const { name } = data;
        return <div>{name}</div>;
      },
    },
    {
      header: 'Type',
      cell: (data: any) => {
        const { type } = data;
        return <div>{type}</div>;
      },
    },
    {
      header: 'Price',
      width: 160,
      cell: (data: any) => {
        const { price } = data;
        const balance = divide10Exp(new BN(price, 10), 18);
        return <div>{balance} BNB</div>;
      },
    },
    {
      header: 'Data Listed',
      width: 160,
      cell: (data: any) => {
        const { listTime } = data;
        return <div>{formatDateUTC(listTime * 1000)}</div>;
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
      header: 'Creator',
      width: 120,
      cell: (data: any) => {
        const { ownerAddress } = data;
        return <div>{trimLongStr(ownerAddress)}</div>;
      },
    },
    {
      header: 'Action',
      cell: (data: any) => {
        const { id } = data;
        return (
          <div>
            <Button
              size={'sm'}
              onClick={async () => {
                sessionStorage.setItem('resource_type', '0');
              }}
            >
              List
            </Button>
            <Button
              onClick={() => {
                // sessionStorage.setItem('collection_name', bucket_name);
                // sessionStorage.setItem('resource_type', '0');
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
    </Container>
  );
};

export default AllList;

const Container = styled.div`
  width: 1123px;
`;
