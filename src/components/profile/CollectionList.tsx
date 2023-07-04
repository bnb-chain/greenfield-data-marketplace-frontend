import styled from '@emotion/styled';
import { Button, Flex, Table } from '@totejs/uikit';
import { usePagination } from '../../hooks/usePagination';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { GF_CHAIN_ID } from '../../env';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  defaultImg,
  divide10Exp,
  formatDateUTC,
  trimLongStr,
} from '../../utils';

import { useCollectionList } from '../../hooks/useCollectionList';
import { useModal } from '../../hooks/useModal';
import { useSalesVolume } from '../../hooks/useSalesVolume';
import { useListedStatus } from '../../hooks/useListedStatus';
import { BN } from 'bn.js';
import { useGlobal } from '../../hooks/useGlobal';
import CollNoData from './CollNoData';
import { Dispatch, useMemo } from 'react';

const PriceCon = (props: { groupId: string }) => {
  const { groupId } = props;
  const { price } = useListedStatus(groupId);

  let balance = '-';
  if (price) {
    balance = divide10Exp(new BN(price, 10), 18) + ' BNB';
  }
  return <div>{balance}</div>;
};

const TotalVol = (props: { groupId: string }) => {
  const { groupId } = props;
  const { salesVolume } = useSalesVolume(groupId);
  return <div>{Number(salesVolume) || '-'}</div>;
};

interface ICollectionList {
  setShowButton: Dispatch<boolean>;
}
const CollectionList = (props: ICollectionList) => {
  const pageSize = 10;

  const { handlePageChange, page } = usePagination();
  const { setShowButton } = props;

  const { address } = useAccount();
  const { list, loading, total } = useCollectionList(page, pageSize);

  const modalData = useModal();

  const { switchNetwork } = useSwitchNetwork();
  const navigator = useNavigate();

  const state = useGlobal();

  const [p] = useSearchParams();

  const showNoData = useMemo(() => {
    const show = !loading && !list.length;
    setShowButton(!show);
    return show;
  }, [loading, list]);

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
            onClick={() => {
              const {
                groupId,
                bucket_info: { id },
              } = data;

              const list = state.globalState.breadList;
              const item = {
                path: '/profile',
                name: 'My Collections',
                query: p.toString(),
              };
              state.globalDispatch({
                type: 'ADD_BREAD',
                item,
              });

              navigator(
                `/resource?&bid=${id}&address=${address}&tab=dataList&from=${encodeURIComponent(
                  JSON.stringify(list.concat([item])),
                )}${groupId ? '&gid=' + groupId : ''}`,
              );
            }}
          >
            <ImgCon src={defaultImg(bucket_name, 40)}></ImgCon>
            {trimLongStr(bucket_name, 15)}
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
                  const { bucket_name, create_at, owner } = bucket_info;
                  modalData.modalDispatch({
                    type: 'OPEN_DELIST',
                    delistData: {
                      groupId,
                      bucket_name,
                      create_at,
                      owner,
                    },
                  });
                }
              }}
            >
              {!listed ? 'List' : 'Delist'}
            </Button>
            {/* <Button
              onClick={() => {
                const {
                  groupId,
                  bucket_info: { id },
                } = data;

                const list = state.globalState.breadList;
                const item = {
                  path: '/profile',
                  name: 'My Collections',
                  query: p.toString(),
                };
                state.globalDispatch({
                  type: 'ADD_BREAD',
                  item,
                });

                navigator(
                  `/resource?&bid=${id}&address=${address}&tab=dataList&from=${encodeURIComponent(
                    JSON.stringify(list.concat([item])),
                  )}${groupId ? '&gid=' + groupId : ''}`,
                );
              }}
              size={'sm'}
              style={{ marginLeft: '6px' }}
            >
              View detail
            </Button> */}
          </div>
        );
      },
    },
  ];
  return (
    <Container>
      <Table
        headerContent={`Latest ${Math.min(
          pageSize,
          list.length,
        )}  Collections (Total of ${list.length})`}
        containerStyle={{ padding: '4px 20px' }}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: handlePageChange,
        }}
        columns={columns}
        data={list}
        loading={loading}
        hoverBg={'#14151A'}
        customComponent={showNoData && <CollNoData></CollNoData>}
      />
    </Container>
  );
};

export default CollectionList;

const Container = styled.div`
  width: 1123px;
`;

const ImgContainer = styled(Flex)`
  cursor: pointer;
  color: ${(props: any) => props.theme.colors.scene.primary.normal};
`;

const ImgCon = styled.img`
  width: 40px;
  height: 40px;

  background: #d9d9d9;
  border-radius: 8px;
`;
