import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const usePagination = (queryKey = 'p') => {
  const [p] = useSearchParams();
  const queryPage = Number(p.get('page') || 1);

  const [page, setPage] = useState<number>(
    isNaN(queryPage) || queryPage < 1 ? 1 : queryPage,
  );
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();

  useEffect(() => {
    if (isNaN(queryPage)) {
      setPage(1);
    } else {
      setPage(queryPage);
    }
  }, [queryPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      setLoading(true);
      const source = `${location.hash.replace('#', '')}`;
      const hasQuery = source.indexOf('?') > -1;
      const reg = /page=([\d]+)/g;
      const hasPage = reg.test(source);
      const url = hasPage
        ? source.replace(/page=([\d]+)/g, `page=${page}`)
        : hasQuery
        ? `${source}&page=${page}`
        : `${source}?page=${page}`;

      navigator(`${url}`, {
        replace: true,
      });
    },
    [queryKey, p],
  );

  return { handlePageChange, page, loading };
};
