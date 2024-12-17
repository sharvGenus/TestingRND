import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid, Stack, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import { getMasterMakerLov, getDropdownProjects, getOrganizationStores } from '../../../store/actions';
import { PAGINATION_CONST } from '../../../constants';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { FormProvider, RHFSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import TableForm from 'tables/table';

import toast from 'utils/ToastNotistack';
import request from 'utils/request';
import { parseAddressFromObject } from 'utils';
import CancelTransactionRequestDropdownSection from 'components/sections/CancelTransactionRequestNumber';
import Loader from 'components/Loader';

const CreateNewCancelStoGrn = () => {
  const [reqSTOGRNData, setReqSTOGRNData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const [response, setResponse] = useState([]);
  const [pending, setPending] = useState(false);

  const navigate = useNavigate();
  const methods = useForm({
    resolver: yupResolver(Yup.object().shape({})),
    defaultValues: {},
    mode: 'all'
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMasterMakerLov());
    dispatch(getDropdownProjects());
  }, [dispatch]);
  const { masterMakerLovs } = useMasterMakerLov();
  const fetchTransactionType = (value, type) => {
    const res = value && value.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : undefined;
  };

  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const transactionTypeId = fetchTransactionType(transactionTypeData, 'CANCELSTOGRN');
  const companyId = fetchTransactionType(transactionTypeData, 'COMPANY');
  useEffect(() => {
    if (companyId) dispatch(getOrganizationStores({ organizationType: companyId }));
  }, [dispatch, companyId]);
  const { handleSubmit, setValue } = methods;

  const toProjectSiteStore = response?.find((item) => item.quantity > 0)?.organization_store;
  const toProjectSiteStoreData = useMemo(() => (toProjectSiteStore ? [toProjectSiteStore] : []), [toProjectSiteStore]);

  const onBack = () => {
    setShowAdd(!showAdd);
    setReqSTOGRNData([]);
    setResponse(undefined);
    navigate('/cancel-sto-grn');
  };

  const subColumns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'material.name'
      },
      {
        Header: 'Code',
        accessor: 'material.code'
      },
      {
        Header: 'Quantity',
        accessor: 'quantity'
      },
      {
        Header: 'UOM',
        accessor: 'uom.name'
      }
    ],
    []
  );

  const createSerialNumbers = (arr) => {
    if (arr && arr.length > 0) {
      let resp = arr.map((val) => val.serialNumber);
      return resp;
    } else return [];
  };

  const getIds = (arr) => {
    let rspArr = [];
    arr && arr.length > 0 && arr.map((vl) => rspArr.push(vl.id));
    return rspArr;
  };

  const makeRequest = () => {
    const stockLedgerArray = [];
    reqSTOGRNData.map((stockData) => {
      stockLedgerArray.push({
        transactionTypeId: transactionTypeId,
        projectId: stockData.projectId,
        requestNumber: stockData.referenceDocumentNumber,
        stoRefDocNo: stockData.requestNumber,
        organizationId: stockData?.organizationId,
        storeId: stockData?.storeId,
        storeLocationId: stockData?.storeLocationId,
        otherStoreId: stockData?.otherStoreId,
        otherStoreLocationId: stockData?.otherStoreLocationId,
        materialId: stockData.materialId,
        uomId: stockData.uomId,
        quantity: -stockData.quantity,
        rate: stockData.rate,
        value: stockData.value,
        tax: stockData.tax,
        serialNumber: createSerialNumbers(stockData.material_serial_numbers)
      });
    });
    const stockLedgerDetails = {
      transactionTypeId: transactionTypeId,
      transactionCreatedAt: reqSTOGRNData[0]?.createdAt,
      stoGrnIds: getIds(reqSTOGRNData),
      stoGrnLedgerDetailId: reqSTOGRNData?.[0]?.stock_ledger_detail?.id,
      stock_ledgers: stockLedgerArray
    };
    return stockLedgerDetails;
  };

  const onFormSubmit = async () => {
    setPending(true);
    const req = makeRequest();
    const resp = await request('/cancel-sto-grn-transaction-create', { method: 'POST', body: req, timeoutOverride: 120000 });

    if (!resp.success) {
      toast(resp?.error?.message || 'Operation failed. Please try again!', { variant: 'error' });
      setPending(false);
      return;
    }

    const data = resp.data?.data ?? {};
    const referenceDocumentNumber = data.referenceDocumentNumber || data[0]?.referenceDocumentNumber;

    toast(
      referenceDocumentNumber
        ? `Transaction cancelled with reference number: ${referenceDocumentNumber}`
        : 'Transaction cancelled successfully!',
      {
        variant: 'success',
        autoHideDuration: 10000
      }
    );

    setPending(false);
    navigate('/stock-ledger');
  };

  const selectBox = (name, label, menus, req, onChange) => {
    return (
      <Stack>
        <RHFSelectbox
          name={name}
          label={label}
          {...(typeof onChange === 'function' && { onChange: onChange })}
          InputLabelProps={{ shrink: true }}
          menus={menus}
          disable
          {...(req && { required: true })}
        />
      </Stack>
    );
  };

  useEffect(() => {
    if (!response?.length) return;
    setReqSTOGRNData(response);
  }, [response]);

  useEffect(() => {
    if (!toProjectSiteStoreData?.length) return;
    setValue('toStoreId', toProjectSiteStoreData?.[0]?.id);
  }, [setValue, toProjectSiteStoreData]);

  const toAddress = parseAddressFromObject(toProjectSiteStore);

  return (
    <>
      {pending && <Loader />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Cancel STOGRN(Stock Transfer Order GRN)'} sx={{ mb: 2 }}>
          <CancelTransactionRequestDropdownSection
            type="stockLedger"
            transactionType="STOGRN"
            fromStoreLabel="Company Store"
            fromStoreType="COMPANY"
            showFromStoreAddress
            setFromStoreId={() => {}}
            disableAll={!!response?.length}
            setReqData={setResponse}
          />

          {response && response.length > 0 && (
            <>
              <Grid container spacing={4} alignItems="center" sx={{ mb: 2, mt: 1 }}>
                <Grid item md={3} xl={3}>
                  {selectBox('toStoreId', 'To Company Store', toProjectSiteStoreData, true)}
                </Grid>
                <Grid item md={6} xl={6}>
                  <Typography>Address: </Typography>
                  <Typography mt={2}>{toAddress}</Typography>
                </Grid>
              </Grid>
              <TableForm
                title={'Cancel STO'}
                hideHeader
                hidePagination
                data={reqSTOGRNData}
                count={reqSTOGRNData.length}
                columns={subColumns}
                hideActions={true}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
                pageIndex={pageIndex}
                pageSize={pageSize}
              />
              <Grid item md={12} xl={2} sx={{ mt: 4 }}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                  <Button onClick={onBack} size="small" variant="outlined" color="primary">
                    Back
                  </Button>
                  <Button disabled={pending} size="small" type="submit" variant="contained" color="primary">
                    Reverse
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </MainCard>
      </FormProvider>
    </>
  );
};

export default CreateNewCancelStoGrn;
