import { Modal, ModalHeader, ModalBody } from '@totejs/uikit';
import { Loader } from '../../Loader';
import styled from '@emotion/styled';

export const BuyProcess = (props: any) => {
  const { isOpen, handleOpen } = props;
  return (
    <Container isOpen={isOpen} onClose={handleOpen}>
      <LoaderCon minHeight={42}></LoaderCon>
      <ModalHeader>Checking Out</ModalHeader>
      <ModalBody textAlign={'center'}>
        Confirm this transaction in your wallet
      </ModalBody>
    </Container>
  );
};

const LoaderCon = styled(Loader)`
  width: 42px;
  height: 42px;
`;

const Container = styled(Modal)`
  .ui-modal-content {
    background: #ffffff;
  }
  color: #000000;
`;
