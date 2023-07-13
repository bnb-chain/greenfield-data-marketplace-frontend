import styled from '@emotion/styled';
import { PenIcon, ColoredInfoIcon } from '@totejs/icons';
import { Box, Flex, Tooltip } from '@totejs/uikit';
import { Copy } from '../Copy';
import { getRandomSp } from '../../utils/gfSDK';
import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface IOverView {
  desc: string;
  showEdit: boolean;
  editFun: () => void;
  name: string;
  bucketName?: string;
  listed?: boolean;
  showEndpoints?: boolean;
}

const Overview = (props: IOverView) => {
  const { desc, showEdit, editFun, name, bucketName, listed, showEndpoints } =
    props;
  const [domain, setDomain] = useState('');

  const downloadUrl = useMemo(() => {
    return `${domain}/download/${bucketName}/${name}`;
  }, [name, bucketName, domain]);

  const previewUrl = useMemo(() => {
    return `${domain}/view/${bucketName}/${name}`;
  }, [name, bucketName, domain]);

  useEffect(() => {
    getRandomSp().then((result) => {
      setDomain(result);
    });
    const clickHandle = () => {
      setIsOpenF(false);
      setIsOpenS(false);
    };
    document.addEventListener('click', clickHandle);
    return () => {
      document.removeEventListener('click', clickHandle);
    };
  }, []);

  const [isOpenF, setIsOpenF] = useState(false);
  const [isOpenS, setIsOpenS] = useState(false);

  return (
    <Container>
      <Box h={20}></Box>
      <DescBox w={996} alignItems={'center'} justifyItems={'center'}>
        {desc ? (
          <ReactMarkdown children={desc} remarkPlugins={[remarkGfm]} />
        ) : (
          'This is a default description.'
        )}
        {showEdit && listed && (
          <PenCon
            onClick={() => {
              editFun?.();
            }}
            style={{ width: '16px', height: '16px', marginLeft: '4px' }}
          />
        )}
      </DescBox>
      {name && bucketName && name != bucketName && showEndpoints && (
        <>
          <Box h={65}></Box>
          <Title>Endpoints</Title>
          <Box h={20}></Box>
          <SupInfoCon w={996} h={300} padding={'24'}>
            <SupInfoItem flexDirection={'column'}>
              <SupInfoTitle
                gap={18}
                alignItems={'center'}
                justifyItems={'center'}
              >
                Download Universal Endpoint{' '}
                <Tooltip
                  isOpen={isOpenF}
                  content={
                    <div>
                      All storage objects in the Greenfield Network can be
                      identified and accessed through a universal resource
                      identifier (URI).
                      <LearnMore
                        target="_blank"
                        href="https://github.com/bnb-chain/greenfield-whitepaper/blob/main/part3.md#231-universal-endpoint"
                      >
                        Learn More
                      </LearnMore>
                    </div>
                  }
                >
                  <ColoredInfoIcon
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      setIsOpenF(true);
                    }}
                    style={{ width: '20px', height: '20px' }}
                  ></ColoredInfoIcon>
                </Tooltip>
              </SupInfoTitle>
              <Box h={8}></Box>
              <UrlCon justifyContent={'space-between'}>
                <Left alignItems={'center'} justifyContent={'center'}>
                  Https
                </Left>
                <Url alignItems={'center'} justifyContent={'flex-start'}>
                  {downloadUrl}
                </Url>
                <CopyCon alignItems={'center'} justifyContent={'center'}>
                  <Copy value={downloadUrl}></Copy>
                </CopyCon>
              </UrlCon>
            </SupInfoItem>
            <Box h={16}></Box>
            <SupInfoItem flexDirection={'column'}>
              <SupInfoTitle
                gap={18}
                alignItems={'center'}
                justifyItems={'center'}
              >
                Preview Universal Endpoint{' '}
                <Tooltip
                  isOpen={isOpenS}
                  content={
                    <div>
                      All storage objects in the Greenfield Network can be
                      identified and accessed through a universal resource
                      identifier (URI).
                      <LearnMore
                        target="_blank"
                        href="https://github.com/bnb-chain/greenfield-whitepaper/blob/main/part3.md#231-universal-endpoint"
                      >
                        Learn More
                      </LearnMore>
                    </div>
                  }
                >
                  <ColoredInfoIcon
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      setIsOpenS(true);
                    }}
                    style={{ width: '20px', height: '20px' }}
                  ></ColoredInfoIcon>
                </Tooltip>
              </SupInfoTitle>
              <Box h={8}></Box>
              <UrlCon justifyContent={'space-between'}>
                <Left alignItems={'center'} justifyContent={'center'}>
                  Https
                </Left>
                <Url alignItems={'center'} justifyContent={'flex-start'}>
                  {previewUrl}
                </Url>
                <CopyCon alignItems={'center'} justifyContent={'center'}>
                  <Copy value={previewUrl}></Copy>
                </CopyCon>
              </UrlCon>
            </SupInfoItem>
          </SupInfoCon>
        </>
      )}
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
const Title = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 31px;

  color: #ffffff;
`;

const SupInfoCon = styled(Box)`
  width: 996px;
  height: 228px;
  background: rgba(255, 255, 255, 0.14);
  border-radius: 8px;
`;

const SupInfoItem = styled(Flex)``;

const SupInfoTitle = styled(Flex)`
  width: 948px;

  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;

  color: #ffffff;
`;

const UrlCon = styled(Flex)`
  width: 948px;
  height: 50px;

  /* bg/bottom */

  background: #f5f5f5;
  /* readable/border */

  border: 1px solid #e6e8ea;
  border-radius: 8px;
`;

const Left = styled(Flex)`
  width: 115px;

  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;

  color: #76808f;

  border-right: 1px solid #e6e8ea;
`;

const CopyCon = styled(Flex)`
  width: 50px;
`;

const Url = styled(Flex)`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  /* identical to box height, or 150% */

  /* readable/normal */

  color: #1e2026;

  flex: 1;
  padding-left: 20px;
`;

const LearnMore = styled.a`
  color: #f0b90b;
`;
