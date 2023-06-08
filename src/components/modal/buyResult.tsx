import { Button, StateModal } from '@totejs/uikit';

export const BuyResult = (props: any) => {
  const { isOpen, handleOpen, variant, description } = props;
  return (
    <StateModal
      variant={variant}
      isOpen={isOpen}
      onClose={handleOpen}
      description={description || 'buy error'}
    >
      <Button size="md" variant="ghost" onClick={handleOpen}>
        Cancel
      </Button>
      <Button size="md">Confirm</Button>
    </StateModal>
  );
};
