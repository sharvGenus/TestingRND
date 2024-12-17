import PropTypes from 'prop-types';
import { Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Button,
  Checkbox,
  Grid,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LockOutlineIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlineIcon from '@mui/icons-material/LockOpenOutlined';
import RestoreIcon from '@mui/icons-material/Restore';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
// import EditNoteIcon from '@mui/icons-material/EditNote';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTable, useFilters, useGlobalFilter, useSortBy } from 'react-table';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import IconButton from 'components/@extended/IconButton';
import {
  UnifiedHeaderSort,
  APIExport,
  CSVExport,
  EmptyTable,
  HidingSelect,
  TablePagination,
  APIImport,
  APIUpdate
} from 'components/third-party/ReactTable';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { GlobalFilter, DefaultColumnFilter, renderFilterTypes } from 'utils/react-table';
import { formatTimeStamp, formatOperator, getVisibleColumns, formatDate } from 'utils';

import tableExportData from 'utils/tablesExportData';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import toast from 'utils/ToastNotistack';
import useAuth from 'hooks/useAuth';

// ==============================|| REACT TABLE ||============================== //
const PDFExport = ({ onClick, disabled }) => {
  return (
    <Tooltip title={disabled ? 'No data available to export' : 'PDF Export'}>
      <DownloadOutlined
        onClick={disabled ? () => {} : onClick}
        style={{ fontSize: '25px', color: disabled ? 'rgb(210, 210, 210)' : 'grey', ...(disabled && { cursor: 'auto' }), padding: '5px' }}
      />
    </Tooltip>
  );
};

PDFExport.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

const ResetFilterButton = ({ clearAllFilters, setSort, defaultSort }) => {
  return (
    <Tooltip title="Reset Sort and Filter" placement="bottom">
      <IconButton
        color="secondary"
        onClick={() => {
          if (typeof clearAllFilters === 'function') {
            clearAllFilters();
          }
          if (typeof setSort === 'function') {
            setSort(defaultSort || null);
          }
        }}
      >
        <FilterAltOffOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
};

ResetFilterButton.propTypes = {
  clearAllFilters: PropTypes.func,
  setSort: PropTypes.func,
  defaultSort: PropTypes.array
};

export const TableSkeleton = ({ columns, hideActions }) => {
  return (
    <>
      {Array.from({ length: 14 }).map((_, ind) => (
        // eslint-disable-next-line react/no-array-index-key
        <TableRow key={ind}>
          {Array.from({ length: columns.length })?.map((__, index) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Fragment key={index}>
                {!hideActions && index === 0 && (
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                )}
                <TableCell>
                  <Skeleton />
                </TableCell>
              </Fragment>
            );
          })}
        </TableRow>
      ))}
    </>
  );
};

TableSkeleton.propTypes = {
  columns: PropTypes.array,
  hideActions: PropTypes.bool
};

const TableWrapper = styled('div')(() => ({
  '.header': {
    position: 'sticky',
    zIndex: 1,
    width: 'fit-content'
  },
  '& th[data-sticky-td]': {
    position: 'sticky',
    zIndex: '5 !important'
  }
}));

function createFileNameForExport(title, exportConfig) {
  if (typeof title === 'string' && title.trim().length > 0) {
    return `${title.toLowerCase().replaceAll(' ', '-')}.csv`;
  } else if (exportConfig?.fileName) {
    return `${exportConfig.fileName}.csv`;
  } else {
    return 'csv-export.csv';
  }
}
function ReactTable({
  title,
  columns,
  data,
  normalDate,
  hideTopBorder,
  hideAddButton,
  miniAction,
  fcAction,
  formAttributesArray,
  selectIcon,
  isMasterForm,
  // hideRaiseTicket,
  hideEditIcon,
  hideDeleteIcon,
  showLockIcon,
  hideRestoreIcon,
  hideActions,
  hideHeader,
  hideExportButton,
  hideSearch,
  hideType,
  hideLockType,
  hideColumnsSelect,
  disableDeleteIcon,
  listType,
  setListType,
  lockType,
  setLockType,
  count,
  onClick,
  handleRowDelete,
  handleRowRestore,
  handleRowUpdate,
  handleRowHistory,
  handleRowView,
  handleLockToggle,
  hidePagination,
  setPageIndex,
  setPageSize,
  pageIndex,
  pageSize,
  showBackButton,
  subHeader,
  source,
  showCheckbox,
  showColumnsCheckbox,
  accessTableOnly,
  selectedRecord,
  setSelectedRecords,
  setSelectedColumns,
  hideViewIcon,
  hideImportButton,
  hideUpdateButton,
  hideHistoryIcon,
  hideEmptyTable,
  enableOfflineSort,
  exportPDFOnly,
  exportToPdf,
  searchConfig,
  searchOnClick,
  sortConfig,
  exportConfig,
  devolutionExport,
  importConfig,
  importDep,
  importQA,
  hideTitle,
  importCompeted,
  oldColumns,
  forColumnAccess,
  isFcMode,
  isHistory,
  loadingCondition,
  cleanupTrigger,
  allData,
  LoggedInUserhierarchyType,
  customCount,
  countLoader,
  componentFrom
}) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedCols, setSelectedCols] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const { isCurrentlyFiltering, clearAllFilters } = useFilterContext();

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const defaultColumn = useMemo(() => ({ disableFilters: true, Filter: DefaultColumnFilter }), []);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    allColumns,
    setHiddenColumns,
    state: { globalFilter, hiddenColumns },
    preGlobalFilteredRows,
    setGlobalFilter
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  const fileNameForExport = useMemo(() => createFileNameForExport(title, exportConfig), [title, exportConfig]);
  const { sort, setSort, defaultSort } = sortConfig || {};
  const { searchString, setSearchString, setAccessors, searchStringTrimmed } = searchConfig || {};
  const shouldExportUsingApi = useMemo(() => !!exportConfig?.tableName, [exportConfig]);
  const isCurrentlySorting = !!sort?.[2];
  const isApiSearch = typeof setSearchString === 'function';
  const prevCleanupTrigger = usePrevious(cleanupTrigger);

  const handleRowSelect = useCallback(
    (row) => {
      const selectedIndex = selectedRows.indexOf(row.id);
      let newSelectedRows = [];

      if (selectedIndex === -1) {
        newSelectedRows = [...selectedRows, row.id];
      } else {
        newSelectedRows = selectedRows.filter((id) => id !== row.id);
      }

      setSelectedRows(newSelectedRows);
      setSelectedRecords(newSelectedRows);

      if (newSelectedRows.length === rows.length) {
        setSelectAll(true);
      } else if (newSelectedRows.length === 0) {
        setSelectAll(false);
      }
    },
    [rows.length, selectedRows, setSelectedRecords]
  );

  const handleColumnSelect = useCallback(
    (col) => {
      const selectedIndex = selectedCols.indexOf(col.id);
      let newSelectedCols = [];

      if (selectedIndex === -1) {
        newSelectedCols = [...selectedCols, col.id];
      } else {
        newSelectedCols = selectedCols.filter((id) => id !== col.id);
      }

      setSelectedCols(newSelectedCols);
      setSelectedColumns(newSelectedCols);

      if (newSelectedCols.length === headerGroups[0]?.headers.length) {
        setSelectAll(true);
      } else if (newSelectedCols.length === 0) {
        setSelectAll(false);
      }
    },
    [headerGroups, selectedCols, setSelectedColumns]
  );

  const handleSelectAll = useCallback(() => {
    if (selectedRows.length === rows.length) {
      setSelectedRows([]);
      setSelectedRecords([]);
      setSelectAll(false);
    } else {
      const allRowIds = rows.map((row) => row?.original?.id);
      setSelectedRows(allRowIds);
      setSelectedRecords(allRowIds);
      setSelectAll(true);
    }
  }, [rows, selectedRows.length, setSelectedRecords]);

  useEffect(() => {
    if (selectedRecord) {
      setSelectedRows(selectedRecord);
      if (data.length === selectedRecord.length) setSelectAll(true);
      else setSelectAll(false);
    }
  }, [selectedRecord, data]);

  useEffect(() => {
    if (typeof setAccessors !== 'function') return;
    const visibleColumns = getVisibleColumns(
      columns?.filter((item) => !('skipSearch' in item)),
      hiddenColumns.concat(['createdAt', 'updatedAt', 'lastLogin', 'Execution Started At', 'Execution Ended At'])
    );
    setAccessors(visibleColumns);
  }, [columns, hiddenColumns, setAccessors]);

  const runCleanup = useCallback(() => {
    if (typeof clearAllFilters === 'function') {
      clearAllFilters();
    }
    if (typeof setSort === 'function') {
      setSort(defaultSort || null);
    }
    if (typeof setSearchString === 'function') {
      setSearchString(undefined);
    }
  }, [clearAllFilters, defaultSort, setSearchString, setSort]);

  useEffect(() => {
    if (!cleanupTrigger) {
      return;
    }

    if (prevCleanupTrigger !== cleanupTrigger) {
      runCleanup();
    }
  }, [runCleanup, cleanupTrigger, prevCleanupTrigger]);

  const { user } = useAuth();

  return (
    <>
      <MainCard
        content={false}
        sx={{
          height: accessTableOnly ? '76vh' : !hidePagination || title === 'payload' ? '76vh' : isHistory ? '100%' : 'auto',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderTop: hideTopBorder ? 'none' : ''
        }}
      >
        {!hideHeader && (
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ padding: '10px 20px', flexDirection: { xs: 'column', sm: 'row' } }}
          >
            {showBackButton && (
              <Grid>
                <IconButton onClick={() => window.history.back()} color="primary">
                  <ArrowBackOutlinedIcon />
                </IconButton>
              </Grid>
            )}
            <Typography
              variant={subHeader ? 'h5' : 'h4'}
              sx={{
                position: showBackButton ? 'absolute' : 'relative',
                left: showBackButton ? 45 : 0,
                fontWeight: subHeader ? 400 : 500
              }}
            >
              {hideTitle ? '' : title}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                sx={{ flexDirection: { xs: 'column', sm: 'row' }, rowGap: { xs: '10px', sm: '0' } }}
              >
                {!hideType && setListType && (
                  <Select
                    displayEmpty
                    value={listType}
                    defaultValue={1}
                    onChange={(e) => setListType(e.target.value)}
                    sx={{ height: '35px', width: 100 }}
                  >
                    <MenuItem value={1}>Active</MenuItem>
                    <MenuItem value={0}>Inactive</MenuItem>
                    {source === '/form-responses' && <MenuItem value={3}>Duplicate</MenuItem>}
                  </Select>
                )}
                {!hideLockType && setLockType && (
                  <Select
                    displayEmpty
                    value={lockType}
                    defaultValue={1}
                    onChange={(e) => setLockType(e.target.value)}
                    sx={{ height: '35px', width: 100 }}
                  >
                    <MenuItem value={1}>Unlocked</MenuItem>
                    <MenuItem value={0}>Locked</MenuItem>
                  </Select>
                )}
                {!hideSearch && (
                  <GlobalFilter
                    count={count}
                    searchOnClick={searchOnClick}
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    isApiSearch={isApiSearch}
                    globalFilter={isApiSearch ? searchString : globalFilter}
                    setGlobalFilter={(value) => {
                      if (isApiSearch) {
                        setSearchString(value);
                      } else {
                        setGlobalFilter(value);
                      }
                    }}
                  />
                )}
                {!hideColumnsSelect && (
                  <HidingSelect hiddenColumns={hiddenColumns} setHiddenColumns={setHiddenColumns} allColumns={allColumns} />
                )}
                {/* update feature only in form responses */}
                {isFcMode &&
                  importConfig &&
                  (!user?.role || user?.role?.id === 'a89c1591-ed87-40e5-b89b-e409d647e3e5' || user?.role?.isUpdate) &&
                  !hideUpdateButton && <APIUpdate importConfig={importConfig} formAttributesArray={formAttributesArray} />}
                {/* import feature*/}
                {(!user?.role || user?.role?.id === 'a89c1591-ed87-40e5-b89b-e409d647e3e5' || user?.role?.isImport) &&
                  !hideImportButton && (
                    <>
                      {importConfig ? (
                        <>
                          {importQA ? (
                            <APIImport
                              importConfig={importConfig}
                              tableName={'QA-Master-Maker-LOV'}
                              importCompeted={importCompeted}
                              forQA={true}
                            />
                          ) : importDep ? (
                            <APIImport
                              importConfig={importConfig}
                              tableName={'Daily-Execution-Plan'}
                              importCompeted={importCompeted}
                              forDep={true}
                            />
                          ) : (
                            <APIImport importConfig={importConfig} isMasterForm={isMasterForm} isResponse={isFcMode} />
                          )}
                        </>
                      ) : exportConfig?.tableName ? (
                        <APIImport tableName={exportConfig.tableName} />
                      ) : null}
                    </>
                  )}
                {/* export feature*/}
                {(!user?.role || user?.role?.id === 'a89c1591-ed87-40e5-b89b-e409d647e3e5' || user?.role?.isExport) &&
                  !hideExportButton && (
                    <>
                      {shouldExportUsingApi ? (
                        <APIExport
                          disabled={!rows?.length}
                          searchStringTrimmed={searchStringTrimmed}
                          sort={sort}
                          isFcMode={isFcMode}
                          columns={source === '/form-responses' ? oldColumns : columns}
                          hiddenColumns={hiddenColumns}
                          exportConfig={exportConfig}
                          defaultSort={defaultSort}
                          fileNameForExport={fileNameForExport}
                        />
                      ) : (
                        <>
                          {exportPDFOnly ? (
                            <PDFExport disabled={!rows?.length} onClick={exportToPdf} />
                          ) : (
                            <CSVExport
                              disabled={!rows?.length}
                              data={
                                source === '/form-responses'
                                  ? tableExportData.getData(
                                      rows.map((d) => d.original),
                                      oldColumns
                                    )
                                  : tableExportData.getData(
                                      allData && allData.length > 0 ? allData : rows.map((d) => d.original),
                                      columns,
                                      devolutionExport
                                    )
                              }
                              filename={fileNameForExport}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                {!hideAddButton && (
                  <Tooltip title="Add">
                    <PlusOutlined
                      onClick={() => {
                        runCleanup();
                        onClick();
                      }}
                      style={{ fontSize: '25px', color: 'grey', padding: '5px' }}
                    />
                  </Tooltip>
                )}
              </Stack>
            </Stack>
          </Stack>
        )}
        <ScrollX sx={{ height: rows.length ? (!hideHeader ? '88%' : '100%') : 'auto', ...(loadingCondition && { overflow: 'hidden' }) }}>
          <TableWrapper>
            <Table stickyHeader {...getTableProps()}>
              <TableHead sx={{ borderTopWidth: 2 }}>
                <TableRow {...headerGroups[0]?.getHeaderGroupProps()}>
                  {showCheckbox && setSelectedRecords && (
                    <TableCell sx={{ position: 'sticky !important', width: 50 }}>
                      <Checkbox
                        checked={selectAll}
                        onChange={handleSelectAll}
                        indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                      />
                    </TableCell>
                  )}
                  {!hideActions && (
                    <TableCell
                      sx={{
                        position: 'sticky !important',
                        minWidth: fcAction ? 120 : miniAction ? 75 : 250,
                        width: fcAction ? 120 : miniAction ? 75 : 250,
                        pt: 2,
                        pb: 2
                      }}
                    >
                      {miniAction ? '' : 'Actions'}
                      {!isHistory && (isCurrentlyFiltering || isCurrentlySorting) && (
                        <ResetFilterButton clearAllFilters={clearAllFilters} setSort={setSort} defaultSort={defaultSort} />
                      )}
                    </TableCell>
                  )}
                  {headerGroups?.[0]?.headers.map((column, index) => (
                    <TableCell
                      key={column.id}
                      {...column.getHeaderProps([{ className: column.className }])}
                      sx={
                        column.className === 'userIcon'
                          ? {}
                          : {
                              position: 'sticky !important',
                              minWidth: showColumnsCheckbox ? 260 : column.render('minWidth') || 180,
                              width: showColumnsCheckbox ? 260 : column.render('minWidth') || 180,
                              pt: 2,
                              pb: 2,
                              pl: showColumnsCheckbox ? 0 : undefined
                            }
                      }
                    >
                      {showColumnsCheckbox ? (
                        <TableRow sx={{ ml: -2 }}>
                          <TableCell sx={{ position: 'sticky !important', width: 10 }}>
                            <Checkbox checked={selectedCols.includes(column?.id)} onChange={() => handleColumnSelect(column)} />
                          </TableCell>
                          <TableCell sx={{ position: 'sticky !important', width: 180 }} />
                        </TableRow>
                      ) : null}
                      <Stack direction="row" spacing={1} alignItems="center">
                        <UnifiedHeaderSort
                          column={column}
                          columns={columns}
                          isFcMode={isFcMode}
                          defaultSort={defaultSort}
                          listType={listType}
                          isHistory={isHistory}
                          sort={sort}
                          setSort={setSort}
                          enableOfflineSort={enableOfflineSort}
                        />
                        {!isHistory && hideActions && index === 0 && (isCurrentlyFiltering || isCurrentlySorting) && (
                          <ResetFilterButton clearAllFilters={clearAllFilters} setSort={setSort} defaultSort={defaultSort} />
                        )}
                      </Stack>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody {...getTableBodyProps()}>
                {loadingCondition ? (
                  <TableSkeleton columns={columns} hideActions={hideActions} />
                ) : (
                  <>
                    {rows.length > 0 ? (
                      rows.map((row, index) => {
                        prepareRow(row);
                        return (
                          <TableRow key={row?.original?.id} {...row.getRowProps()}>
                            {showCheckbox && setSelectedRecords && (
                              <TableCell>
                                <Checkbox
                                  checked={selectedRows.includes(row?.original?.id)}
                                  onChange={() => handleRowSelect(row?.original)}
                                />
                              </TableCell>
                            )}
                            {!hideActions && (
                              <TableCell>
                                {!hideViewIcon &&
                                  (selectIcon ? (
                                    <Button
                                      onClick={() => handleRowView(row?.original, index)}
                                      size="small"
                                      variant="outlined"
                                      color="primary"
                                    >
                                      Select
                                    </Button>
                                  ) : (
                                    <Tooltip title="View" placement="bottom">
                                      <IconButton
                                        color="secondary"
                                        onClick={() => handleRowView(row?.original, index)}
                                        disabled={
                                          (componentFrom === 'gaa-level-entry' || componentFrom === 'network-level-entry') &&
                                          row?.values?.approvalStatus
                                            ? user?.id !== '577b8900-b333-42d0-b7fb-347abc3f0b5c' &&
                                              user?.id !== '57436bed-c176-4625-96af-aaeec88cdc90' &&
                                              row.values.approvalStatus === 'Approved'
                                            : false
                                        }
                                      >
                                        <VisibilityOutlinedIcon />
                                      </IconButton>
                                    </Tooltip>
                                  ))}
                                {!hideEditIcon && listType ? (
                                  <Tooltip title="Edit" placement="bottom">
                                    <IconButton
                                      color="secondary"
                                      onClick={() =>
                                        LoggedInUserhierarchyType && LoggedInUserhierarchyType === 'network'
                                          ? row?.original?.hierarchyType === LoggedInUserhierarchyType
                                            ? handleRowUpdate(row?.original)
                                            : toast(`You can't give access to Upper Level hierarchy as you don't have access to it.`, {
                                                variant: 'error'
                                              })
                                          : handleRowUpdate(row?.original)
                                      }
                                      disabled={
                                        (componentFrom === 'gaa-level-entry' || componentFrom === 'network-level-entry') &&
                                        row?.values?.approvalStatus
                                          ? user?.id !== '577b8900-b333-42d0-b7fb-347abc3f0b5c' &&
                                            user?.id !== '57436bed-c176-4625-96af-aaeec88cdc90' &&
                                            row.values.approvalStatus === 'Approved'
                                          : false
                                      }
                                    >
                                      <EditOutlinedIcon />
                                    </IconButton>
                                  </Tooltip>
                                ) : (
                                  <></>
                                )}
                                {showLockIcon ? (
                                  lockType ? (
                                    <Tooltip title="Lock" placement="bottom">
                                      <IconButton color="secondary" onClick={() => handleLockToggle(row?.original)}>
                                        <LockOutlineIcon />
                                      </IconButton>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip title="Unlock" placement="bottom">
                                      <IconButton color="secondary" onClick={() => handleLockToggle(row?.original)}>
                                        <LockOpenOutlineIcon />
                                      </IconButton>
                                    </Tooltip>
                                  )
                                ) : (
                                  <></>
                                )}
                                {!hideDeleteIcon && listType && !(listType === 3) ? (
                                  <Tooltip title="Delete" placement="bottom">
                                    <IconButton
                                      color="secondary"
                                      disabled={
                                        disableDeleteIcon
                                          ? disableDeleteIcon
                                          : row?.original?.properties?.verifyAttribute || row?.original?.properties?.approval
                                      }
                                      onClick={() => handleRowDelete(row?.original?.id || row?.original?.name || row?.original)}
                                    >
                                      <DeleteOutlineIcon />
                                    </IconButton>
                                  </Tooltip>
                                ) : !hideRestoreIcon && !(listType === 3) ? (
                                  <Tooltip title="Restore" placement="bottom">
                                    <IconButton color="secondary" onClick={() => handleRowRestore(row?.original)}>
                                      <RestoreIcon />
                                    </IconButton>
                                  </Tooltip>
                                ) : (
                                  <></>
                                )}
                                {!hideHistoryIcon && (
                                  <Tooltip title="History" placement="bottom">
                                    <IconButton color="secondary" onClick={() => handleRowHistory(row?.original)}>
                                      <InfoOutlinedIcon />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </TableCell>
                            )}
                            {row.cells.map((cell) => (
                              <TableCell key={row?.original?.id} {...cell.getCellProps([{ className: cell.column.className }])}>
                                {forColumnAccess
                                  ? cell.render('Cell')
                                  : cell.column.Header.includes('.') && !cell.value && cell?.row?.original?.[cell?.column?.Header]
                                  ? cell.row.original[cell.column.Header]
                                  : cell.value == null || cell.value === ''
                                  ? '-'
                                  : [
                                      'Updated On',
                                      'Created On',
                                      'Submitted On',
                                      'Last Login',
                                      'Execution Started At',
                                      'Execution Ended At'
                                    ].includes(cell.column.Header)
                                  ? normalDate
                                    ? cell.render('Cell')
                                    : formatTimeStamp(cell.value)
                                  : cell.column.Header == 'Operator'
                                  ? formatOperator(cell.value)
                                  : cell.column.Header.includes('Date')
                                  ? normalDate
                                    ? cell.render('Cell')
                                    : formatDate(cell.value)
                                  : cell.render('Cell')}
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })
                    ) : hideEmptyTable ? (
                      <></>
                    ) : (
                      <EmptyTable msg="No Data" colSpan={7} />
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </TableWrapper>
        </ScrollX>
      </MainCard>
      {!hidePagination && (count > 0 || customCount) && (
        <MainCard sx={{ width: '100%' }}>
          <TablePagination
            countLoader={countLoader}
            customCount={customCount}
            count={count}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            pageSize={pageSize}
            disabled={loadingCondition}
          />
        </MainCard>
      )}
    </>
  );
}

ReactTable.defaultProps = {
  hideActions: false,
  miniAction: false,
  fcAction: false,
  hideTopBorder: false,
  normalDate: false,
  hideAddButton: false,
  hidePagination: false,
  hideImportButton: true,
  hideUpdateButton: true,
  hideExportButton: false,
  hideSearch: false,
  hideColumnsSelect: false,
  hideType: false,
  hideHeader: false,
  disableDeleteIcon: false,
  showCheckbox: false,
  showColumnsCheckbox: false,
  accessTableOnly: false,
  showBackButton: false,
  subHeader: false,
  hideViewIcon: false,
  hideEditIcon: false,
  isMasterForm: false,
  searchOnClick: false,
  hideRestoreIcon: false,
  hideDeleteIcon: false,
  showLockIcon: false,
  selectIcon: false,
  hideHistoryIcon: false,
  hideEmptyTable: false,
  exportPDFOnly: false,
  devolutionExport: false,
  forColumnAccess: false,
  enableOfflineSort: false,
  isFcMode: false,
  loadingCondition: false,
  listType: 1,
  customCount: false,
  allData: []
};

ReactTable.propTypes = {
  setPageSize: PropTypes.func,
  setPageIndex: PropTypes.func,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  title: PropTypes.string,
  columns: PropTypes.array,
  data: PropTypes.array,
  oldColumns: PropTypes.array,
  count: PropTypes.number,
  onClick: PropTypes.func,
  isMasterForm: PropTypes.bool,
  handleRowDelete: PropTypes.func,
  handleRowRestore: PropTypes.func,
  handleRowUpdate: PropTypes.func,
  handleRowHistory: PropTypes.func,
  handleRowView: PropTypes.func,
  handleLockToggle: PropTypes.func,
  hidePagination: PropTypes.bool,
  hideTopBorder: PropTypes.bool,
  hideActions: PropTypes.bool,
  miniAction: PropTypes.bool,
  fcAction: PropTypes.bool,
  formAttributesArray: PropTypes.array,
  isFcMode: PropTypes.bool,
  isHistory: PropTypes.bool,
  hideAddButton: PropTypes.bool,
  hideExportButton: PropTypes.bool,
  hideSearch: PropTypes.bool,
  hideColumnsSelect: PropTypes.bool,
  disableDeleteIcon: PropTypes.bool,
  searchConfig: PropTypes.object,
  sortConfig: PropTypes.shape({
    sort: PropTypes.array,
    setSort: PropTypes.func,
    defaultSort: PropTypes.array
  }),
  exportConfig: PropTypes.shape({
    apiRoute: PropTypes.string,
    tableName: PropTypes.string,
    fileName: PropTypes.string,
    apiQuery: PropTypes.object,
    apiBody: PropTypes.object,
    apiParams: PropTypes.string
  }),
  importConfig: PropTypes.shape({
    apiBody: PropTypes.object
  }),
  importDep: PropTypes.bool,
  importQA: PropTypes.bool,
  hideTitle: PropTypes.bool,
  importCompeted: PropTypes.func,
  hideType: PropTypes.bool,
  hideLockType: PropTypes.bool,
  listType: PropTypes.number,
  setListType: PropTypes.func,
  lockType: PropTypes.number,
  setLockType: PropTypes.func,
  hideHeader: PropTypes.bool,
  accessTableOnly: PropTypes.bool,
  hideViewIcon: PropTypes.bool,
  hideEditIcon: PropTypes.bool,
  hideRestoreIcon: PropTypes.bool,
  hideDeleteIcon: PropTypes.bool,
  showLockIcon: PropTypes.bool,
  selectIcon: PropTypes.bool,
  normalDate: PropTypes.bool,
  hideHistoryIcon: PropTypes.bool,
  hideImportButton: PropTypes.bool,
  hideUpdateButton: PropTypes.bool,
  showCheckbox: PropTypes.bool,
  showColumnsCheckbox: PropTypes.bool,
  source: PropTypes.string,
  showBackButton: PropTypes.bool,
  selectedRecord: PropTypes.array,
  subHeader: PropTypes.bool,
  setSelectedRecords: PropTypes.func,
  setSelectedColumns: PropTypes.func,
  hideEmptyTable: PropTypes.bool,
  exportPDFOnly: PropTypes.bool,
  exportToPdf: PropTypes.func,
  devolutionExport: PropTypes.bool,
  enableOfflineSort: PropTypes.bool,
  searchOnClick: PropTypes.bool,
  forColumnAccess: PropTypes.bool,
  loadingCondition: PropTypes.bool,
  cleanupTrigger: PropTypes.any,
  allData: PropTypes.any,
  LoggedInUserhierarchyType: PropTypes.string,
  customCount: PropTypes.bool,
  countLoader: PropTypes.bool,
  componentFrom: PropTypes.string
};

const TableForm = memo(ReactTable);

export default TableForm;
// gaaNetworkAreaAllocationData?.some((item) => item.hierarchyType !== userLoggedInGaaNetworkData?.hierarchyType;
