/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
import PropTypes from 'prop-types';
import { useCallback, Fragment } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Chip, Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

// third-party
import { useExpanded, useTable } from 'react-table';

// project import
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';

// assets

const avatarImage = require.context('assets/images/users', true);

// ==============================|| REACT SUB TABLE ||============================== //

function ReactSubTable({ columns, data, loading }) {
  const { getTableProps, getTableBodyProps, headerGroups } = useTable({
    columns,
    data
  });

  if (loading) {
    return (
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup, i) => (
            <TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <TableCell key={index} {...column.getHeaderProps()}>
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {[0, 1, 2].map((item) => (
            <TableRow key={item}>
              {[0, 1, 2, 3, 4, 5].map((col) => (
                <TableCell key={col}>
                  <Skeleton animation="wave" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return <ReactTable columns={columns} data={data} />;
}

ReactSubTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  loading: PropTypes.bool
};

// ==============================|| SUB ROW - ASYNC DATA ||============================== //

const AvatarCell = ({ value }) => <Avatar alt="Avatar 1" size="sm" src={avatarImage(`./avatar-${value}.png`)} />;

AvatarCell.propTypes = {
  value: PropTypes.bool
};

function SubRowAsync({ loading, data, columns }) {
  const theme = useTheme();

  const backColor = alpha(theme.palette.primary.light, 0.1);

  return (
    <TableRow sx={{ bgcolor: backColor, '&:hover': { bgcolor: `${backColor} !important` } }}>
      <TableCell colSpan={8} sx={{ p: 2.5 }}>
        <MainCard content={false} sx={{ ml: { xs: 2.5, sm: 5, md: 6, lg: 10, xl: 12 } }}>
          <ReactSubTable columns={columns} data={data} loading={loading} />
        </MainCard>
      </TableCell>
    </TableRow>
  );
}

SubRowAsync.defaultProps = {
  loading: false
};

SubRowAsync.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.array,
  columns: PropTypes.array
};

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns: userColumns, data, renderRowSubComponent }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, visibleColumns } = useTable(
    {
      columns: userColumns,
      data
    },
    useExpanded
  );

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup, i) => (
          <TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, index) => (
              <TableCell key={index} {...column.getHeaderProps([{ className: column.className }])}>
                {column.render('Header')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          const rowProps = row.getRowProps();

          return (
            <Fragment key={i}>
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell, i) => (
                  <TableCell key={i} {...cell.getCellProps([{ className: cell.column.className }])}>
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
              {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns })}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  renderRowSubComponent: PropTypes.any
};

// ==============================|| REACT TABLE - EXPANDING SUB TABLE ||============================== //

const CellExpander = ({ cell: { row, rows }, onExpand }) => {
  const collapseIcon = row.isExpanded ? <DownOutlined /> : <RightOutlined />;

  const enhancedToggleProps = {
    ...row.getToggleRowExpandedProps(),
    onClick: (e) => {
      e.preventDefault();
      const isExpanding = !row.isExpanded;

      // Collapse all rows
      rows.forEach((r) => {
        if (r.id !== row.id) {
          r.toggleRowExpanded(false);
        }
      });

      // Expand the current row
      row.toggleRowExpanded(isExpanding);

      const allRowData = row.original;
      onExpand({ isExpanding, values: allRowData });
    }
  };

  return (
    <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }} {...enhancedToggleProps}>
      {collapseIcon}
    </Box>
  );
};

CellExpander.propTypes = {
  cell: PropTypes.object,
  onExpand: PropTypes.func,
  rows: PropTypes.func
};

const StatusCell = ({ value }) => {
  switch (value) {
    case 'Complicated':
      return <Chip color="error" label="Complicated" size="small" variant="light" />;
    case 'Relationship':
      return <Chip color="success" label="Relationship" size="small" variant="light" />;
    case 'Single':
    default:
      return <Chip color="info" label="Single" size="small" variant="light" />;
  }
};

StatusCell.propTypes = {
  value: PropTypes.string
};

const ProgressCell = ({ value }) => <LinearWithLabel value={value} sx={{ minWidth: 75 }} />;

ProgressCell.propTypes = {
  value: PropTypes.number
};

const ExpandingSubTable = ({ data, subData, subDataLoading, subColumns, columns: propColumns, title, secondary, onExpand }) => {
  const columns = [...propColumns];
  columns.unshift({
    Header: () => null,
    id: 'expander',
    className: 'cell-center',
    Cell: (cell) => <CellExpander cell={cell} onExpand={onExpand} />,
    SubCell: () => null
  });

  const renderRowSubComponent = useCallback(
    () => <SubRowAsync loading={subDataLoading} columns={subColumns} data={subData} />,
    [subColumns, subData, subDataLoading]
  );

  return (
    // secondary => csv export button / other button as required on the right
    <MainCard content={false} title={title} secondary={secondary}>
      <ScrollX>
        <ReactTable columns={columns} data={data} renderRowSubComponent={renderRowSubComponent} />
      </ScrollX>
    </MainCard>
  );
};

ExpandingSubTable.defaultProps = {
  withTitle: false,
  subDataLoading: false,
  onExpand: () => {},
  title: '',
  secondary: <></>
};

ExpandingSubTable.propTypes = {
  withTitle: PropTypes.bool,
  columns: PropTypes.array,
  subDataLoading: PropTypes.bool,
  subColumns: PropTypes.array,
  data: PropTypes.array,
  onExpand: PropTypes.func,
  subData: PropTypes.array,
  title: PropTypes.string,
  secondary: PropTypes.any
};

export default ExpandingSubTable;
