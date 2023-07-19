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
  Textarea,
} from '@totejs/uikit';
import { useCallback, useMemo, useState } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import {
  GF_CHAIN_ID,
  INITIATE_LIST_FEE,
  LIST_ESTIMATE_FEE_ON_BSC,
  LIST_FEE_ON_GF,
} from '../../env';
import { useChainBalance } from '../../hooks/useChainBalance';
import { useList } from '../../hooks/useList';
import {
  defaultImg,
  formatDateUTC,
  generateGroupName,
  parseFileSize,
  roundFun,
} from '../../utils';
import Web3 from 'web3';
import { useCollectionItems } from '../../hooks/useCollectionItems';
import { useModal } from '../../hooks/useModal';
import Logo from '../../images/logo.png';
import { Loader } from '../Loader';
import { useDebounce } from '../../hooks/useDebounce';

interface ListModalProps {
  isOpen: boolean;
  handleOpen: (show: boolean) => void;
  detail: any;
}

export const ListModal = (props: ListModalProps) => {
  const { isOpen, handleOpen, detail } = props;

  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const [_price, _setPrice] = useState('');
  const [_desc, _setDesc] = useState('');
  const [_imgUrl, _setImgUrl] = useState('');

  const [waringPrice, setWarningPrice] = useState(false);
  const { switchNetwork } = useSwitchNetwork();
  const { GfBalanceVal, BscBalanceVal } = useChainBalance();
  const modalData = useModal();

  const { chain } = useNetwork();

  const { bucket_name, create_at, object_name } = detail;

  const name = object_name || bucket_name;

  const { num } = useCollectionItems(bucket_name, false);

  const setValue = useDebounce(async (fn: any, val: string) => {
    fn?.(val);
  }, 500);

  const onChangePrice = (event: any) => {
    setWarningPrice(false);
    _setPrice(event.target.value);
    setValue(setPrice, event.target.value);
  };
  const onChangeDesc = (event: any) => {
    _setDesc(event.target.value);
    setValue(setDesc, event.target.value);
  };
  const onChangeImgUrl = (event: any) => {
    _setImgUrl(event.target.value);
    setValue(setImgUrl, event.target.value);
  };

  const GF_FEE_SUFF = useMemo(() => {
    return GfBalanceVal >= LIST_FEE_ON_GF;
  }, [GfBalanceVal]);

  const BSC_FEE_SUFF = useMemo(() => {
    return BscBalanceVal >= LIST_ESTIMATE_FEE_ON_BSC;
  }, [GfBalanceVal]);

  const reset = useCallback(() => {
    setPrice('');
    setDesc('');
    setImgUrl('');
    handleOpen(false);
  }, []);

  const listData = useMemo(() => {
    return {
      groupName: generateGroupName(bucket_name, object_name),
      // groupName: Math.random().toString(36).slice(-6),
      extra: JSON.stringify({
        desc,
        url: imgUrl,
        price: price ? Web3.utils.toWei(price) : '',
      }),
    };
  }, [bucket_name, object_name, desc, imgUrl, price]);

  const { InitiateList, loading, simulateInfo } = useList(listData);

  const available = useMemo(() => {
    return GF_FEE_SUFF && BSC_FEE_SUFF && !loading;
  }, [GF_FEE_SUFF, BSC_FEE_SUFF, loading]);

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
      <Header>Listing Data</Header>
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
                {num} Items <span style={{ color: '#979797' }}>created at</span>
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
            value={_price}
            onChange={onChangePrice}
            placeholder="Please enter an amount..."
            type="number"
            isInvalid={waringPrice}
          ></Input>
          <BNBCon gap={10} alignItems={'center'}>
            <img src={Logo} alt="" width="24" height="24" />
            BNB
          </BNBCon>
        </InputCon>
        <Box h={10}></Box>
        <ItemTittle alignItems={'center'} justifyContent={'space-between'}>
          Description
          <span>
            Markdown syntax is supported. {desc.length} of 300 characters used.
          </span>
        </ItemTittle>
        <Box h={10}></Box>
        <InputCon>
          <Textarea
            value={_desc}
            onChange={onChangeDesc}
            placeholder="Please enter an description..."
            maxLength={300}
          />
        </InputCon>
        <Box h={10}></Box>
        <ItemTittle alignItems={'center'} justifyContent={'space-between'}>
          Thumbnail URL
          <span>Use Greenfield Universal Endpoint or other public url</span>
        </ItemTittle>
        <Box h={10}></Box>
        <InputCon>
          <Input
            value={_imgUrl}
            onChange={onChangeImgUrl}
            placeholder="Please enter an url..."
          ></Input>
        </InputCon>
        <Box h={32}></Box>
        <FeeCon flexDirection={'column'} justifyContent={'space-between'}>
          <BottomInfo>
            <Item alignItems={'center'} justifyContent={'space-between'}>
              <ItemSubTittle>
                Gas fee on Greenfield{' '}
                <ColoredWarningIcon size="sm" color="#AEB4BC" />
              </ItemSubTittle>
              {loading ? (
                <Loader
                  style={{ width: '32px' }}
                  size={32}
                  minHeight={32}
                ></Loader>
              ) : (
                <BalanceCon flexDirection={'column'} alignItems={'flex-end'}>
                  <Fee>{simulateInfo?.gasFee || INITIATE_LIST_FEE} BNB</Fee>
                  {GF_FEE_SUFF ? (
                    <Balance>
                      Greenfield Balance: {roundFun(GfBalanceVal, 8)} BNB{' '}
                    </Balance>
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
              )}
            </Item>
            <LineBox h={0.1}></LineBox>
            <Item alignItems={'center'} justifyContent={'space-between'}>
              <ItemSubTittle>
                Estimate gas fee on BSC{' '}
                <ColoredWarningIcon size="sm" color="#AEB4BC" />
              </ItemSubTittle>
              <BalanceCon flexDirection={'column'} alignItems={'flex-end'}>
                <Fee>{LIST_ESTIMATE_FEE_ON_BSC} BNB</Fee>
                {BSC_FEE_SUFF ? (
                  <Balance>
                    BSC Balance: {roundFun(BscBalanceVal, 8)} BNB{' '}
                  </Balance>
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

                reset();

                InitiateList();
                modalData.modalDispatch({
                  type: 'OPEN_LIST_PROCESS',
                  listData,
                });
              }}
              disabled={!available}
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
  height: 530px;
`;

const ItemTittle = styled(Flex)`
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
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;

  color: #5f6368;
`;

const CreateTime = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 28px;
`;
const Tag = styled(Flex)`
  margin-left: 16px;

  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 28px;

  width: 100px;
  height: 20px;

  background: #d9d9d9;

  border-radius: 16px;
`;
const ResourceNum = styled(Flex)`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 28px;

  color: #000000;
`;

const FileInfo = styled(Flex)`
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
  position: relative;
  .ui-input,
  .ui-textarea {
    background: #ffffff;
    /* readable/border */

    border: 1px solid #e6e8ea;
    border-radius: 8px;
    color: #aeb4bc;
  }
`;

const BNBCon = styled(Flex)`
  position: absolute;
  top: 8px;
  right: 10px;

  font-size: 14px;
  font-weight: 700;
  color: #5f6368;
`;

const FeeCon = styled(Flex)`
  padding: 16px;

  width: 100%;
  height: 115px;

  border: 1px solid #e6e8ea;
  border-radius: 8px;
`;

const Tips = styled(Flex)`
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
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: #1e2026;
`;

const BalanceCon = styled(Flex)``;

const Fee = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;

  color: #1e2026;
`;

const Balance = styled.div`
  text-align: right;

  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 18px;

  color: #696a6c;
`;

const BalanceWarn = styled(Flex)`
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
