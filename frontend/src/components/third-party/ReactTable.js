import { PAGINATION_CONST } from 'constants';
import PropTypes from 'prop-types';
import React, { forwardRef, memo, useCallback, useEffect, useRef, useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';

// third-party
import { CSVLink } from 'react-csv';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDrop, useDrag, useDragLayer } from 'react-dnd';

// assets
import {
  CaretUpOutlined,
  CaretDownOutlined,
  CheckOutlined,
  DownloadOutlined,
  UploadOutlined,
  CloudUploadOutlined as CloudUploadOutlinedIcon,
  CloudDownloadOutlined as CloudDownloadOutlinedIcon
} from '@ant-design/icons';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { ExpandMoreOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import { LoadingIcon } from 'components/buttons/LoadingIcon';
import { getVisibleColumns } from 'utils';
import { MultiSelectDropdown } from 'utils/react-table';
import CircularLoader from 'components/CircularLoader';
import { FormProvider, RHFSelectTags } from 'hook-form';
// ==============================|| HEADER HEADER ||============================== //

export const HeaderSort = ({ column, sort }) => {
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {column.canFilter ? column.render('Filter') : null}
      <Box sx={{ width: 'max-content' }}>{column.render('Header')}</Box>
      {!column.disableSortBy && (
        <Stack sx={{ color: 'secondary.light' }} {...(sort && { ...column.getHeaderProps(column.getSortByToggleProps()) })}>
          <CaretUpOutlined
            style={{
              fontSize: '0.625rem',
              color: column.isSorted && !column.isSortedDesc ? theme.palette.text.secondary : 'inherit'
            }}
          />
          <CaretDownOutlined
            style={{
              fontSize: '0.625rem',
              marginTop: -2,
              color: column.isSortedDesc ? theme.palette.text.secondary : 'inherit'
            }}
          />
        </Stack>
      )}
    </Stack>
  );
};

HeaderSort.propTypes = {
  column: PropTypes.any,
  sort: PropTypes.bool
};

// ==============================|| TABLE PAGINATION ||============================== //

export const TablePagination = ({ count, setPageIndex, setPageSize, pageSize, pageIndex, disabled, customCount, countLoader }) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChangePagination = (event, value) => {
    setPageIndex(value);
  };

  const handleChangeGotoPage = (event) => {
    const enteredPage = event.target.value;
    if (enteredPage > maxPage || enteredPage < 1) {
      event.preventDefault(); // Prevents typing the number exceeding the maximum limit
    } else {
      setPageIndex(+event.target.value);
    }
  };
  const maxPage = Math.ceil(count / pageSize);
  const handleChangePageSize = (event) => {
    setPageSize(+event.target.value);
  };

  // Calculate start and end indices
  const startIndex = (pageIndex - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, count - 1);
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={5} lg={4}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6" color="secondary">
              Row per page
            </Typography>
            <FormControl>
              <Select
                id="demo-controlled-open-select"
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                value={pageSize}
                onChange={handleChangePageSize}
                size="small"
                sx={{ '& .MuiSelect-select': { py: 0.75, px: 1.25 } }}
                disabled={disabled}
              >
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={250}>250</MenuItem>
                <MenuItem value={500}>500</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="h6" color="secondary">
              Go to
            </Typography>
            <TextField
              size="small"
              type="number"
              inputProps={{ min: 1, max: maxPage }}
              value={pageIndex}
              onChange={handleChangeGotoPage}
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1.25, width: 36 } }}
              disabled={disabled}
            />
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={7} lg={8}>
        <Grid container spacing={1} sx={{ width: 'auto', float: 'right' }}>
          {customCount ? (
            <>
              <Grid item>
                <Typography variant="h6" color="secondary" mt={0.5}>
                  {countLoader ? 'Fetching counts ...' : `Total Records: ${count}`}
                </Typography>
              </Grid>
              <Grid
                item
                sx={{
                  '& .MuiPaginationItem-root': {
                    display: 'none'
                  },
                  '& .MuiPaginationItem-firstLast, .MuiPaginationItem-previousNext, .Mui-selected': {
                    display: 'flex'
                  }
                }}
              >
                <Pagination
                  count={maxPage}
                  page={pageIndex}
                  onChange={handleChangePagination}
                  color="primary"
                  variant="combined"
                  showFirstButton
                  showLastButton
                  disabled={disabled}
                  boundaryCount={0}
                  siblingCount={0}
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid item>
                <Typography variant="h6" color="secondary" mt={0.5}>
                  Showing {startIndex + 1}-{endIndex + 1} out of {count} records
                </Typography>
              </Grid>
              <Grid item>
                <Pagination
                  count={maxPage}
                  page={pageIndex}
                  onChange={handleChangePagination}
                  color="primary"
                  variant="combined"
                  showFirstButton
                  showLastButton
                  disabled={disabled}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

TablePagination.propTypes = {
  countLoader: PropTypes.bool,
  customCount: PropTypes.bool,
  disabled: PropTypes.bool,
  setPageSize: PropTypes.func,
  setPageIndex: PropTypes.func,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  count: PropTypes.number
};

// ==============================|| SELECTION - PREVIEW ||============================== //

export const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  return <Checkbox indeterminate={indeterminate} ref={resolvedRef} {...rest} />;
});

IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.bool
};

export const TableRowSelection = ({ selected }) => (
  <>
    {selected > 0 && (
      <Chip
        size="small"
        // @ts-ignore
        label={`${selected} row(s) selected`}
        color="secondary"
        variant="light"
        sx={{
          position: 'absolute',
          right: -1,
          top: -1,
          borderRadius: '0 4px 0 4px'
        }}
      />
    )}
  </>
);

TableRowSelection.propTypes = {
  selected: PropTypes.number
};

// ==============================|| DRAG & DROP - DRAGGABLE HEADR ||============================== //

export const DraggableHeader = ({ children, column, index, reorder }) => {
  const theme = useTheme();
  const ref = useRef();
  const { id, Header } = column;

  const DND_ITEM_TYPE = 'column';

  const [{ isOverCurrent }, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    drop: (item) => {
      reorder(item, index);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true })
    })
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: DND_ITEM_TYPE,
    item: () => ({
      id,
      index,
      header: Header
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  drag(drop(ref));

  let borderColor = theme.palette.text.primary;
  if (isOverCurrent) {
    borderColor = theme.palette.primary.main;
  }

  return (
    <Box sx={{ cursor: 'move', opacity: isDragging ? 0.5 : 1, color: borderColor }} ref={ref} {...isDragging}>
      {children}
    </Box>
  );
};

DraggableHeader.propTypes = {
  column: PropTypes.any,
  sort: PropTypes.bool,
  reorder: PropTypes.func,
  index: PropTypes.number,
  children: PropTypes.node
};

// ==============================|| DRAG & DROP - DRAG PREVIEW ||============================== //

const DragHeader = styled('div')(({ theme, x, y }) => ({
  color: theme.palette.text.secondary,
  position: 'fixed',
  pointerEvents: 'none',
  left: 12,
  top: 24,
  transform: `translate(${x}px, ${y}px)`,
  opacity: 0.6
}));

export const DragPreview = () => {
  const theme = useTheme();
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  const { x, y } = currentOffset || {};

  return isDragging ? (
    <DragHeader theme={theme} x={x} y={y}>
      {item.header && (
        <Stack direction="row" spacing={1} alignItems="center">
          <MenuOutlinedIcon style={{ fontSize: '1rem' }} />
          <Typography>{item.header}</Typography>
        </Stack>
      )}
    </DragHeader>
  ) : null;
};

// ==============================|| DRAG & DROP - DRAGGABLE ROW ||============================== //

export const DraggableRow = ({ index, moveRow, children }) => {
  const DND_ITEM_TYPE = 'row';

  const dropRef = useRef(null);
  const dragRef = useRef(null);

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover(item, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }

      // @ts-ignore
      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  // @ts-ignore
  const [{ isDragging }, drag, preview] = useDrag({
    type: DND_ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;

  preview(drop(dropRef));
  drag(dragRef);

  return (
    <TableRow ref={dropRef} style={{ opacity, backgroundColor: isDragging ? 'red' : 'inherit' }}>
      <TableCell ref={dragRef} sx={{ cursor: 'pointer', textAlign: 'left' }}>
        <MenuOutlinedIcon style={{ color: 'grey' }} />
      </TableCell>
      {children}
    </TableRow>
  );
};

DraggableRow.propTypes = {
  moveRow: PropTypes.func,
  index: PropTypes.number,
  children: PropTypes.node
};

// ==============================|| COLUMN HIDING - SELECT ||============================== //

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200
    }
  }
};

export const HidingSelect = ({ hiddenColumns, setHiddenColumns, allColumns }) => {
  const handleChange = (event) => {
    const {
      target: { value }
    } = event;

    if ((typeof value === 'string' ? value.split(',') : value).length === allColumns.length) {
      toast('Cannot deselect all columns', { variant: 'warning' });
      return;
    }

    setHiddenColumns(typeof value === 'string' ? value.split(',') : value);
  };

  const theme = useTheme();
  let visible = allColumns.filter((c) => !hiddenColumns.includes(c.id)).length;

  return (
    <FormControl sx={{ width: 170 }}>
      <Select
        id="column-hiding"
        multiple
        displayEmpty
        value={hiddenColumns}
        onChange={handleChange}
        input={<OutlinedInput id="select-column-hiding" placeholder="select column" />}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <Typography>All column visible</Typography>;
          }

          if (selected.length > 0 && selected.length === allColumns.length) {
            return <Typography>No column visible</Typography>;
          }

          return <Typography>{visible} column visible</Typography>;
        }}
        sx={{ height: '35px' }}
        MenuProps={MenuProps}
      >
        {allColumns.map((column) => {
          let ToggleChecked = column.id === '#' ? true : hiddenColumns.indexOf(column.id) > -1 ? false : true;
          return (
            <MenuItem
              key={column.id}
              value={column.id}
              sx={{
                height: '35px',
                '&.Mui-selected ': { bgcolor: 'background.paper' },
                '&.Mui-selected:hover ': { bgcolor: 'background.paper' }
              }}
            >
              <Checkbox
                checked={ToggleChecked}
                color="primary"
                checkedIcon={
                  <Box
                    className="icon"
                    sx={{
                      width: 13,
                      height: 13,
                      border: '1px solid',
                      borderColor: 'inherit',
                      borderRadius: 0.25,
                      position: 'relative',
                      backgroundColor: theme.palette.primary.main
                    }}
                  >
                    <CheckOutlined className="filled" style={{ position: 'absolute', color: theme.palette.common.white }} />
                  </Box>
                }
              />
              <ListItemText primary={typeof column.Header === 'string' ? column.Header : column?.title} />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

HidingSelect.propTypes = {
  setHiddenColumns: PropTypes.func,
  hiddenColumns: PropTypes.array,
  allColumns: PropTypes.array
};

// ==============================|| COLUMN SORTING - SELECT ||============================== //

export const SortingSelect = ({ sortBy, setSortBy, allColumns }) => {
  const [sort, setSort] = useState(sortBy);

  const handleChange = (event) => {
    const {
      target: { value }
    } = event;
    setSort(value);
    setSortBy([{ id: value, desc: false }]);
  };

  return (
    <FormControl sx={{ width: 200 }}>
      <Select
        id="column-hiding"
        displayEmpty
        value={sort}
        onChange={handleChange}
        input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
        renderValue={(selected) => {
          // eslint-disable-next-line prefer-destructuring
          const selectedColumn = allColumns.filter((column) => column.id === selected)[0];
          if (!selected) {
            return <Typography variant="subtitle1">Sort By</Typography>;
          }

          return (
            <Typography variant="subtitle2">
              Sort by ({typeof selectedColumn.Header === 'string' ? selectedColumn.Header : selectedColumn?.title})
            </Typography>
          );
        }}
        size="small"
      >
        {allColumns
          .filter((column) => column.canSort)
          .map((column) => (
            <MenuItem key={column.id} value={column.id}>
              <ListItemText primary={typeof column.Header === 'string' ? column.Header : column?.title} />
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

SortingSelect.propTypes = {
  setSortBy: PropTypes.func,
  sortBy: PropTypes.string,
  allColumns: PropTypes.array
};

// ==============================|| CSV EXPORT ||============================== //

export const CSVExport = ({ data, filename, headers, disabled, forRejected = false }) => {
  const icon = (
    <DownloadOutlined
      style={{
        fontSize: '21px',
        color: disabled ? 'rgb(210, 210, 210)' : forRejected ? 'white' : 'grey',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: '5px'
      }}
    />
  );

  return disabled ? (
    <Tooltip title={'No data available to export'}>{icon}</Tooltip>
  ) : (
    <CSVLink data={data} filename={filename} headers={headers}>
      <Tooltip title={'CSV Export'}>{icon}</Tooltip>
    </CSVLink>
  );
};

CSVExport.propTypes = {
  data: PropTypes.array,
  disabled: PropTypes.bool,
  headers: PropTypes.any,
  filename: PropTypes.string,
  forRejected: PropTypes.bool
};
// ==============================|| EMPTY TABLE - NO DATA  ||============================== //

const StyledGridOverlay = styled(Stack)(({ theme }) => ({
  height: '400px',
  '& .ant-empty-img-1': {
    fill: theme.palette.mode === 'light' ? theme.palette.secondary[400] : theme.palette.secondary[200]
  },
  '& .ant-empty-img-2': {
    fill: theme.palette.mode === 'light' ? theme.palette.secondary.light : theme.palette.secondary.light
  },
  '& .ant-empty-img-3': {
    fill: theme.palette.mode === 'light' ? theme.palette.secondary[200] : theme.palette.secondary.A200
  },
  '& .ant-empty-img-4': {
    fill: theme.palette.mode === 'light' ? theme.palette.secondary.A100 : theme.palette.secondary.A300
  },
  '& .ant-empty-img-5': {
    fillOpacity: theme.palette.mode === 'light' ? '0.95' : '0.09',
    fill: theme.palette.mode === 'light' ? theme.palette.secondary.light : theme.palette.secondary.darker
  }
}));

export const EmptyTable = ({ msg, colSpan }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <StyledGridOverlay alignItems="center" justifyContent="center" spacing={1}>
          <svg width="120" height="100" viewBox="0 0 184 152" aria-hidden focusable="false">
            <g fill="none" fillRule="evenodd">
              <g transform="translate(24 31.67)">
                <ellipse className="ant-empty-img-5" cx="67.797" cy="106.89" rx="67.797" ry="12.668" />
                <path
                  className="ant-empty-img-1"
                  d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                />
                <path
                  className="ant-empty-img-2"
                  d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                />
                <path
                  className="ant-empty-img-3"
                  d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                />
              </g>
              <path
                className="ant-empty-img-3"
                d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
              />
              <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
                <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
                <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
              </g>
            </g>
          </svg>
          <Typography align="center" color="secondary">
            {msg}
          </Typography>
        </StyledGridOverlay>
      </TableCell>
    </TableRow>
  );
};

EmptyTable.propTypes = {
  msg: PropTypes.string,
  colSpan: PropTypes.number
};

// ==============================|| API BASED EXPORT  ||============================== //

export const APIExport = ({
  columns,
  hiddenColumns: hiddenAccessors,
  searchStringTrimmed,
  disabled,
  isFcMode,
  exportConfig,
  fileNameForExport,
  sort,
  defaultSort
}) => {
  const [pending, setPending] = useState(false);

  const preparePayloadForExport = (tableName) => {
    const visibleColumns = getVisibleColumns(columns, hiddenAccessors, true);

    if (visibleColumns.length === 0) {
      toast('No columns are visible', { variant: 'warning' });
      return null;
    }

    const requiredObject = Object.fromEntries(
      visibleColumns.map((column) => {
        const header = column.Header;
        return [column.exportAccessor ? column.exportAccessor : column.accessor, header];
      })
    );

    return {
      tableName,
      requiredObject
    };
  };

  const handleExportDownload = async () => {
    const payload = preparePayloadForExport(exportConfig.tableName);

    if (!payload) return;

    setPending(true);

    const searchAccessors = Object.keys(payload.requiredObject).filter((item) => !['createdAt', 'updatedAt'].includes(item));
    const response = await request(exportConfig.apiRoute || '/export-excel', {
      method: 'POST',
      body: exportConfig.apiBody
        ? { ...(isFcMode && { searchString: searchStringTrimmed, accessors: searchAccessors }), ...exportConfig.apiBody }
        : { ...payload },
      query: {
        ...exportConfig.apiQuery,
        ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(searchAccessors) }),
        sort: [sort?.[0] || defaultSort?.[0] || PAGINATION_CONST.sortBy, sort?.[1] || defaultSort?.[1] || PAGINATION_CONST.sortOrder]
      },
      params: exportConfig.apiParams,
      timeoutOverride: 1200000,
      responseType: 'blob'
    });

    if (!response?.success) {
      toast('Something wrong happend while processing your request', { variant: 'error' });
      setPending(false);
      return;
    }

    const href = URL.createObjectURL(response.data);

    const link = document.createElement('a');

    link.href = href;
    link.setAttribute('download', fileNameForExport);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    setPending(false);
  };

  return (
    <Tooltip title={disabled ? 'No data available to export' : 'Export'}>
      {!pending ? (
        <DownloadOutlined
          onClick={disabled ? () => {} : handleExportDownload}
          style={{
            fontSize: '21px',
            color: disabled ? 'rgb(210, 210, 210)' : 'grey',
            cursor: disabled ? 'not-allowed' : 'pointer',
            padding: '5px'
          }}
        />
      ) : (
        <LoadingIcon color="gray" className="rotate" />
      )}
    </Tooltip>
  );
};

APIExport.propTypes = {
  columns: PropTypes.array,
  hiddenColumns: PropTypes.array,
  searchStringTrimmed: PropTypes.string,
  sort: PropTypes.array,
  defaultSort: PropTypes.array,
  disabled: PropTypes.bool,
  isFcMode: PropTypes.bool,
  fileNameForExport: PropTypes.string,
  exportConfig: PropTypes.shape({
    apiRoute: PropTypes.string,
    tableName: PropTypes.string,
    fileName: PropTypes.string,
    apiQuery: PropTypes.object,
    apiBody: PropTypes.object,
    apiParams: PropTypes.string
  })
};

export const UnifiedHeaderSort = memo(
  ({ column, columns, sort, defaultSort, setSort, enableOfflineSort, isFcMode, isHistory, listType }) => {
    const theme = useTheme();

    const shouldUseApiSort = typeof setSort === 'function';
    const currentAccessor = column.id;
    const shouldFilter = !!column.filterProps;

    const handleChangeSort = useCallback(
      (currentColumn, specifiedSort) => {
        if (!shouldUseApiSort) return;

        const columnObject = columns.find((col) => col.Header === currentColumn);
        if (!columnObject) return;

        let accessorForApi = null;

        if (isFcMode) {
          // origin: fc
          // accessorForApi = column.column;
          accessorForApi = column.Header;
        } else {
          // origin: other forms
          accessorForApi = columnObject.exportAccessor || columnObject.accessor;
        }

        if (specifiedSort) {
          // origin: two button ui
          if (specifiedSort === 'NONE') {
            setSort(defaultSort || null);
          } else if (specifiedSort === 'ASC') {
            setSort([accessorForApi, 'ASC', column.id, columnObject.type]);
          } else {
            setSort([accessorForApi, 'DESC', column.id, columnObject.type]);
          }
        } else {
          // origin: toggle ui
          let newOrder = 'ASC';
          if (Array.isArray(sort) && sort[0] === accessorForApi && sort[1] === 'ASC') {
            newOrder = 'DESC';
          } else if (Array.isArray(sort) && sort[0] === accessorForApi && sort[1] === 'DESC') {
            setSort(defaultSort || null);
            return;
          }
          // [accessor, order, originalAccessor, type]
          setSort([accessorForApi, newOrder, column.id, columnObject.type]);
        }
      },
      [column.Header, column.id, columns, defaultSort, isFcMode, setSort, shouldUseApiSort, sort]
    );

    return (
      <>
        {column.Header !== 'Actions' &&
          !isHistory &&
          (shouldFilter || (!column.disableSortBy && (shouldUseApiSort || enableOfflineSort))) && (
            <MultiSelectDropdown
              column={column}
              shouldUseApiSort={shouldUseApiSort}
              handleChangeSort={handleChangeSort}
              enableOfflineSort={enableOfflineSort}
              sort={sort}
              listType={listType}
              currentAccessor={currentAccessor}
              theme={theme}
              filterProps={column?.filterProps}
            />
          )}
        <Box sx={{ width: 'max-content' }}>{column.render('Header')}</Box>
      </>
    );
  }
);

UnifiedHeaderSort.propTypes = {
  column: PropTypes.any,
  isFcMode: PropTypes.bool,
  isHistory: PropTypes.bool,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string,
      accessor: PropTypes.string,
      exportAccessor: PropTypes.string
    })
  ),
  sort: PropTypes.arrayOf(PropTypes.string),
  defaultSort: PropTypes.arrayOf(PropTypes.string),
  listType: PropTypes.number,
  setSort: PropTypes.func,
  enableOfflineSort: PropTypes.bool
};

export const APIImport = ({
  importConfig,
  isResponse,
  isMasterForm,
  tableName,
  forTraxns = false,
  apipath = '',
  forQA = false,
  forDep = false,
  importCompeted
}) => {
  const [importPending, setImportPending] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [file, setFile] = useState(null);
  const isFcMode = !!importConfig;
  const { apiBody } = importConfig || {};

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleOpenImportModal = () =>
    isResponse
      ? isMasterForm
        ? setOpenImportModal(true)
        : toast('Import is available for Masters form only.', { variant: 'warning' })
      : setOpenImportModal(true);

  const handleCloseImportModal = () => {
    setTimeout(() => {
      if (expanded !== false) {
        setExpanded(false);
      }
      if (file) {
        setFile(null);
      }
    }, 500);
    setImportPending(false);
    setOpenImportModal(false);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSchemaDownload = async () => {
    const response = await request(
      forQA
        ? '/qa-master-maker-lov-schema-export'
        : forDep
        ? '/export-daily-execution-plan-schema'
        : forTraxns
        ? '/export-transaction-schema'
        : '/import-excel-export-schema-file',
      {
        timeoutOverride: 20 * 60000,
        method: 'POST',
        body: isFcMode || forDep || forQA ? apiBody : forTraxns ? { transactionName: tableName } : { tableName },
        responseType: 'blob'
      }
    );
    if (!response.success) {
      toast(response?.error?.message || 'Something went wrong', { variant: 'error' });
      return;
    } else {
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'file.xlsx';
      if (contentDisposition) {
        const matches = /filename="?(.+)"?/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          // eslint-disable-next-line prefer-destructuring
          filename = matches[1];
        }
      }
      const href = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast('No file selected. Please choose a file to import.', { variant: 'warning' });
      return;
    }
    const formdata = new FormData();
    formdata.append('excelFile', file);
    if (isFcMode) {
      if (importConfig?.apiBody?.tableName === 'gaa_level_entries' || importConfig?.apiBody?.tableName === 'urban_level_entries') {
        formdata.append('levelId', apiBody?.levelId);
        formdata.append('tableName', apiBody?.tableName);
      } else {
        formdata.append('formId', apiBody?.formId);
      }
    } else formdata.append('tableName', tableName);
    if (forQA) {
      formdata.append('masterId', importConfig?.apiBody?.masterId);
    }
    if (forDep) {
      formdata.append('projectId', importConfig?.apiBody?.projectId);
      formdata.append('materialTypeId', importConfig?.apiBody?.materialTypeId);
    }
    if (importConfig?.apiBody?.projectMasterMakerLov) {
      formdata.append('projectId', importConfig?.apiBody?.projectMasterMakerLov?.projectId);
      formdata.append('masterId', importConfig?.apiBody?.projectMasterMakerLov?.masterId);
    }
    setImportPending(true);
    const response = await request(
      importConfig?.apiBody?.projectMasterMakerLov
        ? '/import-project-master-lov'
        : forDep
        ? '/import-daily-execution-plan'
        : forQA
        ? '/qa-master-maker-lov-import'
        : forTraxns
        ? apipath
        : isFcMode && importConfig?.apiBody?.tableName === 'gaa_level_entries'
        ? '/import-excel-import-static-master-schema-file'
        : isFcMode && importConfig?.apiBody?.tableName === 'urban_level_entries'
        ? '/import-excel-import-static-master-schema-file-data'
        : '/import-excel-import-schema-file',
      {
        method: 'POST',
        timeoutOverride: 10 * 120 * 60000,
        body: formdata,
        ...((forTraxns || forDep || forQA || importConfig?.apiBody?.projectMasterMakerLov) && { responseType: 'blob' })
      }
    );
    if (!response?.success) {
      toast(
        forDep
          ? ' Daily Execution Plan Import Failed.'
          : forQA
          ? 'QA Master Maker LOV Import Failed.'
          : forTraxns
          ? 'Transaction Import Failed.'
          : response?.error?.message || 'Something went wrong during import',
        {
          variant: 'error'
        }
      );
      setImportPending(false);
      return;
    } else if (forTraxns || forDep || forQA || importConfig?.apiBody?.projectMasterMakerLov) {
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        let filename = 'file.xlsx';
        const matches = /filename="?(.+)"?/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          // eslint-disable-next-line prefer-destructuring
          filename = matches[1];
        }
        const href = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      }
      if (forDep || forQA) importCompeted();
      setImportPending(false);
    } else if (response?.data?.rejectedFiles && response?.data?.rejectedFiles !== '') {
      const { rejectedFiles } = response.data;
      // console.log(rejectedFiles);
      const resposneRejectFile = await request('/download-rejected-records', { method: 'GET', params: rejectedFiles });
      if (resposneRejectFile.success) {
        const { data } = resposneRejectFile;
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', response?.data?.rejectedFiles);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    toast(isFcMode && response?.data?.message ? response?.data?.message : 'Rows were imported successfully!', { variant: 'success' });
    handleCloseImportModal();
  };

  return (
    <>
      <Tooltip title="Import">
        <UploadOutlined onClick={handleOpenImportModal} style={{ fontSize: '21px', color: 'grey', padding: '5px' }} />
      </Tooltip>

      <Dialog open={openImportModal} onClose={handleCloseImportModal} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography gutterBottom variant="h3">
            Import Data
          </Typography>
        </DialogTitle>

        <DialogContent>
          {importPending && <CircularLoader />}
          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Download Template
              </Typography>
              <Button
                onClick={handleSchemaDownload}
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<CloudDownloadOutlinedIcon style={{ fontSize: '20px' }} />}
              >
                Download
              </Button>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ marginBottom: 1 }}>
                Upload File
              </Typography>
              <TextField
                type="file"
                InputProps={{
                  inputProps: {
                    accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                  }
                }}
                onChange={handleFileChange}
                fullWidth
              />
            </Box>
            <Button
              // disabled={!file}
              variant="contained"
              color="primary"
              onClick={handleImport}
              fullWidth
              startIcon={<CloudUploadOutlinedIcon style={{ fontSize: '20px' }} />}
            >
              Import
            </Button>
            <Accordion defaultExpanded onChange={handleChange('panel1')}>
              <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                <Typography>Instructions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>Prepare data correctly as per template to avoid any rejection.</li>
                  <li>Leave the ID column empty when creating a new record. This is for update existing record only.</li>
                  <li>Refer to the reference sheet for dropdown columns and paste the respective UUIDs carefully.</li>
                  <li>Use curly brackets for array-type attributes (e.g. dropdowns, checkboxes, images).</li>
                  <li>
                    Ensure Date/Time follows this format: YYYY-MM-DDTHH:MM:SS.sssZ (UTC time)
                    <br />
                    e.g. 2024-01-31T11:59:59.000Z, For reference, UTC is IST minus 5:30 hours.
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

APIImport.propTypes = {
  importConfig: PropTypes.object,
  tableName: PropTypes.string,
  isMasterForm: PropTypes.bool,
  isResponse: PropTypes.bool,
  forTraxns: PropTypes.bool,
  forDep: PropTypes.bool,
  forQA: PropTypes.bool,
  apipath: PropTypes.string,
  importCompeted: PropTypes.func
};

export const APIUpdate = ({ importConfig, formAttributesArray }) => {
  const [importPending, setImportPending] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [file, setFile] = useState(null);
  const { apiBody } = importConfig || {};
  const methods = useForm();
  const { handleSubmit } = methods;

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleOpenImportModal = () => setOpenImportModal(true);

  const handleCloseImportModal = () => {
    setTimeout(() => {
      if (expanded !== false) {
        setExpanded(false);
      }
      if (file) {
        setFile(null);
      }
    }, 500);
    setImportPending(false);
    setOpenImportModal(false);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpdateSchemaDownload = async (values) => {
    if (!values?.selectedColumns?.length) {
      toast('No column selected. Please select atleast one column to update.', { variant: 'warning' });
      return;
    }
    const response = await request('/import-excel-export-schema-file', {
      timeoutOverride: 20 * 60000,
      method: 'POST',
      body: { ...apiBody, selectedColumns: values?.selectedColumns },
      responseType: 'blob'
    });
    if (!response.success) {
      toast(response?.error?.message || 'Something went wrong', { variant: 'error' });
      return;
    } else {
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'file.xlsx';
      if (contentDisposition) {
        const matches = /filename="?(.+)"?/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          // eslint-disable-next-line prefer-destructuring
          filename = matches[1];
        }
      }
      const href = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
      methods.reset();
    }
  };

  const handleUpdateImport = async () => {
    if (!file) {
      toast('No file selected. Please choose a file to import.', { variant: 'warning' });
      return;
    }
    const formdata = new FormData();
    formdata.append('excelFile', file);
    formdata.append('formId', apiBody?.formId);
    setImportPending(true);
    const response = await request('/import-excel-update-bulk-responses', {
      method: 'POST',
      timeoutOverride: 10 * 120 * 60000,
      body: formdata
    });
    if (!response?.success) {
      toast(response?.error?.message || 'Something went wrong during update', {
        variant: 'error'
      });
      setImportPending(false);
      return;
    } else if (response?.data?.rejectedFiles && response?.data?.rejectedFiles !== '') {
      const { rejectedFiles } = response.data;
      // console.log(rejectedFiles);
      const resposneRejectFile = await request('/download-rejected-records', { method: 'GET', params: rejectedFiles });
      if (resposneRejectFile.success) {
        const { data } = resposneRejectFile;
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', response?.data?.rejectedFiles);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    toast(response?.data?.message || 'Rows were updated successfully!', { variant: 'success' });
    handleCloseImportModal();
  };

  return (
    <>
      <Tooltip title="Update">
        <AutoFixHighOutlinedIcon
          onClick={formAttributesArray?.length ? handleOpenImportModal : () => {}}
          style={{
            fontSize: '32px',
            color: !formAttributesArray?.length ? 'rgb(210, 210, 210)' : 'grey',
            ...(!formAttributesArray?.length ? { cursor: 'not-allowed' } : { cursor: 'pointer' }),
            padding: '5px'
          }}
        />
      </Tooltip>

      <Dialog open={openImportModal} onClose={handleCloseImportModal} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography gutterBottom variant="h3">
            Update Data
          </Typography>
        </DialogTitle>

        <DialogContent>
          {importPending && <CircularLoader />}
          <Stack spacing={3}>
            <Box>
              <FormProvider methods={methods} onSubmit={handleSubmit(handleUpdateSchemaDownload)}>
                <Typography variant="h5" sx={{ marginBottom: 1 }}>
                  Generate Template
                </Typography>
                <RHFSelectTags name="selectedColumns" onChange={() => {}} menus={formAttributesArray} placeholder="Select Columns" />
                <Button
                  sx={{ marginTop: 3 }}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<CloudDownloadOutlinedIcon style={{ fontSize: '20px' }} />}
                >
                  Download
                </Button>
              </FormProvider>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ marginBottom: 1 }}>
                Upload File
              </Typography>
              <TextField
                type="file"
                InputProps={{
                  inputProps: {
                    accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                  }
                }}
                onChange={handleFileChange}
                fullWidth
              />
            </Box>
            <Button
              // disabled={!file}
              variant="contained"
              color="primary"
              onClick={handleUpdateImport}
              fullWidth
              startIcon={<CloudUploadOutlinedIcon style={{ fontSize: '20px' }} />}
            >
              Update
            </Button>
            <Accordion defaultExpanded onChange={handleChange('panel1')}>
              <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                <Typography>Instructions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>This feature is for update existing records. Instructions will be available soon.</li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

APIUpdate.propTypes = {
  importConfig: PropTypes.object,
  formAttributesArray: PropTypes.array
};
