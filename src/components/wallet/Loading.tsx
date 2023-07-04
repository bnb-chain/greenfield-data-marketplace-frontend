import { Box } from '@totejs/uikit';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { IconProps, Icon } from '@totejs/icons';

const LoadingSvg = (props: IconProps) => {
  return (
    <Icon
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18.95 10C18.95 11.1491 18.7237 12.2869 18.284 13.3485C17.8442 14.4101 17.1997 15.3747 16.3872 16.1872C15.5747 16.9997 14.6101 17.6442 13.5485 18.0839C12.4869 18.5237 11.3491 18.75 10.2 18.75C9.05095 18.75 7.91313 18.5237 6.85153 18.0839C5.78993 17.6442 4.82534 16.9997 4.01283 16.1872C3.20031 15.3747 2.55579 14.4101 2.11607 13.3485C1.67634 12.2869 1.45001 11.1491 1.45001 10C1.45001 8.85093 1.67634 7.71312 2.11607 6.65152C2.5558 5.58992 3.20032 4.62533 4.01283 3.81281C4.82534 3.0003 5.78994 2.35578 6.85154 1.91605C7.91314 1.47632 9.05095 1.25 10.2 1.25C11.3491 1.25 12.4869 1.47633 13.5485 1.91606C14.6101 2.35579 15.5747 3.00031 16.3872 3.81282C17.1997 4.62533 17.8442 5.58993 18.284 6.65152C18.7237 7.71312 18.95 8.85094 18.95 10L18.95 10Z"
        stroke="#8C8D8F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.2 1.25C11.3491 1.25 12.4869 1.47633 13.5485 1.91605C14.6101 2.35578 15.5747 3.0003 16.3872 3.81282C17.1997 4.62533 17.8442 5.58992 18.284 6.65152C18.7237 7.71312 18.95 8.85094 18.95 10"
        stroke="#2F3034"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

interface LoadingProps {
  minHeight?: number;
  style?: { [key: string]: any };
  svgStyle?: { [key: string]: any };
}

export const Loading = (props: LoadingProps) => {
  const { minHeight = 20, style, svgStyle } = props;
  return (
    <Box
      style={style}
      width={'100%'}
      minHeight={minHeight}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <SpinImage>
        <LoadingSvg style={svgStyle} />
      </SpinImage>
    </Box>
  );
};

const rotate = keyframes`
  from {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0deg);
  }
`;

const SpinImage = styled.div`
  animation: ${rotate} 1s linear infinite;
`;
