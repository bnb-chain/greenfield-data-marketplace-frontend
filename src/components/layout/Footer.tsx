import { Flex } from '@totejs/uikit';
import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';
const Footer = () => {
  const location = useLocation();
  return (
    <FooterCon
      style={{ marginTop: location.pathname != '/' ? '30px' : '' }}
      alignItems={'center'}
      justifyContent={'center'}
    >
      © 2023 BNB Chain. All rights reserved.
    </FooterCon>
  );
};

export default Footer;

const FooterCon = styled(Flex)`
  color: #aeafb0;
  height: 48px;
  background-color: #000000;
`;
