export const getDomain = () => {
  if (typeof window === 'undefined') {
    throw new Error('getDomain() must be called from the browser');
  }
  return window.location.origin;
};
