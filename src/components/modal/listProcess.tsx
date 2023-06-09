import { Modal, Flex, ModalCloseButton } from '@totejs/uikit';
import styled from '@emotion/styled';
import { ProgressSuccessIcon } from '../svgIcon/ProgressSuccess';
import { useNavigate } from 'react-router-dom';
interface SuccessfulProps {
  isOpen: boolean;
  handleOpen: (show: boolean) => void;
  txHash: string;
  clearInput?: () => void;
  step?: number;
  buttonText?: string;
  title?: string;
  buttonRedirect?: boolean;
}
export const ListProcess = (props: SuccessfulProps) => {
  const {
    isOpen,
    handleOpen,
    clearInput,
    step,
    title = 'Transaction Submitted',
  } = props;
  return (
    <Container isOpen={isOpen} onClose={() => handleOpen(false)} margin={0}>
      <ModalCloseButton
        color={'bg.card'}
        onClick={() => {
          if (clearInput) {
            clearInput();
          }
          handleOpen(false);
        }}
      />
      <Flex flexDirection={'column'} gap={24} flex={1}>
        <ProgressContainer>
          <ProgressStep>
            <ProgressName active={true}>Initialize List</ProgressName>
            <ProgressSuccessIcon width={32} height={32} />
          </ProgressStep>
          <HorizontalBarFist status={step && step >= 2 ? true : false} />
          <ProgressStep>
            <ProgressName active={step && step >= 2 ? true : false}>
              Prove List
            </ProgressName>
            {step && step >= 2 ? (
              <ProgressSuccessIcon width={32} height={32} />
            ) : (
              <ProgressIcon>2</ProgressIcon>
            )}
          </ProgressStep>
          <HorizontalBarSecond status={step && step >= 3 ? true : false} />
          <ProgressStep>
            <ProgressName active={step && step >= 3 ? true : false}>
              Finalize List
            </ProgressName>
            {step && step >= 3 ? (
              <ProgressSuccessIcon width={32} height={32} />
            ) : (
              <ProgressIcon>3</ProgressIcon>
            )}
          </ProgressStep>
        </ProgressContainer>
        <ModalTitle>{title}</ModalTitle>
        <ModalDescription>
          Check the status of your withdrawals on the withdraw history page and
          continue the following steps.
        </ModalDescription>
      </Flex>
    </Container>
  );
};

const Container = styled(Modal)`
  border-radius: 12px;
  box-shadow: ${(props: any) => props.theme.colors.shadows?.normal};
  .ui-modal-content {
    padding: 48px 24px;
    width: 568px;
    background: ${(props: any) => props.theme.colors.readable.normal};
    color: #5f6368;
  }
`;

const ModalTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  line-height: 31px;
  text-align: center;
`;

const ModalDescription = styled.div`
  font-size: 18px;
  font-weight: 400;
  line-height: 23px;
  margin-top: -8px;
  text-align: center;
  color: #5f6368;
`;

const ProgressContainer = styled(Flex)`
  position: relative;
  margin: 0 auto 8px;
  width: 412px;
  justify-content: space-between;
`;

const ProgressStep = styled(Flex)`
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const ProgressName = styled.div<{ active: boolean }>`
  font-size: 12px;
  font-weight: 500;
  line-height: 15px;
  color: ${(props: any) =>
    props.active
      ? props.theme.colors.bg?.card
      : props.theme.colors.readable?.pageButton};
`;

const ProgressIcon = styled(Flex)`
  border-radius: 50%;
  width: 32px;
  height: 32px;
  color: #5f6368;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  justify-content: center;
  align-items: center;
  background: ${(props: any) => props.theme.colors.readable.grey10};
`;

const HorizontalBarFist = styled.div<{ status: boolean }>`
  width: 112px;
  height: 2px;
  position: absolute;
  top: 40px;
  background: ${(props: any) =>
    props.status
      ? props.theme.colors.scene.success.progressBar
      : props.theme.colors.readable.top.secondary};
  left: 77px;
`;

const HorizontalBarSecond = styled.div<{ status: boolean }>`
  width: 105px;
  height: 2px;
  position: absolute;
  top: 40px;
  background: ${(props: any) =>
    props.status
      ? props.theme.colors.scene.success.progressBar
      : props.theme.colors.readable.top.secondary};
  right: 77px;
`;
