import styled from '@emotion/styled';
import { NavBar } from '../NavBar';
import { useCallback } from 'react';
import { Box } from '@totejs/uikit';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CollectionList from './collectionList';
import PurchaseList from './purchaseList';

enum Type {
  Collections = 'collections',
  Purchase = 'purchase',
}
const navItems = [
  {
    name: 'My Collections',
    key: Type.Collections,
  },
  {
    name: 'My Purchase',
    key: Type.Purchase,
  },
];

const ProfileList = () => {
  const [p] = useSearchParams();
  const tab = p.getAll('tab')[0];

  const navigator = useNavigate();

  const currentTab = tab ? tab : Type.Collections;
  const handleTabChange = useCallback((tab: any) => {
    navigator(`/profile?tab=${tab}`);
  }, []);

  return (
    <Container>
      <NavBar active={currentTab} onChange={handleTabChange} items={navItems} />
      <Box h={20} />
      {currentTab === Type.Collections ? (
        <CollectionList></CollectionList>
      ) : (
        <PurchaseList></PurchaseList>
      )}
    </Container>
  );
};

export default ProfileList;

const Container = styled.div`
  margin-top: 30px;

  width: 1123px;
  height: 664px;
`;
