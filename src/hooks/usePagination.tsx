import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const usePagination = () => {
  const navigate = useNavigate();

  const queryPage = 1;

  const [page, setPage] = useState<number>(
    isNaN(queryPage) || queryPage < 1 ? 1 : queryPage,
  );

  useEffect(() => {
    if (isNaN(queryPage)) {
      setPage(1);
    } else {
      setPage(queryPage);
    }
  }, [queryPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      navigate(`detail`);
      setPage(page);
    },
    [navigate],
  );

  return { handlePageChange, page };
};
