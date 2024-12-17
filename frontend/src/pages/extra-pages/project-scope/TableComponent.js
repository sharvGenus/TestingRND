import PropTypes from 'prop-types';
import { IconButton, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExtensionIcon from '@mui/icons-material/Extension';
import DnsIcon from '@mui/icons-material/Dns';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';

export const Table = ({
  tableTitle,
  tableData,
  tableDataCount,
  tableColumn,
  type,
  onAdd,
  listType,
  setPageInd,
  setPageSze,
  setListType,
  isHistory = false,
  allData
}) => {
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();

  return (
    <TableForm
      isHistory={isHistory}
      title={tableTitle}
      data={tableData || []}
      hideActions
      hideAddButton={tableTitle.includes('History')}
      count={tableDataCount || 0}
      setPageIndex={(e) => {
        setPageIndex(e);
        setPageInd(e);
      }}
      setPageSize={(e) => {
        setPageSize(e);
        setPageSze(e);
      }}
      pageIndex={pageIndex}
      pageSize={pageSize}
      columns={tableColumn}
      onClick={() => {
        onAdd(type);
      }}
      listType={listType}
      setListType={setListType}
      allData={allData}
    />
  );
};

Table.propTypes = {
  tableTitle: PropTypes.string,
  tableData: PropTypes.array,
  tableDataCount: PropTypes.number,
  tableColumn: PropTypes.array,
  type: PropTypes.number,
  onAdd: PropTypes.func,
  isHistory: PropTypes.bool,
  listType: PropTypes.any,
  setListType: PropTypes.any,
  setPageInd: PropTypes.any,
  setPageSze: PropTypes.any,
  allData: PropTypes.array
};

export const Actions = ({ values, onEdit, onDelete, onExtensions, onSat, showHistory, onlyHistory, hideExtAndSat = false }) => {
  return (
    <>
      {!onlyHistory && (
        <>
          <Tooltip title="Edit" placement="bottom" style={{ width: 25 }}>
            <IconButton color="secondary" onClick={() => onEdit(values)}>
              <EditOutlinedIcon style={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" placement="bottom" style={{ width: 25 }}>
            <IconButton color="secondary" onClick={() => onDelete(values)}>
              <DeleteOutlineIcon style={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
          {!hideExtAndSat && (
            <Tooltip title="Extensions" placement="bottom" style={{ width: 25 }}>
              <IconButton color="secondary" onClick={() => onExtensions(values)}>
                <ExtensionIcon style={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )}
          {!hideExtAndSat && (
            <Tooltip title="SAT" placement="bottom" style={{ width: 25 }}>
              <IconButton color="secondary" onClick={() => onSat(values)}>
                <DnsIcon style={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}
      <Tooltip title="History" placement="bottom" style={{ width: 25 }}>
        <IconButton color="secondary" onClick={() => showHistory(values)}>
          <InfoOutlinedIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
    </>
  );
};

Actions.propTypes = {
  values: PropTypes.any,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  onExtensions: PropTypes.func,
  onSat: PropTypes.func,
  showHistory: PropTypes.func,
  hideExtAndSat: PropTypes.bool,
  onlyHistory: PropTypes.bool
};
