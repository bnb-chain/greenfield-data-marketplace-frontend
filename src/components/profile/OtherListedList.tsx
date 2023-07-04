import styled from '@emotion/styled';
import { Flex, Table } from '@totejs/uikit';
import { usePagination } from '../../hooks/usePagination';
import { useNavigate } from 'react-router-dom';
import {
  formatDateUTC,
  trimLongStr,
  divide10Exp,
  defaultImg,
} from '../../utils';
import { useUserListed } from '../../hooks/useUserListed';
import BN from 'bn.js';
import { useSalesVolume } from '../../hooks/useSalesVolume';
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

interface IOtherListedList {
  realAddress: string;
  self: boolean;
}

const OtherListedList = (props: IOtherListedList) => {
  const navigator = useNavigate();
  const { realAddress } = props;

  const { handlePageChange, page } = usePagination();
  const pageSize = 10;

  const { list, loading, total } = useUserListed(realAddress, page, pageSize);

  const columns = [
    {
      header: 'Data',
      cell: (data: any) => {
        const { name, url, type, id, groupName, ownerAddress } = data;

        return (
          <ImgContainer
            alignItems={'center'}
            justifyContent={'flex-start'}
            gap={6}
            onClick={() => {
              navigator(
                `/resource?gid=${id}&gn=${groupName}&address=${ownerAddress}&tab=dataList&from=otherAddress`,
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
      header: 'Action',
      cell: (data: any) => {
        return <ActionCom data={data} address={realAddress}></ActionCom>;
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

export default OtherListedList;

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
