import { Button, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import TableForm from 'tables/table';
import { FormProvider } from 'hook-form';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';

const DevolutionApprove = ({ data, onGoBack }) => {
  const [respData, setRespData] = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecords] = useState([]);
  const [disableAppr, setDisableAppr] = useState(false);

  const validationSchema = Yup.object().shape({
    // projectId: Validations.other,
    // formTypeId: Validations.formType,
    // formId: Validations.form,
    // ...(areaLevelsData && {
    //   hierarchyType: Validations.required
    // })
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {},
    mode: 'all'
  });

  const onBack = () => {
    onGoBack(false);
  };

  const makeUpdate = async (payload) => {
    setLoading(true);
    const response = await request('/devolution-approve-reject', {
      method: 'PUT',
      body: payload,
      params: data.id,
      timeoutOverride: 20 * 60000
    });
    if (response.success) {
      toast(`Devolution ${payload.approvalStatus === 1 ? 'Approved' : 'Rejected'} successfully`, { variant: 'success' });
      setLoading(false);
      onGoBack(false);
    } else {
      toast(response?.error?.message);
      setLoading(false);
    }
  };

  const onReject = () => {
    setLoading(false);
    makeUpdate({
      approvalStatus: 0
    });
  };

  const onApprove = () => {
    setLoading(false);
    makeUpdate({
      approvalStatus: 1,
      ...(respData.length > selectedRecord.length && { approvedResponseIds: selectedRecord.map((v) => v) })
    });
  };

  const makeHeaders = (obj) => {
    const arr = [];
    obj &&
      Object.keys(obj).forEach((k) => {
        if (k !== 'Response ID') {
          arr.push({
            Header: k,
            accessor: k
          });
        }
      });
    return arr;
  };

  useEffect(() => {
    if (selectedRecord && selectedRecord.length > 0) setDisableAppr(false);
    else setDisableAppr(true);
  }, [selectedRecord]);

  const getWithIds = (selectedData) => {
    // if (selectedData instanceof Set) {
    const chunkSize = 10000; // Adjust chunk size based on memory
    let filteredData = [];

    for (let i = 0; i < selectedData.length; i += chunkSize) {
      const chunk = selectedData.slice(i, i + chunkSize); // Process chunk
      filteredData = filteredData.concat(
        chunk.map((item) => {
          return { ...item, id: item['Response ID'] };
        })
      );
    }

    return filteredData; // Save the filtered data
    // }
  };

  const getDetails = useCallback(async (devolutionData) => {
    const response = await request('/devolution-form-data', {
      method: 'POST',
      timeoutOverride: 20 * 60000,
      body: {
        projectId: devolutionData.project.id,
        formId: devolutionData.form.id,
        devolutionId: devolutionData.id
      }
    });
    if (response.success) {
      let { rows, count } = response.data.data;
      const newHeaders = makeHeaders(rows[0]);
      setHeaders([...newHeaders]);
      setRespData(
        getWithIds(rows)
        // rows &&
        //   rows.length > 0 &&
        //   rows.map((v) => {
        //     return { ...v, id: v['Response ID'] };
        //   })
      );
      // setPageIndex(pageIndex + 1);
      setDataCount(count);
    } else toast(response?.error?.message);
  }, []);

  useEffect(() => {
    getDetails(data);
  }, [data, getDetails]);

  return (
    <>
      <FormProvider methods={methods}>
        <Grid container spacing={4} mb={4}>
          <Grid item md={6} xl={6} sx={{ display: 'flex' }}>
            <Typography sx={{ fontWeight: 'bold' }}>DOCUMENT NUMBER:&nbsp;&nbsp;</Typography>
            <Typography> {data?.devolutionDocNo}</Typography>
          </Grid>
          <Grid item md={6} xl={6}></Grid>
          <Grid item md={6} xl={6} sx={{ display: 'flex' }}>
            <Typography sx={{ fontWeight: 'bold' }}>PROJECT:&nbsp;&nbsp;</Typography>
            <Typography> {data?.project?.name}</Typography>
          </Grid>
          <Grid item md={6} xl={6} sx={{ display: 'flex' }}>
            <Typography sx={{ fontWeight: 'bold' }}>FORM:&nbsp;&nbsp;</Typography>
            <Typography> {data?.form?.name}</Typography>
          </Grid>
          <Grid item md={6} xl={6} sx={{ display: 'flex' }}>
            <Typography sx={{ fontWeight: 'bold' }}>CUSTOMER:&nbsp;&nbsp;</Typography>
            <Typography> {data?.organization?.name}</Typography>
          </Grid>
          <Grid item md={6} xl={6} sx={{ display: 'flex' }}>
            <Typography sx={{ fontWeight: 'bold' }}>CUSTOMER STORE:&nbsp;&nbsp;</Typography>
            <Typography> {data?.organization_store?.name}</Typography>
          </Grid>
        </Grid>
        <TableForm
          hidePagination
          hideSearch
          normalDate
          hideAddButton
          hideColumnsSelect
          devolutionExport
          columns={headers}
          data={respData}
          count={dataCount}
          showCheckbox
          selectedRecord={selectedRecord}
          setSelectedRecords={setSelectedRecords}
          exportConfig={{}}
          hideActions
          title=""
        />
        <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
          <Typography sx={{ mt: 0.5, color: 'grey' }}>{`${selectedRecord.length} out of ${dataCount} are selected`}</Typography>
          <Button disabled={loading} size="small" variant="outlined" color="primary" onClick={onBack}>
            Back
          </Button>
          <Button disabled={loading || !disableAppr} size="small" variant="outlined" color="primary" onClick={onReject}>
            Reject
          </Button>
          <Button disabled={loading || disableAppr} size="small" variant="contained" color="primary" onClick={onApprove}>
            Approve
          </Button>
        </Grid>
      </FormProvider>
    </>
  );
};

DevolutionApprove.propTypes = {
  data: PropTypes.any,
  onGoBack: PropTypes.func
};

export default DevolutionApprove;
