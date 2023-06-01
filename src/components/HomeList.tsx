import styled from '@emotion/styled';
import { NavBar } from './NavBar';
import { useCallback } from 'react';
import { Table } from '@totejs/uikit';
import { usePagination } from '..//hooks/usePagination';

enum Type {
  Trending = 'Trending',
  All = 'All',
}
const navItems = [
  {
    name: 'Trending',
    key: Type.Trending,
  },
  {
    name: 'All',
    key: Type.All,
  },
];

const HomeList = () => {
  const { handlePageChange, page } = usePagination();
  const currentTab = Type.Trending;

  const handleTabChange = useCallback((tab: any) => {
    console.log(tab);
  }, []);

  const columns = [
    {
      header: '#',
      width: 160,
      cell: (data: any) => {
        return <div>{data}</div>;
      },
    },
    {
      header: 'Data',
      cell: (data: any) => {
        return <div>{data}</div>;
      },
    },
    {
      header: 'Type',
      width: 160,
      cell: (data: any) => {
        return <div>{data}</div>;
      },
    },
    {
      header: 'Price',
      width: 160,
      cell: (data: any) => {
        return <div>{data}</div>;
      },
    },
    {
      header: 'TotalVal',
      width: 120,
      cell: (data: any) => {
        return <div>{data}</div>;
      },
    },
    {
      header: 'Creator',
      cell: (data: any) => {
        return <div>{data}</div>;
      },
    },
  ];
  return (
    <Container>
      <NavBar active={currentTab} onChange={handleTabChange} items={navItems} />
      <Table
        containerStyle={{ padding: 0 }}
        pagination={{
          current: page,
          pageSize: 20,
          total: 1,
          onChange: handlePageChange,
        }}
        columns={columns}
        data={[]}
      />
    </Container>
  );
};

export default HomeList;

const Container = styled.div`
  margin-top: 60px;

  width: 1123px;
  height: 664px;
`;
