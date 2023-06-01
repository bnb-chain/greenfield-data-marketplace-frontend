import { Flex } from '@totejs/uikit';
import styled from '@emotion/styled';
import { ConnectKitButton } from 'connectkit';

const Header = () => {
  return (
    <HeaderFlex
      justifyContent={'space-between'}
      padding={'8px 24px'}
      height={56}
    >
      <ImageContainer>
        <img src="/images/logo.png" alt="logo" width={188} height={38} />
      </ImageContainer>
      <ConnectKitButton />
    </HeaderFlex>
  );
};

export default Header;

const HeaderFlex = styled(Flex)`
  background-color: #000000;
  border-bottom: 1px #2f3034 solid;
`;
const ImageContainer = styled.div`
  position: relative;

  img {
    width: 100px;
    height: 20px;
  }
`;
