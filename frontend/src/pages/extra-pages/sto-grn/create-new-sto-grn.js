import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Button, Divider, Grid } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
// import { useStockLedger } from '../stock-ledger/useStockLedger';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import { fetchRequestDetails } from 'store/actions';
import { valueIsMissingOrNA } from 'utils';
import { useRequest } from 'pages/receipts/mrf-receipt/useRequest';

const CreateNewSTOGRN = ({
  reqData,
  strTransactionTypeId,
  // stoTransactionTypeId,
  setUpdatedReqData,
  showMaterials,
  onNext: handleNext,
  onBack: handleBack
}) => {
  const [eWayBillNumbers, setEwayBillNumbers] = useState();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        toStoreId: Validations.toStore,
        actualReceiptDate: Validations.actualReceiptDate,
        ...(!valueIsMissingOrNA(eWayBillNumbers) && { eWayBillDate: Validations.requiredWithLabel('E-Way Bill Date') })
      })
    ),
    defaultValues: {},
    mode: 'all'
  });
  const { setValue, handleSubmit, watch } = methods;

  const dispatch = useDispatch();

  const [projectData, setProjectData] = useState([]);
  const [projectSiteStoreData, setProjectSiteStoreData] = useState([]);
  const [projectSiteStoreLocationData, setProjectSiteStoreLocationData] = useState([]);
  const [strRequestNumber, setStrRequestNumber] = useState(null);

  const { organizationStores } = useOrganizationStore();
  const toProjectSiteStoreData = organizationStores?.organizationStoreObject?.rows || [];

  // const refDocNumber = reqData?.[0].referenceDocumentNumber;

  // useEffect(() => {
  //   if (!refDocNumber) return;
  //   dispatch(fetchStockLedgerDetailList({ transactionTypeId: stoTransactionTypeId, referenceDocumentNumber: refDocNumber }));
  // }, [dispatch, stoTransactionTypeId, refDocNumber]);

  // const { stockLedgerDetailList } = useStockLedger();

  useEffect(() => {
    // const stockLedgerDetailData = stockLedgerDetailList?.stockLedgerDetailListObject?.rows || [];

    // if (!reqData || !stockLedgerDetailData?.length) return;

    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues || {}).forEach(([fieldName, value]) => {
        if (fieldName === 'remarks') {
          setValue('remarks', '');
        } else {
          setValue(fieldName, value || '');
        }
      });
    };

    if (reqData && reqData.length > 0) {
      const stock_ledgers = reqData;
      const slNegative = stock_ledgers?.filter((item) => +item.quantity < 0);
      setProjectData([slNegative?.[0]?.project]);
      setProjectSiteStoreData([slNegative?.[0]?.organization]);
      setProjectSiteStoreLocationData([slNegative?.[0]?.organization_store_location]);

      // setProjectData([]);
      // setProjectSiteStoreData([]);
      // setProjectSiteStoreLocationData([]);

      handleSetValues(stock_ledgers?.[0]);
      handleSetValues(slNegative?.[0]?.stock_ledger_detail);

      setValue('invoiceDate', slNegative?.[0]?.stock_ledger_detail?.invoiceDate?.split('T')?.[0]);
      setValue('ewayBillDate', stock_ledgers?.[0]?.ewayBillDate?.split('T')?.[0]);
      setValue('actualReceiptDate', stock_ledgers?.[0]?.actualReceiptDate?.split('T')?.[0]);
      setValue('invoiceNumber', slNegative?.[0]?.stock_ledger_detail?.referenceDocumentNumber);
      // setValue('toStoreId', stock_ledgers?.[0]?.toStoreId);
      setValue('projectId', stock_ledgers?.[0]?.project?.id);
      setValue('fromStoreId', slNegative?.[0]?.storeId);
      setValue('fromStoreLocationId', slNegative?.[0]?.storeLocationId);
    }
  }, [reqData, setValue]);

  const eWayBillNumberValue = watch('eWayBillNumber');

  useEffect(() => {
    setEwayBillNumbers(eWayBillNumberValue);
  }, [eWayBillNumberValue]);

  useEffect(() => {
    if (reqData && reqData.length > 0 && reqData[0] && reqData[0].stock_ledger_detail && reqData[0].stock_ledger_detail.toStoreId)
      setValue('toStoreId', reqData[0].stock_ledger_detail.toStoreId);
    else if (requestData) {
      setValue('toStoreId', requestData[0]?.toStoreId);
    }
  });

  const onFormSubmit = (formData) => {
    const { toStoreId, eWayBillNumber, eWayBillDate, actualReceiptDate, remarks, projectId } = formData;
    const stoData = reqData.map((item) => ({
      ...item,
      ...reqData?.[0]?.stock_ledger_detail,
      // ...reqData,
      quantity: item.quantity,
      projectId,
      toStoreId,
      eWayBillNumber,
      eWayBillDate,
      actualReceiptDate,
      remarks,
      stock_ledgers: reqData
    }));
    setUpdatedReqData(stoData);
    handleNext();
  };

  useEffect(() => {
    if (reqData) {
      setStrRequestNumber(reqData[0].requestNumber);
    }
  }, [reqData]);

  useEffect(() => {
    if (reqData?.[0]?.otherStoreId && reqData?.[0]?.otherStoreId !== null) setValue('toStoreId', reqData?.[0]?.otherStoreId);
    else
      dispatch(
        fetchRequestDetails({
          transactionTypeId: strTransactionTypeId,
          referenceDocumentNumber: strRequestNumber,
          projectId: reqData?.[0]?.projectId,
          fromStoreId: reqData?.[0]?.storeId
        })
      );
  }, [dispatch, strTransactionTypeId, strRequestNumber, setValue, reqData]);

  const { transactionRequest } = useRequest();
  const requestData = transactionRequest?.requestDetails?.rows;

  return (
    <>
      {reqData && (
        <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
          <Grid container spacing={4} mt={4}>
            <Grid item md={3} xl={2} style={{ display: 'none' }}>
              <RHFSelectbox name="projectId" label="Project" menus={projectData} disable required />
            </Grid>
            <Grid item md={3} xl={2} style={{ display: 'none' }}>
              <RHFSelectbox name="fromStoreId" label="Company Store" menus={projectSiteStoreData} disable required />
            </Grid>
            <Grid item md={3} xl={2} style={{ display: 'none' }}>
              <RHFSelectbox
                name="fromStoreLocationId"
                label="Company Store Location"
                menus={projectSiteStoreLocationData}
                disable
                required
              />
            </Grid>
            <Grid item md={3} xl={2} style={{ display: 'none' }}>
              <RHFSelectbox name="toStoreId" label="To Company Store" menus={toProjectSiteStoreData} disable required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="invoiceNumber" type="text" label="Invoice Number" disabled required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="invoiceDate" type="date" label="Invoice Date" disabled required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="transporterName" type="text" label="Transporter Name" disabled />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="transporterContactNumber" type="number" label="Contact Number" disabled />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="vehicleNumber" type="text" label="Vehicle Number" disabled />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="lrNumber" type="text" label="LR Number" disabled />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="eWayBillNumber" type="text" label="E-Way Bill Number" disabled={showMaterials} />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                name="eWayBillDate"
                type="date"
                label="E-Way Bill Date"
                disabled={showMaterials || valueIsMissingOrNA(eWayBillNumbers)}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="actualReceiptDate" type="date" label="Actual Receipt Date" disabled={showMaterials} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="remarks" type="text" label="Remarks" disabled={showMaterials} />
            </Grid>
            {!showMaterials ? (
              <>
                <Grid container spacing={4}>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mt: 3 }}>
                    <Button onClick={handleBack} size="small" variant="outlined" color="primary">
                      Back
                    </Button>
                    <Button type="submit" size="small" variant="contained" color="primary">
                      Next
                    </Button>
                  </Grid>
                </Grid>
              </>
            ) : (
              <Grid container sx={{ mt: 3, mb: 3 }}>
                <Grid item md={12} xl={12}>
                  <Divider />
                </Grid>
              </Grid>
            )}
          </Grid>
        </FormProvider>
      )}
    </>
  );
};

CreateNewSTOGRN.propTypes = {
  reqData: PropTypes.array,
  setUpdatedReqData: PropTypes.func,
  showMaterials: PropTypes.bool,
  onNext: PropTypes.func,
  onBack: PropTypes.func,
  strTransactionTypeId: PropTypes.string,
  stoTransactionTypeId: PropTypes.string
};

export default CreateNewSTOGRN;
