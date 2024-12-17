import PropTypes from 'prop-types';
import React, { useCallback, useState, useEffect } from 'react';

// material-ui
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material';

// third-party
import { useTable } from 'react-table';
import { PlusOutlined } from '@ant-design/icons';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';

// project import
import ScrollX from 'components/ScrollX';
import { DraggableRow } from 'components/third-party/ReactTable';
import { formatDate, formatOperator, formatTimeStamp, getDateTimeBoth, getTimeOnly } from 'utils';

// ==============================|| REACT TABLE ||============================== //

const ReactTable = ({
  title,
  hideAddButton,
  handleRowDelete,
  handleRowUpdate,
  hideTopBorder,
  onClick,
  hideHeader,
  columns,
  data,
  hideActions,
  hideEditAction,
  setShowUpdate,
  setUpdateData,
  showUpdate,
  deletes,
  rankIncrement,
  setShuffle,
  shuffle,
  setShowData
}) => {
  ReactTable.defaultProps = {
    hideActions: false,
    hideTopBorder: false,
    hideAddButton: false,
    hideExportButton: false,
    hideSearch: false,
    hideType: false,
    hideHeader: false,
    showCheckbox: false,
    hideViewIcon: false,
    hideHistoryIcon: false,
    hideEmptyTable: false,
    hideEditAction: false,
    setShowUpdate: false
  };
  const [records, setRecords] = useState(data);
  useEffect(() => {
    if (data) {
      setRecords(data);
    }
  }, [data]);

  const getRowId = useCallback((row) => row.rank, []);
  const arrangeRank = (list) => {
    const newList = structuredClone(list).map((val, ind) => {
      if (val.rank) {
        return val;
      } else {
        val.rank = ind + 1;
      }
    });
    return newList;
  };
  let dataUse;
  deletes ? (dataUse = records) : (dataUse = arrangeRank(records));
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    data: dataUse,
    columns,
    getRowId
  });
  useEffect(() => {
    if (showUpdate) setUpdateData(arrangeRank(records));
  }, [records, showUpdate, setUpdateData]);

  const moveRow = (dragIndex, hoverIndex) => {
    if (rankIncrement) setShuffle(true);
    else setShowUpdate(true);
    const updatedRecords = structuredClone([...records]);
    const dragRecord = { ...updatedRecords[dragIndex] };

    let newRank;
    if (hoverIndex === 0) {
      newRank = updatedRecords[hoverIndex].rank + 1;
    } else if (hoverIndex === updatedRecords.length - 1) {
      newRank = updatedRecords[hoverIndex].rank - 1;
    } else {
      newRank = (updatedRecords[hoverIndex].rank + updatedRecords[hoverIndex - 1].rank) / 2;
    }

    dragRecord.rank = newRank;

    updatedRecords.splice(dragIndex, 1);
    updatedRecords.splice(hoverIndex, 0, dragRecord);

    updatedRecords.forEach((record, index) => {
      record.rank = index + 1;
    });

    setRecords(updatedRecords);
  };

  useEffect(() => {
    if (shuffle) {
      const newData = records.map((x) => ({ ...x, rank: x.rank + rankIncrement }));
      setShuffle(false);
      setRecords(newData);
      setShowData(newData);
    }
  }, [shuffle, records, rankIncrement, setShuffle, setShowData]);

  return (
    <>
      <MainCard
        content={false}
        sx={{
          height: 'auto',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderTop: hideTopBorder ? 'none' : ''
        }}
      >
        {!hideHeader && (
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ height: '12%' }}>
            <Typography variant="h4" sx={{ position: 'relative', left: 20, p: '10px' }}>
              {title}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ position: 'relative', right: 20 }}>
              <Stack direction="row" spacing={2} justifyContent="space-between">
                {!hideAddButton && (
                  <Tooltip title="Add">
                    <PlusOutlined onClick={onClick} style={{ fontSize: '25px', color: 'grey', padding: '5px' }} />
                  </Tooltip>
                )}
              </Stack>
            </Stack>
          </Stack>
        )}
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup} {...headerGroup.getHeaderGroupProps()}>
                <TableCell />
                <TableCell>Actions</TableCell>
                {headerGroup.headers.map((column) => (
                  <TableCell key={column} {...column.getHeaderProps([{ className: column.className }])}>
                    {column.render('Header')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row);
              return (
                <>
                  <DraggableRow key={row} index={index} moveRow={moveRow} {...row.getRowProps()}>
                    {!hideActions && (
                      <TableCell>
                        {!hideEditAction && (
                          <Tooltip title="Edit" placement="bottom">
                            <IconButton color="secondary" onClick={() => handleRowUpdate(row?.original)}>
                              <EditOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Delete" placement="bottom">
                          <IconButton color="secondary" onClick={() => handleRowDelete(row?.original?.id || row?.original?.user?.name)}>
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                    {row.cells.map((cell) => (
                      <TableCell key={row?.original?.id} {...cell.getCellProps([{ className: cell.column.className }])}>
                        {!cell.column?.properties ? (
                          <>
                            {(cell.column.Header == 'Updated On' || cell.column.Header == 'Created On') && formatTimeStamp(cell.value)}
                            {cell.column.Header.includes('Date') && cell.value != null && cell.value != '' && formatDate(cell.value)}
                            {cell.column.Header == 'Operator' && formatOperator(cell.value)}
                            {cell.column.Header !== 'Updated On' &&
                              cell.column.Header !== 'Operator' &&
                              cell.column.Header !== 'Created On' &&
                              !cell.column.Header.includes('Date') &&
                              cell.render('Cell')}
                            {(cell.value == null || cell.value === '') && '-'}
                          </>
                        ) : (
                          <>
                            {(cell.column.Header == 'Updated On' || cell.column.Header == 'Created On') && formatTimeStamp(cell.value)}
                            {cell.value != null && cell.value != ''
                              ? cell.column.type == 'date'
                                ? cell.column.properties &&
                                  cell.column.properties?.pickerType &&
                                  cell.column.properties?.pickerType === 'timeOnly'
                                  ? getTimeOnly(cell.value, cell.column.properties?.timeFormat)
                                  : cell.column.properties?.pickerType === 'dateTimeBoth'
                                  ? getDateTimeBoth(cell.value, cell.column.properties?.timeFormat)
                                  : formatDate(cell.value)
                                : cell.render('Cell')
                              : '-'}
                          </>
                        )}
                      </TableCell>
                    ))}
                  </DraggableRow>
                </>
              );
            })}
          </TableBody>
        </Table>
      </MainCard>
    </>
  );
};

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  title: PropTypes.string,
  hideHeader: PropTypes.bool,
  hideAddButton: PropTypes.bool,
  onClick: PropTypes.func,
  hidePagination: PropTypes.bool,
  hideTopBorder: PropTypes.bool,
  handleRowUpdate: PropTypes.func,
  handleRowDelete: PropTypes.func,
  count: PropTypes.number,
  hideActions: PropTypes.bool,
  hideEditAction: PropTypes.bool,
  setShowUpdate: PropTypes.func,
  setUpdateData: PropTypes.func,
  showUpdate: PropTypes.bool,
  deletes: PropTypes.bool,
  rankIncrement: PropTypes.number,
  setShuffle: PropTypes.func,
  shuffle: PropTypes.bool,
  setShowData: PropTypes.func
};

// ==============================|| REACT TABLE - ROW DRAG & DROP ||============================== //

const DragDropTable = ({
  data,
  title,
  columns,
  hideHeader,
  count,
  hideAddButton,
  hideEditAction,
  handleRowDelete,
  handleRowUpdate,
  onClick,
  setShowUpdate,
  setUpdateData,
  showUpdate,
  deletes,
  rankIncrement,
  setShuffle,
  shuffle,
  setShowData
}) => {
  return (
    // <Tooltip title="Reorder" placement="bottom">
    <ScrollX sx={{ height: count ? (!hideHeader ? '88%' : '50%') : '90%' }}>
      <ReactTable
        title={title}
        hideHeader={hideHeader}
        onClick={onClick}
        handleRowDelete={handleRowDelete}
        handleRowUpdate={handleRowUpdate}
        hideAddButton={hideAddButton}
        columns={columns}
        data={data}
        count={count}
        setShowUpdate={setShowUpdate}
        hideEditAction={hideEditAction}
        setUpdateData={setUpdateData}
        showUpdate={showUpdate}
        deletes={deletes}
        rankIncrement={rankIncrement}
        setShuffle={setShuffle}
        shuffle={shuffle}
        setShowData={setShowData}
      />
    </ScrollX>
    // </Tooltip>
  );
};

DragDropTable.propTypes = {
  data: PropTypes.any,
  columns: PropTypes.any,
  hideHeader: PropTypes.bool,
  title: PropTypes.string,
  hideAddButton: PropTypes.bool,
  onClick: PropTypes.func,
  handleRowUpdate: PropTypes.func,
  handleRowDelete: PropTypes.func,
  count: PropTypes.number,
  hideActions: PropTypes.bool,
  hideEditAction: PropTypes.bool,
  setShowUpdate: PropTypes.func,
  setUpdateData: PropTypes.func,
  showUpdate: PropTypes.bool,
  deletes: PropTypes.bool,
  rankIncrement: PropTypes.number,
  setShuffle: PropTypes.func,
  shuffle: PropTypes.bool,
  setShowData: PropTypes.func
};

export default DragDropTable;
