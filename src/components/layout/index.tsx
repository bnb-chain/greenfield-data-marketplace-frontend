import Header from './Header';
import Footer from './Footer';
import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { Flex } from '@totejs/uikit';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Container flexDirection={'column'} justifyContent={'space-between'}>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </Container>
  );
}

const Main = styled.main`
  display: flex;
  flex: 1 1 0%;
  justify-content: center;
`;

const Container = styled(Flex)`
  background-color: #000000;
  min-height: 100vh;
`;
