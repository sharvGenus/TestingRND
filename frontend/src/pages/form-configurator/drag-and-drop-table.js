/* eslint-disable react/no-array-index-key */
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useTable } from 'react-table';
import update from 'immutability-helper';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { DraggableRow } from 'components/third-party/ReactTable';

const DragDropTable = ({ columns, data, setAttributesArray, hideInactiveRows = false }) => {
  const getRowId = useCallback((row) => row?.rank, []);
  const arrangeRank = (list) => {
    const newList = structuredClone(list)?.map((val, ind) => {
      if (val) {
        if (val.rank) {
          return val;
        } else {
          val.rank = ind + 1;
          return val;
        }
      } else {
        return {};
      }
    });
    return newList;
  };
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    data: arrangeRank(data),
    columns,
    getRowId
  });
  const moveRow = (dragIndex, hoverIndex) => {
    const dragRecord = data[dragIndex];
    setAttributesArray(
      update(data, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord]
        ]
      })
    );
  };
  return (
    <ScrollX>
      <MainCard content={false}>
        <Table {...getTableProps()}>
          <TableHead sx={{ borderTopWidth: 2 }}>
            {headerGroups.map((headerGroup, i) => (
              <TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
                <TableCell sx={{ position: 'sticky !important', minWidth: 180, width: 180, pt: 2, pb: 2 }}>Reorder</TableCell>
                {headerGroup.headers.map((column, index) => (
                  <TableCell
                    key={index}
                    {...column.getHeaderProps([{ className: column.className }])}
                    sx={{ position: 'sticky !important', minWidth: 180, width: 180, pt: 2, pb: 2 }}
                  >
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
                  {!hideInactiveRows ? (
                    <DraggableRow key={row} index={index} moveRow={moveRow} {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <TableCell key={row?.original?.id} {...cell.getCellProps([{ className: cell.column.className }])}>
                          {cell.render('Cell')}
                        </TableCell>
                      ))}
                    </DraggableRow>
                  ) : row.original?.isActive === '1' ? (
                    <DraggableRow key={row} index={index} moveRow={moveRow} {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <TableCell key={row?.original?.id} {...cell.getCellProps([{ className: cell.column.className }])}>
                          {cell.render('Cell')}
                        </TableCell>
                      ))}
                    </DraggableRow>
                  ) : (
                    <></>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </MainCard>
    </ScrollX>
  );
};

DragDropTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  setAttributesArray: PropTypes.func,
  hideInactiveRows: PropTypes.bool
};

export default DragDropTable;
