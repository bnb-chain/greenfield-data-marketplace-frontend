import styled from '@emotion/styled';
import Search from '../components/Search';
import HomeList from '../components/home/Index';
import { Flex } from '@totejs/uikit';
import useScroll from '../hooks/useScroll';
import React, { useRef } from 'react';
import { useThrottle } from '../hooks/useThrottle';
import { useGlobal } from '../hooks/useGlobal';

const Home = () => {
  const root = useRef(window);
  const state = useGlobal();
  const fn = useThrottle(() => {
    let showSearch = false;
    if (document.documentElement.scrollTop >= 325) {
      showSearch = true;
    } else {
      showSearch = false;
    }
    state.globalDispatch({
      type: 'SEARCH_STATUS',
      showSearch,
    });
  }, 50);

  useScroll(root as unknown as React.RefObject<HTMLDivElement>, fn);
  return (
    <Container flexDirection={'column'} alignItems={'center'}>
      <Title>
        Fast, secure, simple <br></br>
        BNB Greenfield Data MarketPlace
      </Title>

      <Search></Search>
      <HomeList></HomeList>
    </Container>
  );
};

export default Home;

const Container = styled(Flex)``;
const Title = styled.h1`
  margin: 60px 0;

  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-size: 50px;
  line-height: 70px;

  text-align: center;

  color: #ffffff;
`;
