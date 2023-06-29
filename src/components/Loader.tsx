import { Box } from '@totejs/uikit';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

interface LoadingProps {
  minHeight?: number;
  size?: number;
  style?: React.CSSProperties;
}

export const Loader = (props: LoadingProps) => {
  const { minHeight = 200, size = 40, style } = props;
  return (
    <Box
      style={style}
      width={'100%'}
      minHeight={minHeight}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <SpinImage style={{ height: size, width: size }} />
    </Box>
  );
};

const rotate = keyframes`
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
`;

const SpinImage = styled.div`
  animation: ${rotate} 1s linear infinite;
  border: ${(props: any) =>
    `5px solid ${props.theme.colors.scene.primary.opacity}`};
  border-bottom-color: ${(props: any) =>
    props.theme.colors.scene.primary.normal};
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
`;
