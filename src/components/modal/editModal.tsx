import styled from '@emotion/styled';
import { ColoredWarningIcon } from '@totejs/icons';
import { Box, Flex, Input, toast } from '@totejs/uikit';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
} from '@totejs/uikit';
import { useCallback, useMemo, useState } from 'react';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import {
  GF_CHAIN_ID,
  LIST_ESTIMATE_FEE_ON_BSC,
  LIST_FEE_ON_GF,
} from '../../env';
import { useChainBalance } from '../../hooks/useChainBalance';
import { useList } from '../../hooks/useList';

import { useApprove } from '../../hooks/useApprove';
import { useCollectionItems } from '../../hooks/useCollectionItems';
import { useModal } from '../../hooks/useModal';
import { updateGroupInfo } from '../../utils/gfSDK';
import { generateGroupName } from '../../utils';
import { useEdit } from '../../hooks/useEdit';
import { Loader } from '../Loader';

interface ListModalProps {
  isOpen: boolean;
  handleOpen: (show: boolean) => void;
  detail: any;
  updateFn: () => void;
}

export const EditModal = (props: ListModalProps) => {
  const { isOpen, handleOpen, detail, updateFn } = props;

  const { switchNetwork } = useSwitchNetwork();
  const { GfBalanceVal, BscBalanceVal } = useChainBalance();
  const modalData = useModal();

  const { chain } = useNetwork();

  const {
    id,
    create_at,
    name,
    type,
    desc: _desc,
    url,
    groupName,
    extra,
    price,
  } = detail;

  const { address } = useAccount();

  const [desc, setDesc] = useState(_desc);
  const [imgUrl, setImgUrl] = useState(url);

  const [loading, setLoading] = useState(false);

  const onChangeDesc = (event: any) => {
    setDesc(event.target.value);
  };
  const onChangeImgUrl = (event: any) => {
    setImgUrl(event.target.value);
  };

  const INFO_NO_CHANGE = useMemo(() => {
    return desc === _desc && imgUrl === url;
  }, [desc, imgUrl, isOpen]);

  const extraStr = useMemo(() => {
    return JSON.stringify({
      ...JSON.parse(extra),
      desc,
      url: imgUrl,
    });
  }, [desc, imgUrl]);

  const { edit, simulateInfo } = useEdit(
    address as string,
    groupName,
    extraStr,
  );

  const GF_FEE_SUFF = useMemo(() => {
    if (simulateInfo) {
      return GfBalanceVal >= Number(simulateInfo.gasFee);
    }
    return false;
  }, [simulateInfo, isOpen]);

  return (
    <Container
      size={'lg'}
      isOpen={isOpen}
      onClose={() => {
        handleOpen(false);
      }}
      closeOnOverlayClick={false}
    >
      <ModalCloseButton />
      <Header> Edit Description</Header>
      <CustomBody>
        <Box h={10}></Box>
        <ResourceNameCon alignItems={'center'}>
          {name}
          {type === 'Collection' ? (
            <Tag justifyContent={'center'} alignItems={'center'}>
              Data collection
            </Tag>
          ) : null}
        </ResourceNameCon>
        <Box h={32}></Box>
        <ItemTittle alignItems={'center'} justifyContent={'space-between'}>
          Description
          <span>Markdown syntax is supported. 0 of 1000 characters used.</span>
        </ItemTittle>
        <Box h={10}></Box>
        <InputCon>
          <Input
            value={desc}
            onChange={onChangeDesc}
            placeholder="Please enter an description..."
            maxLength={1000}
          ></Input>
        </InputCon>
        <Box h={10}></Box>
        <ItemTittle alignItems={'center'} justifyContent={'space-between'}>
          Thumbnail URL
          <span>Use Greenfield Universal Endpoint or other public url</span>
        </ItemTittle>
        <Box h={10}></Box>
        <InputCon>
          <Input
            value={imgUrl}
            onChange={onChangeImgUrl}
            placeholder="Please enter an url..."
          ></Input>
        </InputCon>
        <Box h={32}></Box>
        <FeeCon flexDirection={'column'} justifyContent={'space-between'}>
          <BottomInfo>
            <Item alignItems={'center'} justifyContent={'space-between'}>
              <ItemSubTittle>
                Gas fee to initiate{' '}
                <ColoredWarningIcon size="sm" color="#AEB4BC" />
              </ItemSubTittle>
              <BalanceCon flexDirection={'column'} alignItems={'flex-end'}>
                <Fee>{simulateInfo?.gasFee || '-'} BNB</Fee>
                {GF_FEE_SUFF ? (
                  <Balance>Greenfield Balance: {GfBalanceVal} BNB </Balance>
                ) : (
                  <BalanceWarn
                    gap={5}
                    alignItems={'center'}
                    justifyContent={'center'}
                  >
                    <ColoredWarningIcon size="sm" color="#ff6058" />{' '}
                    Insufficient Greenfield Balance
                  </BalanceWarn>
                )}
              </BalanceCon>
            </Item>
          </BottomInfo>
        </FeeCon>
      </CustomBody>
      <ModalFooter>
        <FooterCon flexDirection={'column'} gap={6}>
          {chain && chain.id === GF_CHAIN_ID && (
            <Button
              width={'100%'}
              onClick={async () => {
                try {
                  setLoading(true);
                  const result = await edit(
                    address as string,
                    groupName,
                    extraStr,
                  );
                  console.log(result);
                  toast.success({
                    description: 'edit success',
                    duration: 3000,
                  });
                } catch (error) {
                  console.log(error);
                  toast.error({ description: 'edit success', duration: 3000 });
                }
                setLoading(false);
                updateFn?.();
                handleOpen(false);
              }}
              disabled={!GF_FEE_SUFF || INFO_NO_CHANGE || loading}
              isLoading={loading}
            >
              {/* {loading ? (
                <Loader minHeight={20} style={{ color: '#e1a325' }}></Loader>
              ) : (
                'Confirm'
              )} */}
              Confirm
            </Button>
          )}
          {chain && chain.id !== GF_CHAIN_ID ? (
            <Button
              width={'100%'}
              onClick={async () => {
                switchNetwork?.(GF_CHAIN_ID);
              }}
            >
              Switch to Greenfield
            </Button>
          ) : null}
        </FooterCon>
      </ModalFooter>
    </Container>
  );
};

const Container = styled(Modal)`
  .ui-modal-content {
    background: #ffffff;
  }
`;
const Header = styled(ModalHeader)`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;

  display: flex;
  align-items: center;
  text-align: center;

  color: #000000;
`;

const CustomBody = styled(ModalBody)`
  height: 325px;
`;

const ItemTittle = styled(Flex)`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;

  color: #1e2026;

  span {
    color: #76808f;
  }
`;

const ResourceNameCon = styled(Flex)`
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;

  color: #000000;
`;

const Tag = styled(Flex)`
  margin-left: 16px;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 8px;
  line-height: 28px;

  width: 73px;
  height: 16px;

  background: #d9d9d9;

  border-radius: 16px;
`;

const InputCon = styled.div`
  .ui-input {
    background: #ffffff;
    /* readable/border */

    border: 1px solid #e6e8ea;
    border-radius: 8px;
    color: #aeb4bc;
  }
`;
const FeeCon = styled(Flex)`
  padding: 16px;

  width: 100%;
  height: 75px;

  border: 1px solid #e6e8ea;
  border-radius: 8px;
`;

const BottomInfo = styled.div``;
const Item = styled(Flex)`
  height: 40px;
`;
const ItemSubTittle = styled.div`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: #1e2026;
`;

const BalanceCon = styled(Flex)``;

const Fee = styled.div`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;

  color: #1e2026;
`;

const Balance = styled.div`
  text-align: right;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 18px;

  color: #696a6c;
`;

const BalanceWarn = styled(Flex)`
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-size: 10px;
  line-height: 18px;
  /* identical to box height, or 180% */

  color: #ff6058;
`;

const LineBox = styled(Box)`
  background: #fff;
`;

const FooterCon = styled(Flex)`
  width: 100%;
`;
