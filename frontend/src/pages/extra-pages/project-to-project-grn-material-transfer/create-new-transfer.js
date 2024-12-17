import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Divider, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { getOrganizationStores } from '../../../store/actions';
import { FormProvider, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import RequestDropdownSection from 'components/sections/RequestDropdownSection';

const CreateNewTransfer = ({ saveData }) => {
  const [reqPTPData, setReqPTPData] = useState([]);
  const [response, setResponse] = useState();

  const methods = useForm({
    resolver: yupResolver(Yup.object().shape({})),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;
  const dispatch = useDispatch();

  const transactionTypeId = 'c384a987-d92c-481f-9223-605dd3d05338'; //PTPGRN
  const organizationTypeId = '420e7b13-25fd-4d23-9959-af1c07c7e94b';
  useEffect(() => {
    organizationTypeId && dispatch(getOrganizationStores({ organizationType: organizationTypeId }));
  }, [dispatch, organizationTypeId]);

  const onInitialSubmit = (values) => {
    saveData({
      transactionTypeId: transactionTypeId,
      fromProjectId: reqPTPData?.[0]?.project?.id,
      toProjectId: reqPTPData?.[0]?.other_project?.id,
      fromStoreId: reqPTPData?.[0]?.organization_store?.id,
      toStoreId: reqPTPData?.[0]?.other_store?.id,
      placeOfSupply: values?.placeOfSupply,
      eWayBillNumber: values?.eWayBillNumber,
      eWayBillDate: values?.eWayBillDate,
      vehicleNumber: values?.vehicleNumber,
      remarks: values.remarks,
      materials: reqPTPData
    });
  };

  useEffect(() => {
    if (response && response.length > 0) {
      setReqPTPData(response);
      setValue('fromProject', response?.[0]?.project?.name);
      setValue('fromStore', response?.[0]?.organization_store?.name);
      setValue('placeOfSupply', response?.[0]?.stock_ledger_detail?.placeOfSupply);
      setValue('eWayBillNumber', response?.[0]?.stock_ledger_detail?.eWayBillNumber);
      setValue('eWayBillDate', response?.[0]?.stock_ledger_detail?.eWayBillDate?.split('T')?.[0]);
      setValue('vehicleNumber', response?.[0]?.stock_ledger_detail?.vehicleNumber);
    }
  }, [response, setValue]);

  return (
    <>
      <MainCard title={'Material Transfer Project To Project GRN'} sx={{ mb: 2 }}>
        <FormProvider methods={methods}>
          <RequestDropdownSection
            fromStoreLabel="Company Store"
            type="stockLedger"
            approvedOnly={true}
            transactionType="PTP"
            disableAll={!!reqPTPData?.length}
            setReqData={setResponse}
            showBranchAlso
            showFromStoreAddress
            withSerial
            getFromOtherStore
          />

          {response && (
            <>
              <Grid container spacing={4}>
                <Grid item md={3} xl={2}>
                  <RHFTextField InputLabelProps={{ shrink: true }} name="fromProject" label="From Project" type="text" disabled />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField InputLabelProps={{ shrink: true }} name="fromStore" label="From Company Store" type="text" disabled />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField InputLabelProps={{ shrink: true }} name="placeOfSupply" label="Place of Supply" type="text" disabled />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField InputLabelProps={{ shrink: true }} name="vehicleNumber" label="Vehicle No. / LR No." type="text" disabled />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField InputLabelProps={{ shrink: true }} name="eWayBillNumber" label="E-Way Bill Number" type="text" disabled />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField InputLabelProps={{ shrink: true }} name="eWayBillDate" label="E-Way Bill Date" type="text" disabled />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField InputLabelProps={{ shrink: true }} name="remarks" label="Remarks" type="text" />
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                    <Button size="small" variant="contained" onClick={handleSubmit(onInitialSubmit)} color="primary">
                      Next
                    </Button>
                  </Grid>
                </Grid>
                <Grid container sx={{ mt: 3, mb: 3 }}>
                  <Grid item md={12} xl={12}>
                    <Divider />
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </FormProvider>
      </MainCard>
    </>
  );
};

CreateNewTransfer.propTypes = {
  onClick: PropTypes.func,
  getMaterialList: PropTypes.any,
  view: PropTypes.bool,
  update: PropTypes.bool,
  showData: PropTypes.any,
  saveData: PropTypes.func
};

export default CreateNewTransfer;
