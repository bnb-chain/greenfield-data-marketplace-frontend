import Header from './Header';
import Footer from './Footer';
import { ReactNode, useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import { Flex } from '@totejs/uikit';
import { ListModal } from '../modal/listModal';
import { ListProcess } from '../modal/listProcess';
import { DelistModal } from '../modal/delistModal';
import { ActionResult } from '../modal/actionResult';
import { BuyIndex } from '../modal/buy/index';
import { useModal } from '../../hooks/useModal';
import { useGlobal } from '../../hooks/useGlobal';
import { getUrlParam } from '../../utils';

export default function Layout({ children }: { children: ReactNode }) {
  const modalData = useModal();

  const {
    openList,
    initInfo,
    openListProcess,
    openDelist,
    openResult,
    result,
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
  const state = useGlobal();

  useEffect(() => {
    const from = decodeURIComponent(getUrlParam('from'));
    try {
      if (from) {
        state.globalDispatch({
          type: 'INIT_BREAD',
          list: JSON.parse(from),
        });
      }
    } catch (e) {}
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
            console.log('ssssss');
            handleListOpen();
          }}
          detail={initInfo}
        ></ListModal>
      )}

      <ListProcess
        isOpen={openListProcess}
        handleOpen={() => {
          handleListProcessOpen();
        }}
      ></ListProcess>

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
        {...result}
      ></ActionResult>
    </>
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
