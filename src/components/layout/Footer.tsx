import { Flex } from '@totejs/uikit';
import styled from '@emotion/styled';
const Footer = () => {
  return (
    <footer>
      <Flex justifyContent={'center'}>
        <CopyRight>© {new Date().getFullYear()} NodeReal. All rights reserved.</CopyRight>
      </Flex>
    </footer>
  );
};

export default Footer;

const CopyRight = styled.div`
  padding: 13px;
  text-align: center;
  color: ${(props: any) => props.theme.colors.readable?.secondary};
`;
