import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobal } from '../hooks/useGlobal';

const Route = ({ children }: any) => {
  const location = useLocation();
  console.log(location);
  const state = useGlobal();
  useEffect(() => {
    console.log(666666, location.pathname);
    if (['/resource', '/folder'].indexOf(location.pathname) < 0) {
      state.globalDispatch({
        type: 'RESET',
      });
    }
  }, [location]);

  return children;
};
export default Route;
