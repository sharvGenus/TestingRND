import { Button, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import TableForm from 'tables/table';
import toast from 'utils/ToastNotistack';
import request from 'utils/request';

const DisplayMasters = ({ data, userId, masterId, roleId, storeOrgId }) => {
  const [selectedRecord, setSelectedRecords] = useState([]);

  const headers = [
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Code',
      accessor: 'code'
    }
  ];

  useEffect(() => {
    if (data && data.length > 0) {
      const ids = [];
      data.map((val) => {
        if (val.isAccess === true) ids.push(val.id);
      });
      setSelectedRecords(ids);
    }
  }, [data]);

  const multipleApiCalls = async (payload, records, limit) => {
    if (records && records.length > 0) {
      payload['lovArray'] = records.splice(0, limit);
      payload['storeOrgTypeId'] = storeOrgId;
      const response = await request('/govern-user-rows', { method: 'POST', body: payload });
      if (response.success) {
        multipleApiCalls(payload, records, limit);
      } else {
        toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
      }
    } else {
      const successMessage = 'Rights updated successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
    }
  };

  const saveData = async () => {
    let limit = 2000;
    const payload = {
      userId: userId,
      roleId: roleId,
      masterId: masterId
    };
    if (selectedRecord.length > limit) {
      multipleApiCalls(payload, selectedRecord, limit);
    } else {
      payload['lovArray'] = selectedRecord;
      payload['storeOrgTypeId'] = storeOrgId;
      const response = await request('/govern-user-rows', { method: 'POST', body: payload });
      if (response.success) {
        const successMessage = 'Rights updated successfully!';
        toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      } else {
        toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
      }
    }
  };

  return (
    <>
      {data && data.length > 0 && (
        <Grid container spacing={1} mb={3}>
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            {data && data.length > 0 && (
              <Button variant="contained" onClick={saveData}>
                Save
              </Button>
            )}
          </Grid>
        </Grid>
      )}
      {data && data.length > 0 && (
        <div style={{ maxHeight: '550px', overflow: 'auto' }}>
          <TableForm
            title=""
            hideAddButton
            hideExportButton
            hideActions
            data={data || []}
            columns={headers}
            count={data.length || 0}
            showCheckbox
            accessTableOnly
            hidePagination
            selectedRecord={selectedRecord}
            setSelectedRecords={setSelectedRecords}
          />
        </div>
      )}
    </>
  );
};

DisplayMasters.propTypes = {
  data: PropTypes.any,
  userId: PropTypes.string,
  roleId: PropTypes.string,
  masterId: PropTypes.string,
  storeOrgId: PropTypes.string
};

export default DisplayMasters;
