import SearchIcon from '@mui/icons-material/Search';
import { Button, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useOrganizationStore } from '../../pages/extra-pages/organization-store/useOrganizationStore';
import { useProjects } from '../../pages/extra-pages/project/useProjects';
import { useStockLedger } from '../../pages/extra-pages/stock-ledger/useStockLedger';
import { useMasterMakerLov } from '../../pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import {
  fetchRequestDetails,
  getDetailsByRefNoThird,
  getDropdownProjects,
  getMasterMakerLov,
  getOrganizationStores,
  getOrganizationStoresSecond
} from 'store/actions';
import { fetchTransactionType, parseAddressFromObject } from 'utils';
import toast from 'utils/ToastNotistack';
import { useRequest } from 'pages/receipts/mrf-receipt/useRequest';

const CancelTransactionRequestDropdownSection = ({
  type = 'request',
  disableAll = false,
  setReqData,
  showToStoreDropdown = false,
  showFromStoreAddress = false,
  showToStoreAddress = false,
  setFromStoreId,
  ignoreStoreId = false,
  setToStoreId,
  setFromOrganizationId,
  setToOrganizationId,
  fromStoreLabel,
  toStoreLabel,
  fromStoreType, // example: 'COMPANY'
  toStoreType, // example: 'FIRM'
  transactionType,
  approvedOnly,
  getFilteredStore = false,
  setProjectId,
  showOrgType = false,
  getNegativeOnly = false
}) => {
  const methods = useForm({
    defaultValues: {},
    mode: 'all'
  });
  const dispatch = useDispatch();

  const { watch } = methods;

  const dropdownFields = watch(['projectId', 'fromStoreId', ...(showToStoreDropdown ? ['toStoreId'] : [])]);
  const [projectId, fromStoreId, toStoreId] = dropdownFields;
  const isAnyFieldEmpty = Object.values(dropdownFields).some((fieldValue) => !fieldValue);
  const [requestNumber, setRequestNumber] = useState(null);

  if (projectId && setProjectId) {
    setProjectId(projectId);
  }

  const { projectsDropdown } = useProjects();
  const { organizationStores, organizationStoresSecond } = useOrganizationStore();
  const { masterMakerLovs } = useMasterMakerLov();
  const { refDataThird } = useStockLedger();

  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const fromOrganizationType = fetchTransactionType(transactionTypeData, fromStoreType);
  const toOrganizationType = fetchTransactionType(transactionTypeData, toStoreType);
  const transactionTypeId = fetchTransactionType(transactionTypeData, transactionType);

  const { transactionRequest } = useRequest();

  const requestsList = useMemo(
    () =>
      transactionRequest?.requestDetails?.rows?.filter((item) =>
        (item.fromStoreId === transactionType) === 'STR' ? toStoreId : fromStoreId
      ),
    [fromStoreId, toStoreId, transactionType, transactionRequest?.requestDetails?.rows]
  );
  const requestsLoading = transactionRequest?.loading;

  const stockLedgerList = useMemo(() => refDataThird?.refDataThirdObject?.rows, [refDataThird?.refDataThirdObject?.rows]);
  const stockLedgersLoading = refDataThird?.loading;

  const response = type === 'stockLedger' ? stockLedgerList : requestsList;
  const responseLoading = type === 'stockLedger' ? stockLedgersLoading : requestsLoading;

  const fromStoreData = organizationStores?.organizationStoreObject?.rows || [];
  const toStoreData = organizationStoresSecond?.organizationStoreObject?.rows || [];
  const projectData = projectsDropdown?.projectsDropdownObject || [];
  const fromAddress = parseAddressFromObject(fromStoreData.find((item) => item.id === fromStoreId)) || '';
  const toAddress = parseAddressFromObject(toStoreData.find((item) => item.id === toStoreId)) || '';

  const searchData = () => {
    if (setFromOrganizationId) {
      const selectedfromStoreData = fromStoreData?.find((item) => item.id === fromStoreId);
      setFromOrganizationId(selectedfromStoreData?.organization?.parentId || selectedfromStoreData?.organization?.id);
    }

    if (setFromStoreId) {
      setFromStoreId(fromStoreId);
    }

    if (setToStoreId) {
      setToStoreId(toStoreId);
    }

    if (setToOrganizationId) {
      const selectedToStoreData = toStoreData?.find((item) => item.id === toStoreId);
      setToOrganizationId(selectedToStoreData?.organization?.parentId || selectedToStoreData?.organization?.id);
    }
    const filteredResponse = response?.filter((item) => item.referenceDocumentNumber === requestNumber) || [];

    if (filteredResponse.length === 0) {
      toast('No data!', { variant: 'error' });
      return;
    }

    if (filteredResponse.some((item) => item.isCancelled)) {
      toast('This requisition number is already cancelled!', { variant: 'error' });
      return;
    }

    if (filteredResponse.some((item) => item.isProcessed)) {
      toast('This requisition number is already processed!', { variant: 'error' });
      return;
    }

    if (filteredResponse.some((item) => !isNaN(item.status) && item.status !== '1')) {
      toast('This requisition number is already cancelled!', { variant: 'error' });
      return;
    }

    setReqData(filteredResponse);
  };

  useEffect(() => {
    if (!toOrganizationType) return;
    dispatch(getOrganizationStoresSecond({ organizationType: toOrganizationType }));
  }, [dispatch, toOrganizationType]);

  useEffect(() => {
    if (!fromOrganizationType) return;
    if (!showOrgType) dispatch(getOrganizationStores({ organizationType: fromOrganizationType }));
  }, [dispatch, fromOrganizationType, showOrgType]);

  const onOrgTypeSelected = (e) => {
    if (e?.target?.value) dispatch(getOrganizationStores({ organizationType: e?.target?.value }));
  };

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getMasterMakerLov());
  }, [dispatch]);

  useEffect(() => {
    if (transactionTypeId && fromStoreId && projectId && requestNumber) {
      if (type === 'stockLedger') {
        dispatch(
          getDetailsByRefNoThird({
            projectId: projectId,
            ...(!ignoreStoreId && { storeId: fromStoreId }),
            ...(getNegativeOnly && { getNegativeOnly: getNegativeOnly }),
            referenceDocumentNumber: requestNumber,
            transactionTypeId,
            sortBy: 'updatedAt',
            sortOrder: 'DESC'
          })
        );
      } else {
        dispatch(
          fetchRequestDetails({
            projectId,
            ...(!ignoreStoreId && { fromStoreId: transactionType === 'STR' ? toStoreId : fromStoreId }),
            ...(toStoreId && { toStoreId: transactionType === 'STR' ? fromStoreId : toStoreId }),
            ...(approvedOnly && { approvalStatus: '1' }),
            referenceDocumentNumber: requestNumber,
            transactionTypeId,
            sortBy: 'updatedAt',
            sortOrder: 'DESC'
          })
        );
      }
    }
  }, [
    dispatch,
    fromStoreId,
    toStoreId,
    ignoreStoreId,
    approvedOnly,
    transactionType,
    projectId,
    transactionTypeId,
    type,
    requestNumber,
    getNegativeOnly
  ]);

  const handleInput = (e) => {
    setRequestNumber(e?.target?.value.trim());
  };

  const orgTypeData = [
    {
      id: '420e7b13-25fd-4d23-9959-af1c07c7e94b',
      name: 'COMPANY'
    },
    {
      id: 'decb6c57-6d85-4f83-9cc2-50e0630003df',
      name: 'CONTRACTOR'
    }
  ];

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3} xl={3}>
          <RHFSelectbox InputLabelProps={{ shrink: true }} name="projectId" label="Project" menus={projectData} disable={disableAll} />
        </Grid>
        {showOrgType && (
          <Grid item xs={12} md={3} xl={3}>
            <RHFSelectbox
              InputLabelProps={{ shrink: true }}
              name="orgTypeId"
              label="Organization Type"
              menus={orgTypeData}
              disable={disableAll}
              onChange={onOrgTypeSelected}
            />
          </Grid>
        )}

        <Grid item xs={12} md={3} xl={3}>
          <RHFSelectbox
            InputLabelProps={{ shrink: true }}
            name="fromStoreId"
            label={fromStoreLabel || 'From Store'}
            menus={fromStoreData}
            disable={disableAll}
          />
        </Grid>

        {showFromStoreAddress && (
          <Grid item xs={12} md={showOrgType ? 3 : 6} xl={showOrgType ? 3 : 6}>
            <Typography>Address: </Typography>
            <Typography mt={2}>{fromAddress}</Typography>
          </Grid>
        )}

        {!showFromStoreAddress && showToStoreAddress && <Grid item xs={12} md={6} xl={6} />}

        {showToStoreDropdown && (
          <>
            <Grid item xs={12} md={3} xl={3}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="toStoreId"
                label={toStoreLabel || 'To Store'}
                menus={getFilteredStore ? toStoreData.filter((val) => val.id !== fromStoreId) : toStoreData}
                disable={disableAll}
              />
            </Grid>

            {showToStoreAddress && (
              <Grid item xs={12} md={!showFromStoreAddress ? 3 : 9} xl={!showFromStoreAddress ? 3 : 9}>
                <Typography>Address: </Typography>
                <Typography mt={2}>{toAddress}</Typography>
              </Grid>
            )}
          </>
        )}

        {!showFromStoreAddress && showToStoreAddress && <Grid item xs={12} md={6} xl={6} />}
        {showFromStoreAddress && showToStoreDropdown && !showToStoreAddress && <Grid item xs={12} md={9} xl={9} />}

        <Grid item display="flex" xs={12} md={3} xl={3}>
          <RHFTextField
            InputLabelProps={{ shrink: true }}
            name="requisitionNumberId"
            label="Requisition Number"
            handleChange={handleInput}
            disabled={disableAll}
          />
          <Button disabled={disableAll || isAnyFieldEmpty || responseLoading} sx={{ mt: 3 }} onClick={searchData}>
            <SearchIcon />
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

CancelTransactionRequestDropdownSection.propTypes = {
  reqData: PropTypes.object,
  setReqData: PropTypes.func,
  setFromOrganizationId: PropTypes.func,
  setFromStoreId: PropTypes.func,
  setToStoreId: PropTypes.func,
  setToOrganizationId: PropTypes.func,
  ignoreStoreId: PropTypes.bool,
  showToStoreDropdown: PropTypes.bool,
  showFromStoreAddress: PropTypes.bool,
  showToStoreAddress: PropTypes.bool,
  fromStoreType: PropTypes.string,
  toStoreType: PropTypes.string,
  fromStoreLabel: PropTypes.string,
  toStoreLabel: PropTypes.string,
  transactionType: PropTypes.string,
  type: PropTypes.string,
  disableAll: PropTypes.bool,
  approvedOnly: PropTypes.bool,
  getFilteredStore: PropTypes.bool,
  setProjectId: PropTypes.func,
  showOrgType: PropTypes.bool,
  getNegativeOnly: PropTypes.bool
};

export default CancelTransactionRequestDropdownSection;
