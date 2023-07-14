import { Flex } from '@totejs/uikit';
import styled from '@emotion/styled';
const Footer = () => {
  return (
    <FooterCon alignItems={'center'} justifyContent={'center'}>
      © 2023 BNB Chain. All rights reserved.
    </FooterCon>
  );
};

export default Footer;

const FooterCon = styled(Flex)`
  margin-top: 30px;
  color: #aeafb0;
  height: 48px;
  background-color: #000000;
`;
