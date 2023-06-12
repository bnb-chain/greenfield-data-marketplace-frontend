import { Button, StateModal } from '@totejs/uikit';

export const ListError = (props: any) => {
  const { isOpen, handleOpen, description } = props;
  return (
    <StateModal
      variant="error"
      isOpen={isOpen}
      onClose={handleOpen}
      title="Listing Failed"
      description={
        description || 'Sorry, there’s something wrong when Listing data'
      }
    >
      <Button width={'100%'} onClick={handleOpen}>
        Got It
      </Button>
    </StateModal>
  );
};
