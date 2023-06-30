import styled from '@emotion/styled';
import { Copy } from '../components/Copy';
import { useAccount } from 'wagmi';
import { Flex } from '@totejs/uikit';
import ProfileList from '../components/profile/Index';
import Identicon from 'identicon.js';
import sha265 from 'sha256';
import Logo from '../images/logo.png';
import { trimLongStr } from '../utils';
import { useSearchParams } from 'react-router-dom';
import Web3 from 'web3';
import { useMemo } from 'react';

const Profile = () => {
  const { address } = useAccount();

  const sha = sha265((address as string) || 'default');
  const dataBase = new Identicon(sha, 120).toString();
  const url = `data:image/png;base64,${dataBase}`;

  const [p] = useSearchParams();
  const otherAddress = p.getAll('address')[0];

  const realAddress = useMemo(() => {
    return otherAddress && Web3.utils.isAddress(otherAddress)
      ? otherAddress
      : address;
  }, [address, otherAddress]);

  return (
    <Container>
      <PersonInfo gap={32} alignItems={'flex-start'}>
        <ImgCon>
          <img src={url} alt="" />
        </ImgCon>
        <Info gap={16} alignItems={'center'} justifyContent={'center'}>
          <Icon src={Logo} alt="" />
          <Address>{trimLongStr(realAddress as string)}</Address>
          <Copy value={realAddress} />
        </Info>
      </PersonInfo>
      {realAddress && (
        <ProfileList
          self={realAddress === address}
          realAddress={realAddress}
        ></ProfileList>
      )}
    </Container>
  );
};

export default Profile;

const Container = styled.div`
  margin-top: 60px;
`;
const PersonInfo = styled(Flex)``;

const ImgCon = styled.div`
  width: 120px;
  height: 120px;

  img {
    background: #d9d9d9;
    border-radius: 24px;
  }
`;

const Info = styled(Flex)``;

const Address = styled.span`
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 24px;

  color: #ffffff;
`;
const Icon = styled.img`
  width: 36px;
  height: 36px;
`;
