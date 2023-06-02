import { Icon, IconProps } from '@totejs/icons';

export const BSCLogo = (props: IconProps) => {
  return (
    <Icon
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <rect x="0.5" y="0.5" width="15" height="15" fill="url(#pattern0)" />
      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_506_1632"
            transform="translate(0.0514019) scale(0.00934579)"
          />
        </pattern>
        <image
          id="image0_506_1632"
          width="96"
          height="107"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </Icon>
  );
};
