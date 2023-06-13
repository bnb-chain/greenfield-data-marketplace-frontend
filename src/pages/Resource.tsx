import styled from '@emotion/styled';
import { Flex, Button, Box } from '@totejs/uikit';
import { NavBar } from '../components/NavBar';
import { useCallback, useEffect, useState } from 'react';
import Overview from '../components/resource/overview';
import List from '../components/resource/list';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ListModal } from '../components/modal/listModal';
import { GF_CHAIN_ID } from '../env';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { useResourceInfo } from '../hooks/useResourceInfo';
import { Loader } from '../components/Loader';
import {
  defaultImg,
  divide10Exp,
  generateGroupName,
  trimLongStr,
  formatDateUTC,
} from '../utils';
import BN from 'bn.js';
import { useCollectionItems } from '../hooks/useCollectionItems';
import { useSalesVolume } from '../hooks/useSalesVolume';
import { useListedDate } from '../hooks/useListedDate';

enum Type {
  Description = 'description',
  DataList = 'dataList',
}
const navItems = [
  {
    name: 'Description',
    key: Type.Description,
  },
];

const Resource = () => {
  const navigator = useNavigate();
  const [p] = useSearchParams();
  const tab = p.getAll('tab')[0];
  const groupId = p.getAll('gid')[0];
  const bucketId = p.getAll('bid')[0];
  const objectId = p.getAll('oid')[0];
  const ownerAddress = p.getAll('address')[0];
  const gName = p.getAll('gn')[0];

  const { switchNetwork } = useSwitchNetwork();
  const currentTab = tab ? tab : Type.Description;
  const [open, setOpen] = useState(false);

  const handleTabChange = useCallback((tab: any) => {
    navigator(
      `/resource?${p.toString().replace(/tab=([^&]*)/g, `tab=${tab}`)}`,
    );
  }, []);

  const { address } = useAccount();

  const resourceType = objectId ? '1' : '0';

  const { loading, baseInfo } = useResourceInfo({
    groupId,
    bucketId,
    objectId,
    address: ownerAddress,
    groupName: gName,
  });
  console.log(groupId, baseInfo);

  const { name, price, url, desc, listed } = baseInfo;

  const { num } = useCollectionItems(name);

  const { salesVolume } = useSalesVolume(groupId);

  const { listedDate } = useListedDate(groupId);

  if (loading) return <Loader></Loader>;

  if (address === ownerAddress) {
    navItems[1] = {
      name: 'DataList',
      key: Type.DataList,
    };
  }

  return (
    <Container>
      <ResourceInfo gap={20}>
        <ImgCon>
          <img src={url || defaultImg(name, 246)} alt="" />
        </ImgCon>
        <Info
          gap={4}
          flexDirection={['column', 'column', 'column']}
          justifyContent={'space-around'}
        >
          <NameCon gap={4} alignItems={'center'} justifyContent={'flex-start'}>
            <Name>{name}</Name>
            {resourceType == '0' ? (
              <Tag alignItems={'center'} justifyContent={'center'}>
                Data Collection
              </Tag>
            ) : null}
          </NameCon>
          {resourceType == '0' ? <ItemNum>{num} Items</ItemNum> : null}
          <OwnCon>
            Created by{' '}
            {address === ownerAddress ? (
              <span>You</span>
            ) : (
              <span>{trimLongStr(ownerAddress)}</span>
            )}{' '}
            At {formatDateUTC(listedDate * 1000)}
          </OwnCon>
          {listed ? (
            <MarketInfo>{divide10Exp(new BN(price, 10), 18)} BNB</MarketInfo>
          ) : null}
          <ActionGroup gap={10}>
            {listed ? null : (
              <Button
                size={'sm'}
                onClick={async () => {
                  await switchNetwork?.(GF_CHAIN_ID);
                  setOpen(true);
                }}
              >
                List
              </Button>
            )}
            <Button size={'sm'}>View in Dcellar</Button>
            {listed ? <BoughtNum>{salesVolume} Bought</BoughtNum> : null}
          </ActionGroup>
        </Info>
      </ResourceInfo>
      <Box h={30}></Box>
      <NavBar active={currentTab} onChange={handleTabChange} items={navItems} />
      <Box h={10} w={996}></Box>
      {currentTab === Type.Description ? (
        <Overview desc={desc}></Overview>
      ) : (
        <List name={name} listed={listed}></List>
      )}
      {/* <ListModal
      isOpen={open}
      handleOpen={() => {
        setOpen(false);
      }}
      detail={{
        bucket_name: bucketName,
        id: groupId,
      }}
    ></ListModal> */}
    </Container>
  );
};

export default Resource;

const Container = styled.div`
  margin-top: 60px;
`;
const ResourceInfo = styled(Flex)``;

const ImgCon = styled.div`
  width: 246px;
  height: 246px;

  img {
    background-color: #d9d9d9;
    border-radius: 8px;
  }
`;

const Info = styled(Flex)``;

const NameCon = styled(Flex)``;

const Name = styled.div`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 38px;
  /* identical to box height, or 119% */

  color: #f0b90b;
`;

const Tag = styled(Flex)`
  width: 128px;
  height: 24px;

  background: rgba(255, 255, 255, 0.14);
  border-radius: 16px;
`;

const ItemNum = styled.div`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;

  color: #ffffff;
`;

const OwnCon = styled.div`
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;

  color: #ffffff;

  span {
    color: #f0b90b;
  }
`;

const MarketInfo = styled(Flex)`
  color: #f0b90b;
`;

const ActionGroup = styled(Flex)``;

const BoughtNum = styled.div`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;

  color: #979797;
`;
