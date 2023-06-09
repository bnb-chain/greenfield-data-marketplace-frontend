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
import { useMemo, useState } from 'react';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { BSC_CHAIN_ID, GF_CHAIN_ID } from '../../env';
import { useChainBalance } from '../../hooks/useChainBalance';
import { useList } from '../../hooks/useList';
import { delay, formatDateUTC, generateGroupName } from '../../utils';
import Web3 from 'web3';
import { useApprove } from '../../hooks/useApprove';
import { useCollectionItems } from '../../hooks/useCollectionItems';

interface ListModalProps {
  isOpen: boolean;
  handleOpen: (show: boolean) => void;
  detail: any;
}

export const ListModal = (props: ListModalProps) => {
  const { Mirror, GenGroup, List, InitiateList } = useList();
  const { Approve } = useApprove();

  const { isOpen, handleOpen, detail } = props;

  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [waringPrice, setWarningPrice] = useState(false);
  const { switchNetwork } = useSwitchNetwork();
  const { GfBalanceVal, BscBalanceVal } = useChainBalance();
  const [detailInfo, setDetailInfo] = useState({});

  const [isApprove, setApprove] = useState(true);

  const { bucket_name, id, create_at } = detail;
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

  const { address } = useAccount();
  return (
    <Container
      size={'lg'}
      isOpen={isOpen}
      onClose={() => {
        setPrice('');
        setDesc('');
        setImgUrl('');
        handleOpen(false);
      }}
    >
      <ModalCloseButton />
      <Header>List an collection</Header>
      <CustomBody>
        <Box h={10}></Box>
        <InfoCon gap={26} justifyContent={'center'} alignItems={'center'}>
          <ImgCon></ImgCon>
          <BaseInfo flexDirection={'column'}>
            <ResourceNameCon alignItems={'center'}>
              {bucket_name}
              {resourceType === '0' ? (
                <Tag justifyContent={'center'} alignItems={'center'}>
                  Data collection
                </Tag>
              ) : null}
            </ResourceNameCon>
            <ResourceNum gap={4}>
              {num} Items created at
              {create_at ? (
                <CreateTime>{formatDateUTC(create_at * 1000)}</CreateTime>
              ) : null}
            </ResourceNum>
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
                <Fee>0.0000036 BNB</Fee>
                <Balance>Greenfield Balance: {GfBalanceVal} BNB </Balance>
              </BalanceCon>
            </Item>
            <LineBox h={0.1}></LineBox>
            <Item alignItems={'center'} justifyContent={'space-between'}>
              <ItemSubTittle>
                Estimate Gas fee to Complete{' '}
                <ColoredWarningIcon size="sm" color="#AEB4BC" />
              </ItemSubTittle>
              <BalanceCon flexDirection={'column'} alignItems={'flex-end'}>
                <Fee>0.0000036 BNB</Fee>
                <Balance>BSC Balance: {BscBalanceVal} BNB </Balance>
              </BalanceCon>
            </Item>
          </BottomInfo>
        </FeeCon>
      </CustomBody>
      <ModalFooter>
        <FooterCon flexDirection={'column'} gap={6}>
          {isApprove ? (
            <Button
              width={'100%'}
              onClick={async () => {
                if (!price) {
                  setWarningPrice(true);
                  return;
                }
                const isApprove = localStorage.getItem(`approve_${address}`);
                if (!isApprove) {
                  await switchNetwork?.(BSC_CHAIN_ID);
                  await delay(3);
                  await Approve();
                }
                await switchNetwork?.(GF_CHAIN_ID);

                // dm_o_{bucket_name}_{obj_name}
                // dm_b_{bucket_name}
                const obj = {
                  groupName: generateGroupName(bucket_name),
                  // groupName: Math.random().toString(36).slice(-6),
                  extra: JSON.stringify({
                    desc,
                    url: imgUrl,
                    price: Web3.utils.toWei(price),
                  }),
                };
                // const groupInfo = await InitiateList(obj);
                const initiateInfo = await GenGroup(obj);
                // console.log(initiateInfo, '-----initiateInfo');
                const mirrorInfo = await Mirror(obj);

                await switchNetwork?.(BSC_CHAIN_ID);

                console.log('switch network is successful');

                await delay(5);

                await List(obj);
              }}
            >
              Start List Process
            </Button>
          ) : (
            <Button
              width={'100%'}
              onClick={async () => {
                Approve().then(() => {
                  setApprove(true);
                });
              }}
            >
              Approve
            </Button>
          )}

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

  background: #d9d9d9;
  border-radius: 8px;
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

const LineBox = styled(Box)`
  background: #fff;
`;

const FooterCon = styled(Flex)`
  width: 100%;
`;
