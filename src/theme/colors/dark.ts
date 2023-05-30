import { rgba } from '@totejs/uikit';

export const dark = {
  colors: {
    readable: {
      normal: '#E6E8EA',
      secondary: '#76808F',
      disabled: '#5E6673',
      border: '#2E323A',
      white: '#FFFFFF',
      top: {
        secondary: '#929AA5',
      },
    },

    bg: {
      bottom: '#14151A',
      middle: '#1E2026',
      codebox: '#262D37',
      top: {
        normal: '#2B2F36',
        active: '#2E323A',
      },
    },

    scene: {
      primary: {
        normal: '#9B00FB',
        active: '#CD7CFF',
        opacity: rgba('#B845FF', 0.1),
      },

      success: {
        normal: '#02C076',
        active: '#48FFB8',
        opacity: rgba('#2ED191', 0.1),
      },

      danger: {
        normal: '#D9304E',
        active: '#FF898F',
        opacity: rgba('#FC6E75', 0.1),
      },

      warning: {
        normal: '#EB9E09',
        active: '#FFCE58',
        opacity: rgba('#F5B631', 0.1),
      },
    },
  },

  shadows: {
    normal: '0px 4px 24px rgba(0, 0, 0, 0.08)',
  },
};