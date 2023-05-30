import Header from './Header';
import Footer from './Footer';
import { ReactNode } from 'react';
import styled from '@emotion/styled';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Container>
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;
