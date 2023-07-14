import styled from '@emotion/styled';
import { Flex, Table } from '@totejs/uikit';
import { usePagination } from '../../hooks/usePagination';
import { Link, useNavigate } from 'react-router-dom';
import {
  formatDateUTC,
  trimLongStr,
  divide10Exp,
  defaultImg,
  contentTypeToExtension,
} from '../../utils';
import { useGetListed } from '../../hooks/useGetListed';
import BN from 'bn.js';
import { useAccount } from 'wagmi';
import { useSalesVolume } from '../../hooks/useSalesVolume';
import { useGlobal } from '../../hooks/useGlobal';
import { CollectionLogo } from '../svgIcon/CollectionLogo';
import { ActionCom } from '../ActionCom';

interface ITotalVol {
  id: string;
}
const TotalVol = (props: ITotalVol) => {
  const { id } = props;
  const { salesVolume } = useSalesVolume(id);
  return <div>{salesVolume}</div>;
};
const AllList = () => {
  const { handlePageChange, page } = usePagination();
  const navigator = useNavigate();
  const { address } = useAccount();
  const { list, loading, total } = useGetListed(address, page, 10);

  const state = useGlobal();

  const columns = [
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
      header: 'Data Listed',
      width: 160,
      cell: (data: any) => {
        const { listTime } = data;
        return <div>{listTime ? formatDateUTC(listTime * 1000) : '-'}</div>;
      },
    },
    {
      header: 'Total Vol',
      width: 120,
      cell: (data: any) => {
        const { id } = data;
        return <TotalVol id={id}></TotalVol>;
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
        return <ActionCom data={data} address={address as string}></ActionCom>;
      },
    },
  ];
  return (
    <Container>
      <Table
        headerContent={`Latest ${Math.min(
          20,
          list.length,
        )}  Collections (Total of ${total})`}
        containerStyle={{ padding: '0' }}
        pagination={{
          current: page,
          pageSize: 10,
          total: total,
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

export default AllList;

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
