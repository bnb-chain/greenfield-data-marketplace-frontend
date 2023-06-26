import { Flex } from '@totejs/uikit';
import styled from '@emotion/styled';
const Footer = () => {
  return (
    <FooterCon>
      <Flex justifyContent={'center'}>
        <CopyRight></CopyRight>
      </Flex>
    </FooterCon>
  );
};

export default Footer;

const FooterCon = styled.div`
  margin-top: 30px;
  height: 42px;
  background-color: #000000;
`;
const CopyRight = styled.div`
  padding: 13px;
  text-align: center;
  color: ${(props: any) => props.theme.colors.readable?.secondary};
`;
