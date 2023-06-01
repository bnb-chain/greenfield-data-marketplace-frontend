import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';

const Overview = () => {
  return (
    <Container>
      <DescBox w={996} h={100}>
        AI generated harry potter illustrations, HD image, can be used in many
        scenarios, all kinds of styles, sizes, types included, easy to use.{' '}
      </DescBox>
      <Box h={65}></Box>
      <Title>Details</Title>
      <Box h={20}></Box>
      <SupInfoCon w={996} h={300} padding={'40'}>
        <SupInfoFlex></SupInfoFlex>
      </SupInfoCon>
    </Container>
  );
};

export default Overview;

const Container = styled.div``;

const DescBox = styled(Box)`
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.19);
`;

const Title = styled.div`
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 31px;

  color: #ffffff;
`;

const SupInfoCon = styled(Box)`
  background: rgba(255, 255, 255, 0.19);
`;

const SupInfoFlex = styled(Flex)`
  border: 1px solid #5f6368;
  border-radius: 8px;

  padding: 20px;
`;
