import styled from '@emotion/styled';
import { Button, StateModal } from '@totejs/uikit';

export const BuyResult = (props: any) => {
  const { isOpen, handleOpen, variant, description } = props;
  return (
    <Container
      variant={variant}
      isOpen={isOpen}
      onClose={handleOpen}
      description={description || 'buy error'}
    >
      <Button width={'100%'} onClick={handleOpen}>
        Got it
      </Button>
    </Container>
  );
};

const Container = styled(StateModal)`
  .ui-modal-content {
    background: #ffffff;
  }
  color: #000000;
`;
