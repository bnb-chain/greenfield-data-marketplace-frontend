import {
  Box,
  Button,
  Flex,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalFooter,
  Modal,
} from '@totejs/uikit';
import { useModal } from '../../../hooks/useModal';
import styled from '@emotion/styled';
import { useCollectionItems } from '../../../hooks/useCollectionItems';
import { useMemo } from 'react';
import {
  defaultImg,
  divide10Exp,
  formatDateUTC,
  parseGroupName,
} from '../../../utils';
import { useChainBalance } from '../../../hooks/useChainBalance';
import { ColoredWaitingIcon } from '@totejs/icons';
import { BN } from 'bn.js';
import { useBuy } from '../../../hooks/useBuy';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { BSC_CHAIN_ID } from '../../../env';
import { useHasRole } from '../../../hooks/useHasRole';
import { useApprove } from '../../../hooks/useApprove';

export const BuyModal = (props: any) => {
  const modalData = useModal();
  const { isOpen, handleOpen } = props;

  const { buyData }: { buyData: any } = modalData.modalState;

  const { name, id, listTime, price, type, groupName, ownerAddress } = buyData;

  const { num } = useCollectionItems(name);

  const { buy, relayFee } = useBuy(groupName, ownerAddress, price);

  const { GfBalanceVal, BscBalanceVal } = useChainBalance();

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const { hasRole, setHasRole } = useHasRole();

  const { Approve } = useApprove();

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
    return Number(priceBNB) + Number(earing) + Number(relayFeeBNB);
  }, [earing, priceBNB, relayFeeBNB]);

  const BSC_FEE_SUFF = useMemo(() => {
    return Number(BscBalanceVal) >= TotalPrice;
  }, [GfBalanceVal, TotalPrice]);

  return (
    <Container isOpen={isOpen} onClose={handleOpen}>
      <ModalCloseButton />
      <Header>Check out</Header>
      <CustomBody>
        <Box h={10}></Box>
        <InfoCon gap={26} justifyContent={'flex-start'} alignItems={'center'}>
          <ImgCon>
            <img src={defaultImg(name, 80)} alt="" />
          </ImgCon>
          <BaseInfo flexDirection={'column'} alignItems={'flex-start'}>
            <ResourceNameCon alignItems={'center'}>
              {name}
              {type === 'Collection' ? (
                <Tag justifyContent={'center'} alignItems={'center'}>
                  Data collection
                </Tag>
              ) : null}
            </ResourceNameCon>
            {type !== 'Collection' ? (
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
            )}
          </BaseInfo>
        </InfoCon>
        <Box h={10}></Box>
        <BuyInfo>
          <ItemCon justifyContent={'space-between'}>
            <ItemTitle>Price</ItemTitle>
            <ItemVal>{priceBNB} BNB</ItemVal>
          </ItemCon>
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
            <ItemVal> {BscBalanceVal} BNB </ItemVal>
          </ItemCon>
        </BuyInfo>
      </CustomBody>
      {!BSC_FEE_SUFF && <BalanceWarn>Insufficient Balance</BalanceWarn>}
      <ModalFooter>
        {chain && chain.id === BSC_CHAIN_ID && !hasRole && (
          <Button
            width={'50%'}
            onClick={async () => {
              await Approve();
              setHasRole(true);
            }}
            disabled={!BSC_FEE_SUFF}
          >
            Approve
          </Button>
        )}
        {chain && chain.id === BSC_CHAIN_ID && hasRole && (
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
            Switch to Bsc Testnet
          </Button>
        ) : null}
        <Cancel width={'50%'} onClick={handleOpen} variant="ghost">
          Cancel
        </Cancel>
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
  height: 260px;
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

const BuyInfo = styled.div`
  margin-top: 60px;
`;

const ItemCon = styled(Flex)``;

const ItemTitle = styled.div`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;

  color: #1e2026;
`;

const ItemVal = styled.div`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;

  color: #1e2026;
`;

const BalanceWarn = styled(Flex)`
  position: absolute;
  font-family: 'Space Grotesk';
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
