import styled from '@emotion/styled';
import { Button, Flex, Table } from '@totejs/uikit';
import { usePagination } from '../../hooks/usePagination';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { CreateGroup, getBucketList } from '../../utils/gfSDK';
import { GF_CHAIN_ID } from '../../env';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import {
  defaultImg,
  divide10Exp,
  formatDateUTC,
  generateGroupName,
} from '../../utils/';

import { useCollectionList } from '../../hooks/useCollectionList';
import { useDelist } from '../../hooks/useDelist';
import { toast } from '@totejs/uikit';
import { useModal } from '../../hooks/useModal';
import { useSalesVolume } from '../../hooks/useSalesVolume';
import { useListedStatus } from '../../hooks/useListedStatus';
import { BN } from 'bn.js';

const PriceCon = (props: any) => {
  const { groupId } = props;
  const { price } = useListedStatus(groupId);

  console.log(groupId, price);
  let balance = '-';
  if (price) {
    balance = divide10Exp(new BN(price, 10), 18) + ' BNB';
  }
  return <div>{balance}</div>;
};

const TotalVol = (props: any) => {
  const { groupId } = props;
  const { salesVolume } = useSalesVolume(groupId);
  return <div>{Number(salesVolume) || '-'}</div>;
};

const CollectionList = () => {
  const { handlePageChange, page } = usePagination();

  const { address } = useAccount();
  const { list, loading } = useCollectionList();

  const modalData = useModal();

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
        return (
          <ImgContainer
            alignItems={'center'}
            justifyContent={'flex-start'}
            gap={6}
          >
            <ImgCon src={defaultImg(bucket_name, 40)}></ImgCon>
            {bucket_name}
          </ImgContainer>
        );
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
        const { groupId } = data;
        return <PriceCon groupId={groupId}></PriceCon>;
      },
    },
    {
      header: 'Total Vol',
      width: 120,
      cell: (data: any) => {
        const { groupId } = data;
        return <TotalVol groupId={groupId}></TotalVol>;
      },
    },
    {
      header: 'Action',
      cell: (data: any) => {
        const { bucket_info, listed, groupId } = data;
        console.log(data);
        return (
          <div>
            <Button
              size={'sm'}
              onClick={async () => {
                if (!listed) {
                  await switchNetwork?.(GF_CHAIN_ID);
                  modalData.modalDispatch({
                    type: 'OPEN_LIST',
                    initInfo: bucket_info,
                  });
                } else {
                  console.log(groupId);
                  try {
                    await delist(groupId);
                    toast.success({ description: 'buy successful' });
                  } catch (e) {
                    toast.error({ description: 'buy failed' });
                  }
                }
              }}
            >
              {!listed ? 'List' : 'Delist'}
            </Button>
            <Button
              onClick={() => {
                const {
                  groupId,
                  bucket_info: { id },
                } = data;
                navigator(
                  `/resource?&bid=${id}&address=${address}&tab=description${
                    groupId ? '&gid=' + groupId : ''
                  }`,
                );
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
`;

const ImgContainer = styled(Flex)``;

const ImgCon = styled.img`
  width: 40px;
  height: 40px;

  background: #d9d9d9;
  border-radius: 8px;
`;
