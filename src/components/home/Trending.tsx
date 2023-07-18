import styled from '@emotion/styled';
import { Flex, Table } from '@totejs/uikit';
import { Link, useNavigate } from 'react-router-dom';
import {
  contentTypeToExtension,
  defaultImg,
  divide10Exp,
  trimLongStr,
} from '../../utils';
import BN from 'bn.js';

import { useTrendingList } from '../../hooks/useTrendingList';
import { useGlobal } from '../../hooks/useGlobal';

import { CollectionLogo } from '../svgIcon/CollectionLogo';
import { useAccount } from 'wagmi';
import { ActionCom } from '../ActionCom';

const TrendingList = () => {
  const navigator = useNavigate();

  const { list, loading } = useTrendingList();

  const state = useGlobal();
  const { address } = useAccount();

  const columns = [
    {
      header: '#',
      width: 20,
      cell: (data: any) => {
        const { rank } = data;
        return <Rank className={rank <= 3 ? 'active' : ''}>{rank}</Rank>;
      },
    },
    {
      header: 'Data',
      width: 200,
      cell: (data: any) => {
        const {
          name,
          url,
          id,
          metaData: { groupName },
          ownerAddress,
          type,
        } = data;
        return (
          <ImgContainer
            alignItems={'center'}
            justifyContent={'flex-start'}
            gap={6}
            onClick={() => {
              const item = {
                path: '/',
                name: 'Data MarketPlace',
                query: 'tab=trending',
              };
              state.globalDispatch({
                type: 'UPDATE_BREAD',
                index: 0,
                item,
              });

              navigator(
                `/resource?gid=${id}&gn=${groupName}&address=${ownerAddress}&tab=dataList&from=${encodeURIComponent(
                  JSON.stringify([item]),
                )}`,
              );
            }}
          >
            <ImgCon src={url || defaultImg(name, 40)}></ImgCon>
            {trimLongStr(name, 15)}
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
      width: 160,
      cell: (data: any) => {
        const { type, name } = data;
        return (
          <div>
            {type === 'Collection' ? type : contentTypeToExtension(name, name)}
          </div>
        );
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
      header: 'Total Vol',
      width: 120,
      cell: (data: any) => {
        const { totalVol } = data;
        return <div>{totalVol}</div>;
      },
    },
    {
      header: 'Creator',
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
        return <ActionCom data={data} address={address as string}></ActionCom>;
      },
    },
  ];
  return (
    <Container>
      <Table
        containerStyle={{ padding: '0', background: '#1E2026' }}
        columns={columns}
        data={list}
        loading={loading}
        hoverBg={'#14151A'}
        withContainer={true}
      />
    </Container>
  );
};

export default TrendingList;

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

const Rank = styled.div`
  &.active {
    font-size: 24px;
    font-weight: 500;
    color: ${(props: any) => props.theme.colors.scene.primary.normal};
  }
`;
