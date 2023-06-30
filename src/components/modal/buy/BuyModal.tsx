import {
  Box,
  Button,
  Flex,
  QDrawerBody,
  QDrawerCloseButton,
  QDrawerHeader,
  QDrawerFooter,
  QDrawer,
} from '@totejs/uikit';
import { useModal } from '../../../hooks/useModal';
import styled from '@emotion/styled';
import { useMemo } from 'react';
import { defaultImg, divide10Exp, roundFun } from '../../../utils';
import { useChainBalance } from '../../../hooks/useChainBalance';
import { BN } from 'bn.js';
import { useBuy } from '../../../hooks/useBuy';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { BSC_CHAIN_ID } from '../../../env';

export const BuyModal = (props: any) => {
  const modalData = useModal();
  const { isOpen, handleOpen } = props;

  const { buyData }: { buyData: any } = modalData.modalState;

  const { name, id, price, type, groupName, ownerAddress } = buyData;

  const { buy, relayFee } = useBuy(groupName, ownerAddress, price);

  const { GfBalanceVal, BscBalanceVal } = useChainBalance();

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const priceBNB = useMemo(() => {
    const balance = divide10Exp(new BN(price, 10), 18);
    return balance;
  }, [price]);

  const earing = useMemo(() => {
    return Number(priceBNB) * 0.01;
  }, [priceBNB]);

  const relayFeeBNB = useMemo(() => {
    const balance = divide10Exp(new BN(relayFee, 10), 18);
    return balance;
  }, [relayFee]);

  const TotalPrice = useMemo(() => {
    return roundFun(Number(priceBNB) + Number(earing) + Number(relayFeeBNB), 6);
  }, [earing, priceBNB, relayFeeBNB]);

  const BSC_FEE_SUFF = useMemo(() => {
    return Number(BscBalanceVal) >= TotalPrice;
  }, [GfBalanceVal, TotalPrice]);

  return (
    <Container
      isOpen={isOpen}
      onClose={handleOpen}
      background={'#ffffff'}
      w={395}
    >
      <QDrawerCloseButton />
      <Header>Checking out</Header>
      <CustomBody>
        <InfoCon gap={12} justifyContent={'flex-start'} alignItems={'center'}>
          <ImgCon>
            <img src={defaultImg(name, 80)} alt="" />
          </ImgCon>
          <BaseInfo
            alignItems={'center'}
            justifyContent={'space-between'}
            flex={1}
          >
            <LeftInfo>
              <ResourceNameCon
                alignItems={'flex-start'}
                flexDirection={'column'}
              >
                {name}
                {type === 'Collection' ? (
                  <Tag justifyContent={'center'} alignItems={'center'}>
                    Data collection
                  </Tag>
                ) : null}
              </ResourceNameCon>
              {/* {type !== 'Collection' ? (
                <FileInfo gap={12}>
                  <div>
                    Collection <span>{groupName}</span>
                  </div>
                </FileInfo>
              ) : (
                <ResourceNum gap={4}>
                  {num} Items listed at
                  {listTime ? (
                    <CreateTime>{formatDateUTC(listTime * 1000)}</CreateTime>
                  ) : null}
                </ResourceNum>
              )} */}
            </LeftInfo>
            <ItemPrice>{priceBNB} BNB</ItemPrice>
          </BaseInfo>
        </InfoCon>
        <BuyInfo>
          <ItemCon justifyContent={'space-between'}>
            <ItemTitle>Gas fee</ItemTitle>
            <ItemVal>{relayFeeBNB} BNB</ItemVal>
          </ItemCon>
          <ItemCon justifyContent={'space-between'}>
            <ItemTitle>Service fee</ItemTitle>
            <ItemVal>1%</ItemVal>
          </ItemCon>
          <Box h={6}></Box>
          <Box h={1} border={'0.1px #181a1e solid'}></Box>
          <Box h={6}></Box>
          <ItemCon alignItems={'flex-end'} justifyContent={'space-between'}>
            <ItemTitle>Total</ItemTitle>
            <ItemVal> {TotalPrice} BNB </ItemVal>
          </ItemCon>
          <ItemCon alignItems={'flex-end'} justifyContent={'space-between'}>
            <ItemTitle>Balance on BSC Testnet</ItemTitle>
            <ItemVal> {roundFun(BscBalanceVal, 4)} BNB </ItemVal>
          </ItemCon>
        </BuyInfo>
      </CustomBody>
      {!BSC_FEE_SUFF && <BalanceWarn>Insufficient Balance</BalanceWarn>}
      <QDrawerFooter>
        {chain && chain.id === BSC_CHAIN_ID && (
          <Button
            width={'50%'}
            onClick={() => {
              buy(id);
              modalData.modalDispatch({ type: 'BUYING' });
            }}
            disabled={!BSC_FEE_SUFF}
          >
            Buy
          </Button>
        )}
        {chain && chain.id !== BSC_CHAIN_ID ? (
          <Button
            width={'100%'}
            onClick={() => {
              switchNetwork?.(BSC_CHAIN_ID);
            }}
          >
            Switch to BSC Testnet
          </Button>
        ) : null}
        <Cancel width={'50%'} onClick={handleOpen} variant="ghost">
          Cancel
        </Cancel>
      </QDrawerFooter>
    </Container>
  );
};

const Container = styled(QDrawer)`
  color: red;
  .ui-drawer-content {
    background: #ffffff;
  }
`;

const Header = styled(QDrawerHeader)`
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;

  display: flex;
  align-items: center;
  text-align: center;

  color: #000000;
`;

const CustomBody = styled(QDrawerBody)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const InfoCon = styled(Flex)``;

const BaseInfo = styled(Flex)``;

const LeftInfo = styled.div``;

const ItemPrice = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;

  color: #5f6368;
`;

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
  font-size: 18px;
  line-height: 28px;

  color: #5f6368;
`;

const Tag = styled(Flex)`
  font-style: normal;
  font-weight: 400;
  font-size: 8px;
  line-height: 28px;

  width: 60px;
  height: 16px;

  background: #d9d9d9;

  border-radius: 16px;
`;

const BuyInfo = styled.div`
  margin-top: 60px;
`;

const ItemCon = styled(Flex)``;

const ItemTitle = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;

  color: #1e2026;
`;

const ItemVal = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;

  color: #1e2026;
`;

const BalanceWarn = styled(Flex)`
  position: absolute;

  font-style: normal;
  font-weight: 700;
  font-size: 10px;
  line-height: 18px;
  /* identical to box height, or 180% */
  bottom: 90px;
  color: #ff6058;
`;

const Cancel = styled(Button)`
  color: #1e2026;
  &:hover {
    color: ${(props: any) => props.theme.colors.readable.normal};
  }
`;
