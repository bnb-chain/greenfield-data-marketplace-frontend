import { Flex } from '@totejs/uikit';
import styled from '@emotion/styled';
import { ConnectKitButton } from 'connectkit';


const Header = () => {
  return (
    <Flex justifyContent={'space-between'} padding={'8px 24px'} height={56}>
      <ImageContainer>
        <img src="/images/logo.png" alt="logo" width={188} height={38}/>
      </ImageContainer>
      <ConnectKitButton />
    </Flex>
  );
};

export default Header;

const ImageContainer = styled.div`
  position: relative;
`;
