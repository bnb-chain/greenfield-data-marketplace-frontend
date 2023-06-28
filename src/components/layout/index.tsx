import Header from './Header';
import Footer from './Footer';
import { ReactNode, useCallback } from 'react';
import styled from '@emotion/styled';
import { Flex } from '@totejs/uikit';
import { ListModal } from '../modal/listModal';
import { ListProcess } from '../modal/listProcess';
import { DelistModal } from '../modal/delistModal';
import { ActionResult } from '../modal/actionResult';
import { BuyIndex } from '../modal/buy/index';
import { useModal } from '../../hooks/useModal';

export default function Layout({ children }: { children: ReactNode }) {
  const modalData = useModal();

  const {
    openList,
    initInfo,
    openListProcess,
    openDelist,
    openResult,
    result,
    callBack,
  } = modalData.modalState;

  const handleListOpen = useCallback(() => {
    modalData.modalDispatch({ type: 'CLOSE_LIST' });
  }, []);

  const handleListProcessOpen = useCallback(() => {
    modalData.modalDispatch({ type: 'CLOSE_LIST_PROCESS' });
  }, []);

  const handleDelistOpen = useCallback(() => {
    modalData.modalDispatch({ type: 'CLOSE_DELIST' });
  }, []);

  const handleResultOpen = useCallback(() => {
    modalData.modalDispatch({ type: 'CLOSE_RESULT' });
  }, []);

  return (
    <>
      <Container flexDirection={'column'} justifyContent={'space-between'}>
        <Header />
        <Main>{children}</Main>
        <Footer />
      </Container>

      {openList && (
        <ListModal
          isOpen={openList}
          handleOpen={() => {
            handleListOpen();
          }}
          detail={initInfo}
        ></ListModal>
      )}

      {openListProcess && (
        <ListProcess
          isOpen={openListProcess}
          handleOpen={() => {
            handleListProcessOpen();
          }}
        ></ListProcess>
      )}

      <BuyIndex></BuyIndex>

      <DelistModal
        isOpen={openDelist}
        handleOpen={() => {
          handleDelistOpen();
        }}
      ></DelistModal>

      <ActionResult
        isOpen={openResult}
        handleOpen={() => {
          handleResultOpen();
        }}
        callBack={callBack}
        {...result}
      ></ActionResult>
    </>
  );
}

const Main = styled.main`
  display: flex;
  flex: 1 1 0%;
  justify-content: center;
  margin-top: 62px;
`;

const Container = styled(Flex)`
  background-color: #000000;
  min-height: 100vh;
`;
