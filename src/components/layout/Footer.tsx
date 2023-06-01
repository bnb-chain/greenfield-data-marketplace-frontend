import { Flex } from '@totejs/uikit';
import styled from '@emotion/styled';
const Footer = () => {
  return (
    <FooterCon>
      <Flex justifyContent={'center'}>
        <CopyRight>
          © {new Date().getFullYear()} NodeReal. All rights reserved.
        </CopyRight>
      </Flex>
    </FooterCon>
  );
};

export default Footer;

const FooterCon = styled.footer`
  background-color: #000000;
`;
const CopyRight = styled.div`
  padding: 13px;
  text-align: center;
  color: ${(props: any) => props.theme.colors.readable?.secondary};
`;
