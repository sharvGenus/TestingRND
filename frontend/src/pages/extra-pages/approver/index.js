import { useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Main from './main';
import { useApprovers } from './useApprover';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import { getAllApprovers } from 'store/actions';
import useSearch from 'hooks/useSearch';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import { hasChanged } from 'utils';

const Project = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    setPageIndex,
    refreshPagination,
    setPageSize
  } = usePagination();
  const { searchString, forceSearch, accessorsRef, setAccessors, setSearchString, searchStringTrimmed } = useSearch();

  const [addApprover, setAddApprover] = useState(false);
  const [sort, setSort] = useState(null);

  const dispatch = useDispatch();

  const { filterObjectForApi } = useFilterContext();

  const prevFilterObjectForApi = usePrevious(filterObjectForApi);
  const prevSort = usePrevious(sort);

  useEffect(() => {
    if (addApprover) return;

    if (
      [
        [prevFilterObjectForApi, filterObjectForApi],
        [prevSort, sort]
      ].some(hasChanged)
    ) {
      refreshPagination();
      return;
    }

    dispatch(
      getAllApprovers({
        pageIndex,
        pageSize,
        ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) }),
        sortBy: sort?.[0] || 'updatedAt',
        sortOrder: sort?.[1] || 'DESC',
        filterObject: filterObjectForApi
      })
    );
  }, [
    dispatch,
    pageIndex,
    pageSize,
    searchStringTrimmed,
    sort,
    accessorsRef,
    forceUpdate,
    forceSearch,
    refreshPagination,
    prevFilterObjectForApi,
    filterObjectForApi,
    prevSort,
    addApprover
  ]);

  const { approversList } = useApprovers();
  const { data, count } = useMemo(
    () => ({
      data: approversList.approversListObject?.rows || [],
      count: approversList.approversListObject?.count || 0,
      isLoading: approversList.loading || false
    }),
    [approversList]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Project',
        accessor: 'project.name',
        filterProps: {
          tableName: 'projects',
          getColumn: 'name',
          customAccessor: 'projectName'
        }
      },
      {
        Header: 'Transaction Type',
        accessor: 'transaction_type.name',
        filterProps: {
          tableName: 'organizationType',
          getColumn: 'name',
          customAccessor: 'transactionType'
        }
      },
      {
        Header: 'Organization Name',
        accessor: 'organization.name',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'name',
          customAccessor: 'orgName'
        }
      },
      {
        Header: 'Organization Store',
        accessor: 'organization_store.name',
        filterProps: {
          tableName: 'organization_stores',
          getColumn: 'name',
          customAccessor: 'orgStoreName'
        }
      },
      {
        Header: 'Name',
        accessor: 'user.name',
        filterProps: {
          tableName: 'users',
          getColumn: 'name',
          customAccessor: 'name'
        }
      },
      {
        Header: 'Email',
        accessor: 'email',
        filterProps: {
          tableName: 'approver',
          getColumn: 'email',
          customAccessor: 'email'
        }
      },
      {
        Header: 'Mobile Number',
        accessor: 'mobileNumber',
        filterProps: {
          tableName: 'approver',
          getColumn: 'mobile_number',
          customAccessor: 'mobileNumber'
        }
      },
      {
        Header: 'Created On',
        accessor: 'createdAt'
      },
      {
        Header: 'Updated On',
        accessor: 'updatedAt'
      }
    ],
    []
  );

  const onBack = () => {
    setAddApprover(!addApprover);
  };

  return (
    <>
      {addApprover ? (
        <Main setAddApprover={setAddApprover} addApprover={addApprover} />
      ) : (
        <TableForm
          title="Approver"
          data={data}
          columns={columns}
          count={count}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onClick={onBack}
          hideActions
          hideType
          searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
          sortConfig={{ sort, setSort }}
          exportConfig={{
            tableName: 'approver',
            apiQuery: { filterObject: filterObjectForApi }
          }}
        />
      )}
    </>
  );
};

export default Project;
