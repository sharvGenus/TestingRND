import { useCallback, useState } from 'react';
import { PAGINATION_CONST } from '../constants';

// ==============================|| CARD - PAGINATION ||============================== //

export default function usePagination() {
  const [paginations, setPaginations] = useState({
    pageIndex: PAGINATION_CONST.pageIndex,
    pageSize: PAGINATION_CONST.pageSize,
    forceUpdate: true
  });

  const setPageIndex = (_pageIndex) => setPaginations((prev) => ({ ...prev, pageIndex: _pageIndex, forceUpdate: !prev.forceUpdate }));
  const setPageSize = (_pageSize) =>
    setPaginations((prev) => ({ pageIndex: PAGINATION_CONST.pageIndex, pageSize: _pageSize, forceUpdate: !prev.forceUpdate }));

  const setPaginationsFunctions = useCallback(
    (_pageIndex = paginations.pageIndex, _pageSize = paginations.pageSize) => {
      setPaginations((prev) => ({
        pageIndex: _pageIndex,
        pageSize: _pageSize,
        forceUpdate: !prev.forceUpdate
      }));
    },
    [paginations]
  );

  const refreshPagination = useCallback(() => {
    setPaginations((prev) => ({
      pageIndex: PAGINATION_CONST.pageIndex,
      pageSize: PAGINATION_CONST.pageSize,
      forceUpdate: !prev.forceUpdate
    }));
  }, []);

  return { paginations, setPageIndex, setPageSize, refreshPagination, setPaginationsFunctions };
}
