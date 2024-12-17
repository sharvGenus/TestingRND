import { useMemo, useState, useEffect } from 'react';
import { Button, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CreateNewApprover from './create-new-approver';
import DragDropTable from './DragDropTable';
import { useApprovers } from './useApprover';
import { FormProvider } from 'hook-form';
import request from 'utils/request';
import { getApprovers } from 'store/actions';
import toast from 'utils/ToastNotistack';

const TableForm = ({
  columns,
  tst,
  hideHeader,
  setShowUpdate,
  handleRowDelete,
  hideEditAction,
  handleRowUpdate,
  deletes,
  rankIncrement,
  setShuffle,
  shuffle,
  setShowData
}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DragDropTable
            columns={columns}
            handleRowDelete={handleRowDelete}
            handleRowUpdate={handleRowUpdate}
            hideHeader={hideHeader}
            data={tst}
            hideEditAction={hideEditAction}
            setShowUpdate={setShowUpdate}
            deletes={deletes}
            rankIncrement={rankIncrement}
            setShuffle={setShuffle}
            shuffle={shuffle}
            setShowData={setShowData}
          />
        </Grid>
      </Grid>
    </DndProvider>
  );
};

TableForm.propTypes = {
  columns: PropTypes.array,
  tst: PropTypes.array,
  hideHeader: PropTypes.bool,
  handleRowDelete: PropTypes.func,
  handleRowUpdate: PropTypes.func,
  hideEditAction: PropTypes.bool,
  setShowUpdate: PropTypes.func,
  deletes: PropTypes.bool,
  rankIncrement: PropTypes.number,
  setShuffle: PropTypes.func,
  shuffle: PropTypes.bool,
  setShowData: PropTypes.func
};

const Approver = ({ setShowUpdate, formvalue, setShow, setDisableAll, organizationId }) => {
  const dispatch = useDispatch();
  const [showData, setShowData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [updates, setUpdates] = useState(false);
  const [deletes, setDeletes] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  useEffect(() => {
    // TODO add StoreId
    dispatch(getApprovers({ ...formvalue, sortBy: 'rank', sortOrder: 'ASC' }));
  }, [dispatch, formvalue]);

  const columns = useMemo(
    () => [
      {
        Header: 'Level',
        accessor: 'rank'
      },
      {
        Header: 'Name',
        accessor: 'user.name'
      },
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'Mobile Number',
        accessor: 'mobileNumber'
      }
    ],
    []
  );
  const {
    approvers: {
      approversObject: { rows: approverData = [] }
    }
  } = useApprovers();

  const handleRowUpdate = (value) => {
    setUpdates(true);
    setUpdateData(value);
  };

  const handleRowDelete = (val) => {
    setShowTable(false);
    if (val) {
      const list = showData.filter((value) => value?.user?.name !== val);
      const valRank = showData.find((x) => x?.user?.name === val)?.rank;
      const newList = list.map((value) => ({ ...value, rank: value.rank > valRank ? value.rank - 1 : value.rank }));
      setDeletes(!deletes);
      setShowData(newList);
      setTimeout(() => {
        setShowTable(true);
      }, 50);
    }
  };
  const rankIncrement = approverData?.[approverData.length - 1]?.rank;
  const saveData = (val) => {
    setShowUpdate(false);
    setShowTable(false);
    if (
      showData.length === 0 &&
      approverData[approverData.length - 1]?.projectId === formvalue?.projectId &&
      approverData[approverData.length - 1]?.transactionTypeId === formvalue?.transactionTypeId
    ) {
      val.rank = approverData[approverData.length - 1].rank + 1;
      setShowData(showData.concat(val));
      setTimeout(() => {
        setShowTable(true);
      }, 50);
    } else if (showData.length > 0) {
      val.rank = showData[showData.length - 1].rank + 1;
      setShowData(showData.concat(val));
      setShowTable(true);
    } else {
      val.rank = showData.length + 1;
      setShowData(showData.concat(val));
      setTimeout(() => {
        setShowTable(true);
      }, 50);
    }
  };

  const onFormSubmit = async () => {
    if (showData.length > 0) {
      const checkEmail = showData.filter((x, i, arr) => {
        return arr.slice(i + 1).some((item) => item.email === x.email);
      });
      if (checkEmail.length > 0) {
        toast('Email already used.', { variant: 'error', autoHideDuration: 10000 });
      } else {
        const getdata = showData.map((x) => {
          const newValue = { ...x };
          delete newValue['user'];
          return newValue;
        });
        const payload = {
          projectId: formvalue?.projectId,
          transactionTypeId: formvalue?.transactionTypeId,
          organizationTypeId: '420e7b13-25fd-4d23-9959-af1c07c7e94b',
          organizationNameId: formvalue?.oraganizationNameId,
          storeId: formvalue?.storeId,
          approvers: getdata
        };
        const response = await request('/approver-create', { method: 'POST', body: payload });

        if (response.success) {
          // TODO add StoreId
          dispatch(getApprovers({ ...formvalue, sortBy: 'rank', sortOrder: 'ASC' }));
          setDisableAll(true);
          setShow(true);
          toast('Approver created successfully', { variant: 'success', autoHideDuration: 10000 });
        } else {
          toast(response.error?.message || 'Creation failed. Please try again.', { variant: 'error' });
        }
      }
    }
  };

  return (
    <>
      <CreateNewApprover
        updates={updates}
        formvalue={formvalue}
        updateData={updateData}
        showData={showData}
        saveData={saveData}
        organizationId={organizationId}
      />
      {showData && showData.length > 0 && (
        <>
          {showTable && (
            <TableForm
              columns={columns}
              hideEditAction={true}
              handleRowDelete={handleRowDelete}
              handleRowUpdate={handleRowUpdate}
              hideHeader
              tst={showData}
              setShowUpdate={setShowUpdate}
              deletes={deletes}
              rankIncrement={rankIncrement}
              setShuffle={setShuffle}
              shuffle={shuffle}
              setShowData={setShowData}
            />
          )}
          <FormProvider>
            <Grid container spacing={4}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mr: 3 }} mb={3.5}>
                <Button onClick={onFormSubmit} size="small" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </FormProvider>
        </>
      )}
    </>
  );
};

Approver.propTypes = {
  update: PropTypes.bool,
  data: PropTypes.object,
  setShowUpdate: PropTypes.func,
  formvalue: PropTypes.object,
  setDisableAll: PropTypes.func,
  setShow: PropTypes.func,
  organizationId: PropTypes.string
};

export default Approver;
