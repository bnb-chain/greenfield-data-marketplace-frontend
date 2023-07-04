import styled from '@emotion/styled';
import NoDataLogo from '../../images/no_data_logo.png';
import { Button, Flex } from '@totejs/uikit';
import { DCELLAR_URL } from '../../env';
const CollNoData = () => {
  return (
    <Container alignItems={'center'} justifyContent={'center'}>
      <Content gap={20} flexDirection={'column'} alignItems={'center'}>
        <img src={NoDataLogo} alt="" />
        <Title>
          You don’t have any data on Greenfield Testnet. Upload your data on
          DCellar first.👏
        </Title>
        <MyButton
          onClick={() => {
            window.open(`${DCELLAR_URL}`);
          }}
          size={'sm'}
          style={{ marginLeft: '6px' }}
        >
          Upload Data in DCellar
        </MyButton>
      </Content>
    </Container>
  );
};

export default CollNoData;

const Container = styled(Flex)`
  width: 1100px;
  height: 596px;

  padding: 4px 20px;
`;

const Content = styled(Flex)`
  img {
    width: 120px;
    height: 120px;
  }
`;

const Title = styled.div`
  width: 320px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

const MyButton = styled(Button)`
  width: 200px;
  height: 40px;
  border-radius: 8px;
`;
