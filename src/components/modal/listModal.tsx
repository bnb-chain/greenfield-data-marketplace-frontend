import styled from '@emotion/styled';
import { ColoredWarningIcon } from '@totejs/icons';
import { Box, Flex, Input } from '@totejs/uikit';
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
  BSC_CHAIN_ID,
  GF_CHAIN_ID,
  GROUP_HUB_CONTRACT_ADDRESS,
  LIST_ESTIMATE_FEE_ON_BSC,
  LIST_FEE_ON_GF,
  MARKETPLACE_CONTRACT_ADDRESS,
} from '../../env';
import { useChainBalance } from '../../hooks/useChainBalance';
import { useList } from '../../hooks/useList';
import {
  defaultImg,
  delay,
  formatDateUTC,
  generateGroupName,
  parseFileSize,
} from '../../utils';
import Web3 from 'web3';
import { useApprove } from '../../hooks/useApprove';
import { useCollectionItems } from '../../hooks/useCollectionItems';
import { useModal } from '../../hooks/useModal';
import { useHasRole } from '../../hooks/useHasRole';
import { useChains } from 'connectkit';

interface ListModalProps {
  isOpen: boolean;
  handleOpen: (show: boolean) => void;
  detail: any;
}

export const ListModal = (props: ListModalProps) => {
  const { InitiateList } = useList();
  const { Approve } = useApprove();

  const { isOpen, handleOpen, detail } = props;

  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [waringPrice, setWarningPrice] = useState(false);
  const { switchNetwork } = useSwitchNetwork();
  const { GfBalanceVal, BscBalanceVal } = useChainBalance();
  const modalData = useModal();

  const { chain } = useNetwork();

  const { bucket_name, id, create_at, object_name } = detail;

  const name = object_name || bucket_name;

  const { num } = useCollectionItems(bucket_name);

  const onChangePrice = (event: any) => {
    setWarningPrice(false);
    setPrice(event.target.value);
  };
  const onChangeDesc = (event: any) => {
    setDesc(event.target.value);
  };
  const onChangeImgUrl = (event: any) => {
    setImgUrl(event.target.value);
  };

  const resourceType = sessionStorage.getItem('resource_type');

  const earing = useMemo(() => {
    return Number(price) * 0.99;
  }, [price]);

  const GF_FEE_SUFF = useMemo(() => {
    return GfBalanceVal >= LIST_FEE_ON_GF;
  }, [GfBalanceVal]);

  const BSC_FEE_SUFF = useMemo(() => {
    return BscBalanceVal >= LIST_ESTIMATE_FEE_ON_BSC;
  }, [GfBalanceVal]);

  const SUFF = useMemo(() => {
    return GF_FEE_SUFF && BSC_FEE_SUFF;
  }, [GF_FEE_SUFF, BSC_FEE_SUFF]);

  const reset = useCallback(() => {
    setPrice('');
    setDesc('');
    setImgUrl('');
    handleOpen(false);
  }, []);

  return (
    <Container
      size={'lg'}
      isOpen={isOpen}
      onClose={() => {
        reset();
      }}
      closeOnOverlayClick={false}
    >
      <ModalCloseButton />
      <Header> {object_name ? 'List Data' : 'List an collection'}</Header>
      <CustomBody>
        <Box h={10}></Box>
        <InfoCon gap={26} justifyContent={'center'} alignItems={'center'}>
          <ImgCon>
            <img src={defaultImg(name, 80)} alt="" />
          </ImgCon>
          <BaseInfo flexDirection={'column'} alignItems={'flex-start'}>
            <ResourceNameCon alignItems={'center'}>
              {name}
              {!object_name ? (
                <Tag justifyContent={'center'} alignItems={'center'}>
                  Data collection
                </Tag>
              ) : null}
            </ResourceNameCon>
            {object_name ? (
              <FileInfo gap={12}>
                <span>{parseFileSize(detail.payload_size)} </span>
                <div>
                  Collection <span>{bucket_name}</span>
                </div>
              </FileInfo>
            ) : (
              <ResourceNum gap={4}>
                {num} Items created at
                {create_at ? (
                  <CreateTime>{formatDateUTC(create_at * 1000)}</CreateTime>
                ) : null}
              </ResourceNum>
            )}
          </BaseInfo>
        </InfoCon>
        <Box h={10}></Box>
        <ItemTittle className="require">Price</ItemTittle>
        <Box h={10}></Box>
        <InputCon>
          <Input
            value={price}
            onChange={onChangePrice}
            placeholder="Please enter an amount..."
            type="number"
            isInvalid={waringPrice}
          ></Input>
        </InputCon>
        <Box h={10}></Box>
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
                <Fee>{LIST_FEE_ON_GF} BNB</Fee>
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
            <LineBox h={0.1}></LineBox>
            <Item alignItems={'center'} justifyContent={'space-between'}>
              <ItemSubTittle>
                Estimate Gas fee to Complete{' '}
                <ColoredWarningIcon size="sm" color="#AEB4BC" />
              </ItemSubTittle>
              <BalanceCon flexDirection={'column'} alignItems={'flex-end'}>
                <Fee>{LIST_ESTIMATE_FEE_ON_BSC} BNB</Fee>
                {BSC_FEE_SUFF ? (
                  <Balance>BSC Balance: {BscBalanceVal} BNB </Balance>
                ) : (
                  <BalanceWarn>
                    <ColoredWarningIcon size="sm" color="#ff6058" />{' '}
                    Insufficient BSC Balance
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
                if (!price) {
                  setWarningPrice(true);
                  return;
                }

                // dm_o_{bucket_name}_{obj_name}
                // dm_b_{bucket_name}
                const obj = {
                  groupName: generateGroupName(bucket_name, object_name),
                  // groupName: Math.random().toString(36).slice(-6),
                  extra: JSON.stringify({
                    desc,
                    url: imgUrl,
                    price: Web3.utils.toWei(price),
                  }),
                };

                reset();

                InitiateList(obj);

                modalData.modalDispatch({
                  type: 'OPEN_LIST_PROCESS',
                  listData: obj,
                });
              }}
              disabled={!SUFF}
            >
              Start List Process
            </Button>
          )}
          {chain && chain.id !== GF_CHAIN_ID ? (
            <Button
              width={'100%'}
              onClick={async () => {
                switchNetwork?.(GF_CHAIN_ID);
              }}
            >
              Switch to Greenfield to Start
            </Button>
          ) : null}
          <Tips alignItems={'center'} gap={10} justifyContent={'center'}>
            <ColoredWarningIcon />
            Please notice that all the data items on the data collection will be
            listed as a whole
          </Tips>
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
  height: 475px;
`;
const ItemInfo = styled.div``;

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

const InfoCon = styled(Flex)``;

const BaseInfo = styled(Flex)``;

const ImgCon = styled.div`
  width: 80px;
  height: 80px;

  img {
    background: #d9d9d9;
    border-radius: 8px;
  }
`;
const ResourceNameCon = styled(Flex)`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;

  color: #5f6368;
`;

const CreateTime = styled.div`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 28px;
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
const ResourceNum = styled(Flex)`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 28px;

  color: #000000;
`;

const FileInfo = styled(Flex)`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 28px;

  color: #979797;
  div {
    display: flex;
    gap: 2px;
  }
  span {
    color: #181a1e;
  }
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
  height: 115px;

  border: 1px solid #e6e8ea;
  border-radius: 8px;
`;

const Tips = styled(Flex)`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;

  color: #76808f;

  width: 100%;
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
