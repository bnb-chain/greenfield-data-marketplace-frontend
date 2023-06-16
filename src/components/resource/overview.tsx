import styled from '@emotion/styled';
import { PenIcon } from '@totejs/icons';
import { Box, Flex } from '@totejs/uikit';

interface IOverView {
  desc: string;
  showEdit: boolean;
  editFun: () => void;
}
const Overview = (props: IOverView) => {
  const { desc, showEdit, editFun } = props;
  return (
    <Container>
      <Box h={20}></Box>
      <DescBox w={996} h={100} alignItems={'center'} justifyItems={'center'}>
        {desc ||
          'DescriptionDecentralized Artificial Intelligence (DAI) is a type of AI system that utilizes Blockchain technology to store and process data. In a DAI system, decision-making processes are decentralized and based on consensus among multiple nodes instead of being controlled by a single central authority. This approach provides a more secure, transparent, and trustworthy alternative to traditional AI systems.'}
        {showEdit && (
          <PenCon
            onClick={() => {
              editFun?.();
            }}
            style={{ width: '16px', height: '16px', marginLeft: '4px' }}
          />
        )}
      </DescBox>
      {/* <Box h={65}></Box>
      <Title>Details</Title>
      <Box h={20}></Box>
      <SupInfoCon w={996} h={300} padding={'40'}>
        <SupInfoFlex></SupInfoFlex>
      </SupInfoCon> */}
    </Container>
  );
};

export default Overview;

const Container = styled.div``;

const DescBox = styled(Box)`
  border-radius: 8px;
  // background: rgba(255, 255, 255, 0.19);
`;

const PenCon = styled(PenIcon)`
  width: 16px;
  height: 16px;
  margin-left: 4px;
  cursor: pointer;
`;
// const Title = styled.div`
//   font-family: 'Space Grotesk';
//   font-style: normal;
//   font-weight: 400;
//   font-size: 24px;
//   line-height: 31px;

//   color: #ffffff;
// `;

// const SupInfoCon = styled(Box)`
//   background: rgba(255, 255, 255, 0.19);
// `;

// const SupInfoFlex = styled(Flex)`
//   border: 1px solid #5f6368;
//   border-radius: 8px;

//   padding: 20px;
// `;
