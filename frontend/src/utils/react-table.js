import PropTypes from 'prop-types';
import React, { memo, useCallback, useEffect, useRef } from 'react';

import { useMemo, useState } from 'react';

import FilterListIcon from '@mui/icons-material/FilterList';

// material-ui
import {
  Button,
  Checkbox,
  Chip,
  FormControl,
  Input,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Slider,
  Stack,
  TextField,
  Tooltip,
  styled
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

// third-party
import { useAsyncDebounce } from 'react-table';
import { matchSorter } from 'match-sorter';
import { FixedSizeList as List } from 'react-window';

import AutoSizer from 'react-virtualized-auto-sizer';

// assets
import { CloseOutlined, FilterTwoTone, LineOutlined, SearchOutlined } from '@ant-design/icons';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';

// utils
import { Box, useTheme } from '@mui/system';
import { ArrowDropDownRounded, ArrowDropUpRounded, ClearRounded } from '@mui/icons-material';
import request from './request';

// project import
import IconButton from 'components/@extended/IconButton';
import { useFilterContext } from 'contexts/FilterContext';

export function GlobalFilter({ searchOnClick, isApiSearch, count, preGlobalFilteredRows, globalFilter, setGlobalFilter, ...other }) {
  const rowCount = count ? count : preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((val) => {
    setGlobalFilter(val || undefined);
  }, 700);

  const valueRef = useRef(value);

  useEffect(() => {
    if (isApiSearch) {
      valueRef.current = value;
    }
  }, [isApiSearch, value]);

  useEffect(() => {
    if (isApiSearch && globalFilter !== valueRef.current) {
      // globalFilter is changed from outside
      setValue(globalFilter);
    }
  }, [globalFilter, isApiSearch]);

  return (
    <OutlinedInput
      value={value || ''}
      sx={{ height: '35px', width: 170 }}
      autoComplete="off"
      onChange={(e) => {
        setValue(e?.target?.value);
        if (!searchOnClick) {
          onChange(e?.target?.value);
        }
      }}
      onKeyDown={(e) => {
        if (searchOnClick && e.key === 'Enter') {
          onChange(value);
        }
      }}
      placeholder={isApiSearch ? 'Search...' : `Search ${rowCount} records...`}
      id="start-adornment-email"
      startAdornment={
        <SearchOutlined
          onClick={() => {
            if (searchOnClick) {
              onChange(value);
            }
          }}
          style={{ ...(searchOnClick ? { cursor: 'pointer' } : { cursor: 'auto' }) }}
        />
      }
      {...other}
    />
  );
}

GlobalFilter.propTypes = {
  searchOnClick: PropTypes.bool,
  count: PropTypes.number,
  isApiSearch: PropTypes.bool,
  preGlobalFilteredRows: PropTypes.array,
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func
};

export function DateColumnFilter({ column: { filterValue, Header, setFilter } }) {
  return (
    <FormControl sx={{ width: '100%' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          inputFormat="dd/MM/yyyy"
          value={filterValue || null}
          onChange={() => {
            let formatDateFn = undefined;
            try {
              //formatDateFn = format(newValue, 'M/d/yyyy');
            } catch (error) {
              formatDateFn = undefined;
            }
            setFilter(formatDateFn || undefined);
          }}
          renderInput={(params) => <TextField name={Header} {...params} placeholder={`Select ${Header}`} />}
        />
      </LocalizationProvider>
    </FormControl>
  );
}

DateColumnFilter.propTypes = {
  column: PropTypes.object
};

export function DefaultColumnFilter({ column: { filterValue, Header, setFilter } }) {
  return (
    <TextField
      fullWidth
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e?.target?.value || undefined);
      }}
      placeholder={Header}
      size="small"
    />
  );
}

DefaultColumnFilter.propTypes = {
  column: PropTypes.object
};

export function SelectColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
  const options = useMemo(() => {
    const opt = new Set();
    preFilteredRows.forEach((row) => {
      opt.add(row.values[id]);
    });
    return [...opt.values()];
  }, [id, preFilteredRows]);

  return (
    <Select
      value={filterValue}
      onChange={(e) => {
        setFilter(e?.target?.value || undefined);
      }}
      displayEmpty
      size="small"
    >
      <MenuItem value="">All</MenuItem>
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
}

SelectColumnFilter.propTypes = {
  column: PropTypes.object
};

export function SliderColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
  const [min, max] = useMemo(() => {
    let minn = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let maxx = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      minn = Math.min(row.values[id], minn);
      maxx = Math.max(row.values[id], maxx);
    });
    return [minn, maxx];
  }, [id, preFilteredRows]);

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 1, minWidth: 120 }}>
      <Slider
        value={filterValue || min}
        min={min}
        max={max}
        step={1}
        onChange={(event, newValue) => {
          setFilter(newValue);
        }}
        valueLabelDisplay="auto"
        aria-labelledby="non-linear-slider"
      />
      <Tooltip title="Reset">
        <IconButton size="small" color="error" onClick={() => setFilter(undefined)}>
          <CloseOutlined />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

SliderColumnFilter.propTypes = {
  column: PropTypes.object
};

export function NumberRangeColumnFilter({ column: { filterValue = [], preFilteredRows, setFilter, id } }) {
  const [min, max] = useMemo(() => {
    let minn = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let maxx = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      minn = Math.min(row.values[id], minn);
      maxx = Math.max(row.values[id], maxx);
    });
    return [minn, maxx];
  }, [id, preFilteredRows]);

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 168, maxWidth: 250 }}>
      <TextField
        fullWidth
        value={filterValue[0] || ''}
        type="number"
        onChange={(e) => {
          const val = e?.target?.value;
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]]);
        }}
        placeholder={`Min (${min})`}
        size="small"
      />
      <LineOutlined />
      <TextField
        fullWidth
        value={filterValue[1] || ''}
        type="number"
        onChange={(e) => {
          const val = e?.target?.value;
          setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined]);
        }}
        placeholder={`Max (${max})`}
        size="small"
      />
    </Stack>
  );
}

NumberRangeColumnFilter.propTypes = {
  column: PropTypes.object
};

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

fuzzyTextFilterFn.autoRemove = (val) => !val;

export const renderFilterTypes = () => ({
  fuzzyText: fuzzyTextFilterFn,
  text: (rows, id, filterValue) => {
    rows.filter((row) => {
      const rowValue = row.values[id];
      return rowValue !== undefined ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase()) : true;
    });
  }
});

// @ts-ignore
export function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

filterGreaterThan.autoRemove = (val) => typeof val !== 'number';

export function useControlledState(state) {
  return useMemo(() => {
    if (state.groupBy.length) {
      return {
        ...state,
        hiddenColumns: [...state.hiddenColumns, ...state.groupBy].filter((d, i, all) => all.indexOf(d) === i)
      };
    }
    return state;
  }, [state]);
}

export function roundedMedian(leafValues) {
  let min = leafValues[0] || 0;
  let max = leafValues[0] || 0;

  leafValues.forEach((value) => {
    min = Math.min(min, value);
    max = Math.max(max, value);
  });

  return Math.round((min + max) / 2);
}

const StickyMenuItem = styled(MenuItem)(({ theme }) => ({
  top: 0,
  position: 'sticky',
  backgroundColor: theme.palette.background.paper,
  opacity: 1,
  zIndex: 10,
  width: 400,
  gap: 5,
  paddingLeft: '8px',
  paddingRight: '8px',
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
    opacity: 1
  },
  '&:focus': {
    opacity: 1,
    backgroundColor: theme.palette.background.paper
  }
}));

const StyledMenu = styled(Select)({
  '& .MuiMenu-paper': {
    maxHeight: 180
  },
  opacity: 0,
  position: 'absolute',
  pointerEvents: 'none',
  height: 0
});

const APISort = ({ shouldUseApiSort, handleChangeSort, column, sort, currentAccessor, theme }) => {
  const isSortedAscending = sort?.[2] === currentAccessor && !!sort?.[0] && sort?.[1] !== 'DESC';
  const isSortedDescending = sort?.[2] === currentAccessor && sort?.[1] === 'DESC';
  const isNotSorted = !isSortedAscending && !isSortedDescending;

  return (
    <>
      <Button
        fullWidth
        variant={isSortedAscending ? 'contained' : 'outlined'}
        onClick={() => handleChangeSort(column.Header, 'ASC')}
        {...(!isSortedAscending && { color: 'primary' })}
        sx={{
          color: isSortedAscending ? '#FFF' : theme.palette.primary.main,
          borderColor: isSortedAscending ? theme.palette.primary.main : theme.palette.primary.main,
          background: isSortedAscending ? theme.palette.primary.main : 'transparent',
          ...(isSortedAscending && {
            '&:hover': {
              background: theme.palette.primary.main
            }
          })
        }}
        disabled={!shouldUseApiSort || isSortedAscending}
      >
        <ArrowDropUpRounded color={isSortedAscending ? theme.palette.common.white : theme.palette.grey[400]} /> Ascending
      </Button>

      <Button
        fullWidth
        variant={isSortedDescending ? 'contained' : 'outlined'}
        onClick={() => handleChangeSort(column.Header, 'DESC')}
        {...(!isSortedDescending && { color: 'primary' })}
        sx={{
          color: isSortedDescending ? '#FFF' : theme.palette.primary.main,
          borderColor: isSortedDescending ? theme.palette.primary.main : theme.palette.primary.main,
          background: isSortedDescending ? theme.palette.primary.main : 'transparent',
          ...(isSortedDescending && {
            '&:hover': {
              background: theme.palette.primary.main
            }
          })
        }}
        disabled={!shouldUseApiSort || isSortedDescending}
      >
        <ArrowDropDownRounded color={isSortedDescending ? theme.palette.common.white : theme.palette.grey[400]} /> Descending
      </Button>

      <Button
        fullWidth
        variant={isNotSorted ? 'contained' : 'outlined'}
        onClick={() => handleChangeSort(column.Header, 'NONE')}
        {...(!isNotSorted && { color: 'secondary' })}
        sx={{
          color: isNotSorted ? '#FFF' : theme.palette.secondary.main,
          borderColor: isNotSorted ? theme.palette.secondary.main : theme.palette.secondary.main,
          background: isNotSorted ? theme.palette.secondary.main : 'transparent',
          ...(isNotSorted && {
            '&:hover': {
              background: theme.palette.secondary.main
            }
          })
        }}
        disabled={!shouldUseApiSort || isNotSorted}
      >
        <ClearRounded color={isNotSorted ? theme.palette.common.white : theme.palette.grey[400]} /> None
      </Button>
    </>
  );
};

APISort.propTypes = {
  shouldUseApiSort: PropTypes.bool,
  handleChangeSort: PropTypes.func,
  column: PropTypes.object,
  enableOfflineSort: PropTypes.bool,
  sort: PropTypes.array,
  currentAccessor: PropTypes.string,
  theme: PropTypes.object
};

const blankOption = [{ name: '(Blanks)', id: '(Blanks)' }];
export const MultiSelectDropdown = memo(
  ({
    // common
    column,

    // filter related props
    filterProps,

    // sort related props
    shouldUseApiSort,
    handleChangeSort,
    enableOfflineSort,
    sort,
    currentAccessor,

    // misc
    listType
  }) => {
    const { currentFilter: currentFilterFromContext, handleSetCurrentFilter } = useFilterContext();

    const {
      formId,
      apiRouteForFetchOptions,
      tableName,
      getColumn,
      customAccessor: columnOfDb,
      projectId,
      levelId,
      masterId,
      filterObjectForApi,
      method,
      gaaLevelFilter
    } = filterProps || {};

    const isFcMode = !!formId;
    const shouldUseBlankOption = isFcMode;
    const isCurrentColumnSorted = sort?.[2] === currentAccessor;

    const isFilteringImplemented = !!tableName;

    const { id: columnId, Header } = column;
    const columnIdPicker = columnOfDb || columnId;
    const currentFilter = useMemo(() => currentFilterFromContext?.[columnIdPicker] || [], [columnIdPicker, currentFilterFromContext]);
    const pageSize = 20;

    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [totalOptions, setTotalOptions] = useState(0);
    const [temporaryValues, setTemporaryValues] = useState([]);
    const [searchString, setSearchString] = useState('');

    const [pageNumber, setPageNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const theme = useTheme();
    const searchStringRef = useRef();

    const currentSelectedOptions = !open ? currentFilter : temporaryValues;

    const optionsWithBlankOption = useMemo(
      () => [...(shouldUseBlankOption ? blankOption : []), ...options],
      [shouldUseBlankOption, options]
    );

    const tooltipTitle = useMemo(
      () =>
        !open
          ? currentFilter.length
            ? `${currentFilter.length} filter${currentFilter.length > 1 ? 's' : ''} applied`
            : `Filter ${Header}`
          : '',
      [open, currentFilter.length, Header]
    );

    const fetchOptions = useCallback(
      async (pn, ps) => {
        if (!isFilteringImplemented) return [];

        const optionsResp = await request(apiRouteForFetchOptions || '/distinct-dropdowns-list', {
          method: method || 'GET',
          timeoutOverride: 3 * 60000,
          [method === 'post' ? 'body' : 'query']: {
            ...(isFcMode && { formId }),
            pageSize: ps,
            isActive: listType,
            pageIndex: pn,
            ...(searchString && { searchString }),
            ...(isFcMode ? { columnName: tableName } : { tableName }),
            ...(projectId && { projectId }),
            ...(levelId && { levelId }),
            ...(masterId && { masterId }),
            getColumn,
            filterObjectForApi,
            customAccessor: columnOfDb,
            gaaLevelFilter
          }
        });

        if (optionsResp?.data?.data) {
          setTotalOptions(optionsResp?.data?.data?.count ? parseInt(optionsResp.data.data.count) : 0);
          return optionsResp.data.data?.rows;
        } else {
          return [];
        }
      },
      [
        filterObjectForApi,
        method,
        isFilteringImplemented,
        apiRouteForFetchOptions,
        isFcMode,
        formId,
        listType,
        searchString,
        tableName,
        projectId,
        levelId,
        masterId,
        getColumn,
        columnOfDb,
        gaaLevelFilter
      ]
    );

    const handleOpen = useCallback(() => {
      setTemporaryValues(currentFilter);
      setOpen(true);
    }, [currentFilter]);

    const handleClose = useCallback(() => {
      setTemporaryValues([]);
      setSearchString('');
      setOpen(false);
    }, []);

    const handleFilter = useCallback(() => {
      handleSetCurrentFilter(temporaryValues, columnIdPicker);
      setOpen(false);
    }, [columnIdPicker, handleSetCurrentFilter, temporaryValues]);

    const handleSetTemporaryValues = useCallback(
      (opt) => {
        const exists = temporaryValues.some((value) => value.name === opt.name);

        if (exists) {
          setTemporaryValues((prev) => prev.filter((option) => option.name !== opt.name));
        } else {
          setTemporaryValues((prev) => prev.concat(opt));
        }
      },
      [temporaryValues]
    );

    const clearFilter = useCallback(() => {
      handleSetCurrentFilter([], columnIdPicker);
      setTemporaryValues([]);
    }, [columnIdPicker, handleSetCurrentFilter]);

    const loadData = useCallback(
      async (pageNum, size, newItemsOnly = false) => {
        setIsLoading(true);
        const response = await fetchOptions(pageNum, size);
        const newItems = response.map((item) => ({
          ...item,
          id: item.name
        }));
        setOptions((prevItems) => (newItemsOnly ? newItems : [...prevItems, ...newItems]));
        setIsLoading(false);
      },
      [fetchOptions]
    );

    const handleItemsRendered = useCallback(
      ({ visibleStopIndex }) => {
        if (searchStringRef.current !== searchString) {
          searchStringRef.current = searchString;
          return;
        }

        if (!isLoading && options.length < totalOptions && visibleStopIndex >= options.length - (shouldUseBlankOption ? 5 : 6)) {
          setPageNumber((prevPage) => prevPage + 1);
          loadData(pageNumber + 1, pageSize);
        }
      },
      [searchString, isLoading, options.length, totalOptions, shouldUseBlankOption, loadData, pageNumber]
    );

    const loadDataInit = useAsyncDebounce(() => {
      setPageNumber(1);
      setTotalOptions(0);
      loadData(1, pageSize, true);
    }, 700);

    useEffect(() => {
      if (open) {
        loadDataInit();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, searchString]);

    return (
      <FormControl>
        <Tooltip title={tooltipTitle}>
          <Box
            sx={{
              fontSize: '1rem',
              cursor: 'pointer'
            }}
            onClick={handleOpen}
          >
            <FilterTwoTone
              twoToneColor={isCurrentColumnSorted || currentFilter?.length ? theme.palette.error.main : theme.palette.primary.main}
            />
          </Box>
        </Tooltip>
        <StyledMenu
          multiple
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
          value={currentSelectedOptions}
          renderValue={() => ''}
          onKeyDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          input={<Input inputComponent="div" />}
        >
          <Box style={{ ...(isFilteringImplemented && { height: 450 }), display: 'flex', flexDirection: 'column' }}>
            {!column.disableSortBy && (shouldUseApiSort || enableOfflineSort) && (
              <StickyMenuItem
                onKeyDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <APISort
                  shouldUseApiSort={shouldUseApiSort}
                  handleChangeSort={handleChangeSort}
                  column={column}
                  sort={sort}
                  currentAccessor={currentAccessor}
                  theme={theme}
                />
              </StickyMenuItem>
            )}

            {isFilteringImplemented && (
              <>
                <Box
                  onKeyDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    top: 0,
                    position: 'sticky',
                    backgroundColor: theme.palette.background.paper,
                    zIndex: 9,
                    padding: '8px'
                  }}
                >
                  <Tooltip title={!isFilteringImplemented ? 'Filtering is unavilable for this column.' : ''}>
                    <OutlinedInput
                      fullWidth
                      value={searchString || ''}
                      onChange={(e) => setSearchString(e.target.value)}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Search..."
                      disabled={!isFilteringImplemented}
                      style={{
                        ...(!isFilteringImplemented && { background: '#f0f0f0' })
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <SearchIcon
                            style={{
                              fontSize: '18px',
                              color: theme.palette.secondary.dark,
                              cursor: 'auto'
                            }}
                          />
                        </InputAdornment>
                      }
                    />
                  </Tooltip>
                </Box>
                {currentSelectedOptions.length > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))',
                      gap: '8px',
                      padding: '8px',
                      position: 'sticky',
                      top: 60,
                      backgroundColor: theme.palette.background.paper,
                      zIndex: 8,
                      overflowX: 'auto',
                      maxHeight: 'calc(2 * 38px + 2 * 8px)'
                    }}
                  >
                    {currentSelectedOptions.map((option) => {
                      return (
                        <Chip
                          key={option.id}
                          label={option.name + (option.code ? `-${option.code}` : '')}
                          onDelete={() => {
                            handleSetTemporaryValues(option);
                          }}
                          variant="outlined"
                        />
                      );
                    })}
                  </Box>
                )}

                <StickyMenuItem
                  onKeyDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Button
                    fullWidth
                    disabled={!options?.length && !temporaryValues?.length}
                    variant="outlined"
                    color="primary"
                    onClick={handleFilter}
                    startIcon={<FilterListIcon />}
                  >
                    {!options?.length && !temporaryValues?.length ? 'No Options Available' : 'Apply Filter'}
                  </Button>
                  <Button
                    fullWidth
                    disabled={!currentSelectedOptions?.length}
                    color="secondary"
                    sx={{ color: theme.palette.secondary.main }}
                    variant="outlined"
                    onClick={clearFilter}
                    startIcon={<FilterAltOffOutlinedIcon />}
                  >
                    Clear Filter
                  </Button>
                </StickyMenuItem>

                <Box style={{ flex: 1, display: 'flex' }}>
                  <AutoSizer>
                    {({ height }) => (
                      <List
                        height={height}
                        itemCount={optionsWithBlankOption.length}
                        itemSize={46}
                        width={400}
                        onItemsRendered={handleItemsRendered}
                      >
                        {({ index, style }) => {
                          const option = optionsWithBlankOption[index];
                          return (
                            <MenuItem
                              key={option.id}
                              style={style}
                              sx={{ width: 400 }}
                              onKeyDown={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetTemporaryValues(option);
                              }}
                            >
                              <Checkbox checked={temporaryValues.some((val) => val.id === option.id)} />
                              <ListItemText primary={option.name + (option.code ? `-${option.code}` : '')} />
                            </MenuItem>
                          );
                        }}
                      </List>
                    )}
                  </AutoSizer>
                </Box>
              </>
            )}
          </Box>
        </StyledMenu>
      </FormControl>
    );
  }
);

MultiSelectDropdown.propTypes = {
  shouldUseApiSort: PropTypes.bool,
  handleChangeSort: PropTypes.func,
  enableOfflineSort: PropTypes.bool,
  sort: PropTypes.array,
  currentAccessor: PropTypes.string,
  column: PropTypes.object,
  listType: PropTypes.number,
  filterProps: PropTypes.object
};
