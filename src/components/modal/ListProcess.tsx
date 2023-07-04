import { Modal, Flex, ModalCloseButton, Button } from '@totejs/uikit';
import styled from '@emotion/styled';
import { ProgressSuccessIcon } from '../svgIcon/ProgressSuccess';

import { MoreIcon, SendIcon } from '@totejs/icons';
import { useModal } from '../../hooks/useModal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader } from '../Loader';
import { batchUpdate } from '../../utils';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { BSC_CHAIN_ID, BSC_EXPLORER_URL, GF_EXPLORER_URL } from '../../env';
import { useList, IList } from '../../hooks/useList';
import { useApprove } from '../../hooks/useApprove';
import { useHasRole } from '../../hooks/useHasRole';
interface ListProcessProps {
  isOpen: boolean;
  handleOpen: (show: boolean) => void;
  buttonText?: string;
  title?: string;
  buttonRedirect?: boolean;
}
let defaultHasRole: any;

export const ListProcess = (props: ListProcessProps) => {
  const { isOpen, handleOpen } = props;

  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('Initiate Listing');
  const { switchNetwork } = useSwitchNetwork();

  const stateModal = useModal();

  const { Approve } = useApprove();
  const { chain } = useNetwork();

  const [status, setStatus] = useState(0);
  const [bscHash, setBscHash] = useState('');

  const [modalTitle, setModalTitle] = useState('');

  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  const { hasRole, setHasRole, loading: roleLoading } = useHasRole();

  useMemo(() => {
    if (!roleLoading) defaultHasRole = defaultHasRole ?? hasRole;
  }, [hasRole, roleLoading]);

  const gfHash = useMemo(() => {
    const d: any = stateModal.modalState?.initListResult;
    if (d) {
      return d.transactionHash;
    }
  }, [stateModal.modalState?.initListResult]);

  useEffect(() => {
    if (stateModal.modalState.initListStatus) {
      setStep(hasRole ? 2 : 1);
      setLoading(false);
      setTitle(hasRole ? 'Finalize on BSC' : 'Approve on BSC');
      setStatus(1);
    }
  }, [stateModal.modalState.initListStatus]);

  const reset = useCallback(() => {
    setStep(0);
    setTitle('Initiate Listing');
    setDescription('Please wait here to continue');
    defaultHasRole = undefined;
    setLoading(false);
  }, []);

  const { List } = useList(stateModal.modalState.listData as IList);

  if (defaultHasRole == undefined) return <></>;

  return (
    <Container
      title={modalTitle}
      isOpen={isOpen}
      onClose={() => handleOpen(false)}
      margin={'auto'}
    >
      <ModalCloseButton
        color={'bg.card'}
        onClick={() => {
          reset();
          stateModal.modalDispatch({ type: 'RESET' });
          handleOpen(false);
        }}
      />
      <Flex flexDirection={'column'} gap={24} flex={1}>
        <ProgressContainer width={defaultHasRole ? '312' : '412'}>
          <ProgressStep>
            <ProgressName active={step == 1} alignItems={'center'}>
              Initiate on Greenfield
              {status >= 1 && gfHash && (
                <SendIcon
                  cursor={'pointer'}
                  onClick={() => {
                    window.open(`${GF_EXPLORER_URL}tx/${gfHash}`);
                  }}
                />
              )}
            </ProgressName>
            {step == 0 ? (
              <MoreIconCon>
                <MoreIcon width={32} height={32} />
              </MoreIconCon>
            ) : (
              <ProgressSuccessIcon width={32} height={32} />
            )}
          </ProgressStep>
          <HorizontalBarFist
            width={defaultHasRole ? '160' : '114'}
            status={step && step >= 3 ? true : false}
          />
          {defaultHasRole ? null : (
            <>
              <ProgressStep>
                <ProgressName active={step && step >= 2 ? true : false}>
                  Approve on BSC
                </ProgressName>
                {step && step >= 2 ? (
                  <ProgressSuccessIcon width={32} height={32} />
                ) : (
                  <ProgressIcon>2</ProgressIcon>
                )}
              </ProgressStep>
              <HorizontalBarSecond
                hasRole={defaultHasRole}
                status={step && step >= 3 ? true : false}
              />
            </>
          )}
          <ProgressStep>
            <ProgressName
              active={step && step >= 3 ? true : false}
              alignItems={'center'}
            >
              Finalize on BSC
              {status == 2 && bscHash && (
                <SendIcon
                  cursor={'pointer'}
                  onClick={() => {
                    window.open(`${BSC_EXPLORER_URL}tx/${bscHash}`);
                  }}
                />
              )}
            </ProgressName>
            {step && step >= 3 ? (
              <ProgressSuccessIcon width={32} height={32} />
            ) : (
              <ProgressIcon>{defaultHasRole ? 2 : 3}</ProgressIcon>
            )}
          </ProgressStep>
        </ProgressContainer>

        {loading ? <LoaderCon minHeight={42}></LoaderCon> : null}
        {title && <ModalTitle>{title}</ModalTitle>}
        {description && <ModalDescription>{description}</ModalDescription>}
        {((hasRole && step == 2) || (!hasRole && step == 1)) &&
          chain &&
          chain.id !== BSC_CHAIN_ID && (
            <Button
              onClick={() => {
                switchNetwork?.(BSC_CHAIN_ID);
              }}
            >
              Switch to BSC Testnet Network
            </Button>
          )}
        {step == 2 &&
          chain &&
          chain.id === BSC_CHAIN_ID &&
          hasRole &&
          status == 1 &&
          !loading && (
            <Button
              onClick={async () => {
                setTitle('Finalize Listing');
                setLoading(true);
                let tmp = {};
                try {
                  const listResult: any = await List(
                    stateModal.modalState.listData as any,
                  );
                  const { transactionHash } = listResult as any;

                  if (transactionHash) {
                    batchUpdate(() => {
                      setLoading(false);
                      setTitle('');
                      setStep(3);
                      setStatus(2);
                      setModalTitle('List Success');
                      setDescription('');
                      setBscHash(transactionHash);
                    });
                  }
                } catch (e: any) {
                  tmp = {
                    variant: 'error',
                    description: e.message ? e.message : 'List failed',
                  };
                  stateModal.modalDispatch({
                    type: 'OPEN_RESULT',
                    result: tmp,
                  });
                }
              }}
            >
              List to BSC Testnet
            </Button>
          )}
        {step == 1 &&
          chain &&
          chain.id === BSC_CHAIN_ID &&
          !hasRole &&
          !loading && (
            <Button
              onClick={async () => {
                setLoading(true);
                setTitle('Wait for Approve');
                await Approve();
                setHasRole(true);
                setLoading(false);
                setTitle('Finalize on BSC');
                setStep(2);
              }}
            >
              Approve
            </Button>
          )}
        {status == 2 && (
          <Button
            onClick={() => {
              reset();
              stateModal.modalDispatch({ type: 'RESET' });
              handleOpen(false);
            }}
          >
            Got it
          </Button>
        )}
      </Flex>
    </Container>
  );
};

const Container = styled(Modal)`
  border-radius: 12px;
  box-shadow: ${(props: any) => props.theme.colors.shadows?.normal};

  .ui-modal {
    display: flex;
    justify-content: center;
    align-items: center;
  }

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
  justify-content: space-between;
`;

const ProgressStep = styled(Flex)`
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const ProgressName = styled(Flex)<{ active: boolean }>`
  font-size: 12px;
  font-weight: 500;
  line-height: 15px;
  color: ${(props: any) =>
    props.active
      ? props.theme.colors.bg?.card
      : props.theme.colors.readable?.pageButton};
  svg {
    width: 14px;
    height: 14px;
  }
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
  background: #aeb4bc;

  color: #ffffff;
`;

const MoreIconCon = styled(MoreIcon)`
  width: 32px;
  height: 32px;
  border-radius: 50%;

  background: #f5b631;

  color: #ffffff;
`;

const LoaderCon = styled(Loader)`
  width: 42px;
  height: 42px;
`;
const HorizontalBarFist = styled.div<{ status: boolean; width: string }>`
  width: ${(props: any) => props.width + 'px'};
  height: 2px;
  position: absolute;
  top: 40px;
  background: ${(props: any) =>
    props.status
      ? props.theme.colors.scene.success.progressBar
      : props.theme.colors.readable.top.secondary};
  left: 84px;
`;

const HorizontalBarSecond = styled.div<{ status: boolean; hasRole: boolean }>`
  width: ${(props: any) => (props.hasRole ? '105px' : '90px')};
  height: 2px;
  position: absolute;
  top: 40px;
  background: ${(props: any) =>
    props.status
      ? props.theme.colors.scene.success.progressBar
      : props.theme.colors.readable.top.secondary};
  right: ${(props: any) => (props.hasRole ? '65px' : '70px')};
`;
