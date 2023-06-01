import styled from '@emotion/styled';
import { Flex, Button, Box } from '@totejs/uikit';
import { NavBar } from '../components/NavBar';
import { useCallback, useState } from 'react';
import Overview from '../components/collection/overview';
import List from '../components/collection/list';

enum Type {
  Overview = 'Overview',
  DataList = 'DataList',
}
const navItems = [
  {
    name: 'Overview',
    key: Type.Overview,
  },
  {
    name: 'DataList',
    key: Type.DataList,
  },
];

const Collection = () => {
  const tab = Type.Overview;
  const [currentTab, setCurrentTab] = useState(tab);
  const handleTabChange = useCallback((tab: any) => {
    console.log(tab);
    setCurrentTab(tab);
  }, []);

  return (
    <Container>
      <CollectionInfo gap={20}>
        <ImgCon>
          <img src="" alt="" />
        </ImgCon>
        <Info
          gap={4}
          flexDirection={['column', 'column', 'column']}
          justifyContent={'space-around'}
        >
          <NameCon gap={4} alignItems={'center'} justifyContent={'flex-start'}>
            <Name>duduu</Name>
            <Tag alignItems={'center'} justifyContent={'center'}>
              Data Collection
            </Tag>
          </NameCon>
          <ItemNum>123</ItemNum>
          <OwnCon>
            Created by <span>You</span>
          </OwnCon>
          <MarketInfo>12312</MarketInfo>
          <ActionGroup gap={10}>
            <Button size={'sm'}>List</Button>
            <Button size={'sm'}>View in Dcellar</Button>
            <BoughtNum>98,765 Bought</BoughtNum>
          </ActionGroup>
        </Info>
      </CollectionInfo>
      <Box h={30}></Box>
      <NavBar active={currentTab} onChange={handleTabChange} items={navItems} />
      <Box h={10} w={996}></Box>
      {currentTab === Type.Overview ? <Overview></Overview> : <List></List>}
    </Container>
  );
};

export default Collection;

const Container = styled.div`
  margin-top: 60px;
`;
const CollectionInfo = styled(Flex)``;

const ImgCon = styled.div`
  width: 246px;
  height: 246px;
  background-color: #d9d9d9;
  border-radius: 8px;
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
