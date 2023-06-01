import { useMediaQuery } from '@totejs/uikit';

export const BREAKPOINTS = {
  PC: 1200,
  TABLET: 767,
  MOBILE: 375,
};

export const pcMedia = `@media (min-width: ${BREAKPOINTS.PC + 1}px)`;
export const tabletMedia = `@media (max-width: ${BREAKPOINTS.PC}px)`;
export const tabletPcMedia = `@media (min-width: ${
  BREAKPOINTS.TABLET + 1
}px) and (max-width: ${BREAKPOINTS.PC}px)`;
export const mobileMedia = `@media (max-width: ${BREAKPOINTS.TABLET}px)`;
export const mobileSMedia = `@media (max-width: ${BREAKPOINTS.MOBILE}px)`;

export function useResponsive() {
  const [isMobile, isTablet, isPc] = useMediaQuery(
    [
      '(min-width: 0px) and (max-width: 767px)',
      '(min-width: 768px) and (max-width: 1199px)',
      '(min-width: 1200px)',
    ],
    [false, false, true],
  );

  return {
    isPc,
    isMobile,
    isTablet,
  };
}
