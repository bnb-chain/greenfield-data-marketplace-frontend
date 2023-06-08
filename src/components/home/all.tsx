import styled from '@emotion/styled';
import { Button, Table } from '@totejs/uikit';
import { usePagination } from '../../hooks/usePagination';
import { useNavigate } from 'react-router-dom';
import { formatDateUTC, trimLongStr, divide10Exp, delay } from '../../utils';
import { useGetListed } from '../../hooks/useGetListed';
import BN from 'bn.js';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { useBuy } from '../../hooks/useBuy';
import { BSC_CHAIN_ID } from '../../env';
import { BuyResult } from '../modal/buyResult';
import { useState } from 'react';
import { useApprove } from '../../hooks/useApprove';
import { useStatus } from '../../hooks/useStatus';

const ActionCom = (obj: any) => {
  const navigator = useNavigate();
  const { data, address } = obj;
  const { id, groupName, ownerAddress, type, price } = data;

  const { status } = useStatus(groupName, ownerAddress, address);

  const { buy } = useBuy(groupName, ownerAddress, price);
  const { switchNetwork } = useSwitchNetwork();

  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState('');
  const [description, setDescription] = useState('');

  const { Approve } = useApprove();
  return (
    <div>
      {status == 1 && (
        <Button
          size={'sm'}
          onClick={async () => {
            sessionStorage.setItem(
              'resource_type',
              type === 'collection' ? '0' : '1',
            );
            await switchNetwork?.(BSC_CHAIN_ID);
            await delay(1);
            await Approve();
            await buy(id).then(
              (result) => {
                setOpen(true);
                setVariant('success');
                setDescription('Purchase successful');
                console.log(result);
              },
              (error) => {
                setOpen(true);
                setVariant('error');
                setDescription(error.code ? error.message : 'Purchase failed');
                console.log(error);
              },
            );
          }}
        >
          Buy
        </Button>
      )}
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
      <BuyResult
        variant={variant}
        isOpen={open}
        handleOpen={() => {
          setOpen(false);
        }}
        description={description}
      ></BuyResult>
    </div>
  );
};
const AllList = () => {
  const { handlePageChange, page } = usePagination();

  const navigator = useNavigate();

  const { list, loading } = useGetListed();
  const { address } = useAccount();

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
        return <ActionCom data={data} address={address}></ActionCom>;
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
