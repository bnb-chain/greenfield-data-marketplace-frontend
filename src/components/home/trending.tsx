import styled from '@emotion/styled';
import { Button, Table } from '@totejs/uikit';
import { usePagination } from '../../hooks/usePagination';
import { useNavigate } from 'react-router-dom';
import { formatDateUTC } from '../../utils';

import { useTrendingList } from '../../hooks/useTrendingList';

const TrendingList = () => {
  const { handlePageChange, page } = usePagination();

  const navigator = useNavigate();

  const { list, loading } = useTrendingList();

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
        const { bucket_info } = data;
        const { bucket_name, id } = bucket_info;
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
    </Container>
  );
};

export default TrendingList;

const Container = styled.div`
  width: 1123px;
`;
