import styled from '@emotion/styled';
import { Copy } from '../components/Copy';
import { useAccount } from 'wagmi';
import { Flex } from '@totejs/uikit';
import ProfileList from '../components/profile/';

const Profile = () => {
  const { address } = useAccount();

  return (
    <Container>
      <PersonInfo gap={12}>
        <ImgCon>
          <img src="" alt="" />
        </ImgCon>
        <Info gap={4}>
          <Icon src="/images/logo.png" alt="" />
          <Address>{address}</Address>
          <Copy value={address} />
        </Info>
      </PersonInfo>
      <ProfileList></ProfileList>
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
  background-color: #d9d9d9;
  border-radius: 24px;
`;

const Info = styled(Flex)``;

const Address = styled.span`
  color: white;
`;
const Icon = styled.img`
  width: 20px;
  height: 20px;
`;
