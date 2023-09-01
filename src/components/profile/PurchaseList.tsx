import styled from '@emotion/styled';
import { Flex, Table } from '@totejs/uikit';
import { usePagination } from '../../hooks/usePagination';
import { useAccount } from 'wagmi';
import {
  defaultImg,
  divide10Exp,
  formatDateUTC,
  trimLongStr,
} from '../../utils';
import { useUserPurchased } from '../../hooks/useUserPurchased';
import BN from 'bn.js';
import { useSalesVolume } from '../../hooks/useSalesVolume';
import { OwnActionCom } from '../OwnActionCom';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CollectionLogo } from '../svgIcon/CollectionLogo';
import { useGlobal } from '../../hooks/useGlobal';

const TotalVol = (props: any) => {
  const { groupId } = props;
  const { salesVolume } = useSalesVolume(groupId);
  return <div>{Number(salesVolume) || '-'}</div>;
};

const PurchaseList = () => {
  const { handlePageChange, page } = usePagination();

  const pageSize = 10;
  const { list, loading, total } = useUserPurchased(page, pageSize);
  const { address } = useAccount();
  const navigator = useNavigate();
  const state = useGlobal();
  const [p] = useSearchParams();

  const breadInfo = {
    name: 'My Purchase',
    path: '/profile',
  };
  const columns = [
    {
      header: 'Data',
      width: 200,
      cell: (data: any) => {
        const { id, groupName, ownerAddress, url, type, oid, name } = data;
        return (
          <ImgContainer
            alignItems={'center'}
            justifyContent={'flex-start'}
            gap={6}
            onClick={() => {
              let from = '';
              if (breadInfo) {
                const list = state.globalState.breadList;
                const item = {
                  path: (breadInfo as any).path,
                  name: (breadInfo as any).name,
                  query: p.toString(),
                };
                state.globalDispatch({
                  type: 'ADD_BREAD',
                  item,
                });

                from = encodeURIComponent(JSON.stringify(list.concat([item])));
              }
              const _from = from ? `&from=${from}` : '';
              if (groupName) {
                navigator(
                  `/resource?gid=${id}&gn=${groupName}&address=${ownerAddress}&type=collection&tab=dataList${_from}`,
                );
              } else {
                navigator(
                  `/resource?oid=${oid}&address=${ownerAddress}&type=collection&tab=dataList${_from}`,
                );
              }
            }}
          >
            <ImgCon src={url || defaultImg(name, 40)}></ImgCon>
            {trimLongStr(data.name)}
            {type === 'Collection' && (
              <CollectionLogo
                style={{ width: '10px', height: '10px' }}
              ></CollectionLogo>
            )}
          </ImgContainer>
        );
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
      header: 'Current List Price',
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
        const { id } = data;
        return <TotalVol groupId={id}></TotalVol>;
      },
    },
    {
      header: 'Creator',
      width: 120,
      cell: (data: any) => {
        const { ownerAddress } = data;
        return (
          <MyLink to={`/profile?address=${ownerAddress}`}>
            {trimLongStr(ownerAddress)}
          </MyLink>
        );
      },
    },
    {
      header: 'Action',
      cell: (data: any) => {
        return (
          <OwnActionCom
            data={data}
            address={address as string}
            breadInfo={breadInfo}
          ></OwnActionCom>
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
          total,
          onChange: handlePageChange,
        }}
        columns={columns}
        data={list}
        loading={loading}
        hoverBg={'#14151A'}
      />
    </Container>
  );
};

export default PurchaseList;

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

const MyLink = styled(Link)`
  color: ${(props: any) => props.theme.colors.scene.primary.normal};
`;
