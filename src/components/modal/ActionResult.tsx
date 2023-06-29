import styled from '@emotion/styled';
import { Button, StateModal, StateModalVariantType } from '@totejs/uikit';

interface IActionResult {
  isOpen: boolean;
  handleOpen: (b?: boolean) => void;
  variant?: StateModalVariantType;
  description: string;
  callBack?: () => void;
}
export const ActionResult = (props: IActionResult) => {
  const { isOpen, handleOpen, variant, description, callBack } = props;
  return (
    <Container
      variant={variant}
      isOpen={isOpen}
      onClose={handleOpen}
      description={description || 'buy error'}
    >
      <Button
        width={'100%'}
        onClick={() => {
          callBack?.();
          handleOpen();
        }}
      >
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
