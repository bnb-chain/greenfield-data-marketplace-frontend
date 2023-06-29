import styled from '@emotion/styled';
import { NavBar } from '../NavBar';
import { useCallback, useEffect, useState } from 'react';
import { Box } from '@totejs/uikit';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CollectionList from './CollectionList';
import PurchaseList from './PurchaseList';
import OtherListedList from './OtherListedList';

enum Type {
  Collections = 'collections',
  Purchase = 'purchase',
}
const _navItems = [
  {
    name: 'My Data Collections',
    key: Type.Collections,
  },
  {
    name: 'My Purchases',
    key: Type.Purchase,
  },
];

interface IProfileList {
  realAddress: string;
  self: boolean;
}
const ProfileList = (props: IProfileList) => {
  const [p] = useSearchParams();
  const tab = p.getAll('tab')[0];

  const navigator = useNavigate();
  const { realAddress, self } = props;

  const [navItems, setNavItems] = useState(_navItems);

  useEffect(() => {
    if (!self) {
      const cp = JSON.parse(JSON.stringify(_navItems));
      cp.splice(1, 1);
      cp[0].name = 'Data List';
      setNavItems(cp);
    } else {
      setNavItems(_navItems);
    }
  }, [realAddress]);

  const currentTab = tab ? tab : Type.Collections;
  const handleTabChange = useCallback((tab: any) => {
    navigator(`/profile?tab=${tab}`);
  }, []);

  return (
    <Container>
      <NavBar active={currentTab} onChange={handleTabChange} items={navItems} />
      <Box h={20} />
      {self ? (
        currentTab === Type.Collections ? (
          <CollectionList></CollectionList>
        ) : (
          <PurchaseList></PurchaseList>
        )
      ) : (
        <OtherListedList
          realAddress={realAddress}
          self={self}
        ></OtherListedList>
      )}
    </Container>
  );
};

export default ProfileList;

const Container = styled.div`
  margin-top: 30px;

  width: 1123px;
`;
