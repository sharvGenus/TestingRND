import SearchIcon from '@mui/icons-material/Search';
import { Button, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useOrganizationStore } from '../../pages/extra-pages/organization-store/useOrganizationStore';
import { useProjects } from '../../pages/extra-pages/project/useProjects';
import { useStockLedger } from '../../pages/extra-pages/stock-ledger/useStockLedger';
import { useMasterMakerLov } from '../../pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { FormProvider, RHFSelectbox } from 'hook-form';
import {
  fetchRequestDetails,
  getDetailsByRefNo,
  getDetailsByRefNoThird,
  getDropdownProjects,
  getMasterMakerLov,
  getOrganizationStores,
  getOrganizationStoresSecond,
  getOrganizations,
  getOrganizationsLocationByParent
} from 'store/actions';
import { concateNameAndCode, fetchTransactionType, groupByRequisitionNumberForDropdown, parseAddressFromObject } from 'utils';
import { useOrganizations } from 'pages/extra-pages/organization/useOrganizations';
import { useRequest } from 'pages/receipts/mrf-receipt/useRequest';

const RequestDropdownSection = ({
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
  showBranchAlso = false,
  withSerial = false,
  getFromOtherStore = false
}) => {
  const methods = useForm({
    defaultValues: {},
    mode: 'all'
  });
  const dispatch = useDispatch();

  const { watch, setValue } = methods;

  const dropdownFields = watch(['projectId', 'fromStoreId', 'requisitionNumberId', ...(showToStoreDropdown ? ['toStoreId'] : [])]);
  // const [projectId, fromStoreId, requisitionNumberId, toStoreId] = dropdownFields;
  const [projectId, fromStoreId, toStoreId] = dropdownFields;
  const isAnyFieldEmpty = Object.values(dropdownFields).some((fieldValue) => !fieldValue);

  const { projectsDropdown } = useProjects();
  const { organizationStores, organizationStoresSecond } = useOrganizationStore();
  const { masterMakerLovs } = useMasterMakerLov();
  const { refData, refDataThird } = useStockLedger();

  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const fromOrganizationType = fetchTransactionType(transactionTypeData, fromStoreType);
  const toOrganizationType = fetchTransactionType(transactionTypeData, toStoreType);
  const transactionTypeId = fetchTransactionType(transactionTypeData, transactionType);
  const companyId = fetchTransactionType(transactionTypeData, 'COMPANY');
  const [fromStoreDData, setFromStoreData] = useState([]);

  const { transactionRequest } = useRequest();

  const requestsList = useMemo(
    () => transactionRequest?.requestDetails?.rows?.filter((item) => item.fromStoreId === fromStoreId),
    [fromStoreId, transactionRequest?.requestDetails?.rows]
  );

  const referenceData = withSerial ? refDataThird?.refDataThirdObject?.rows : refData?.refDataObject?.rows;

  const stockLedgerList = useMemo(() => referenceData, [referenceData]);

  const groupedRequestsList =
    type === 'stockLedger' ? groupByRequisitionNumberForDropdown(stockLedgerList) : groupByRequisitionNumberForDropdown(requestsList);
  // const response = type === 'stockLedger' ? stockLedgerList : requestsList;
  const { organizations, organizationsLocByParent } = useOrganizations();
  const fromStoreData = organizationStores?.organizationStoreObject?.rows || [];
  const toStoreData = organizationStoresSecond?.organizationStoreObject?.rows || [];
  const projectData = projectsDropdown?.projectsDropdownObject || [];
  const fromAddress = parseAddressFromObject(fromStoreData.find((item) => item.id === fromStoreId)) || '';
  const toAddress = parseAddressFromObject(toStoreData.find((item) => item.id === toStoreId)) || '';
  const [selectedRequestDetails, setSelectedRequestDetails] = useState([]);
  const orgBranchData = organizationsLocByParent?.organizationObject?.rows || [];
  const orgData = organizations.organizationObject?.rows || [];

  const resetContents = useCallback(
    (stage) => {
      if (stage === 'projectId') {
        setValue('fromOrganizationId', null);
        setValue('fromOrganizationBranchId', null);
        setValue('fromStoreId', null);
        setValue('requisitionNumberId', null);
      } else if (stage === 'fromOrganizationId') {
        setValue('fromOrganizationBranchId', null);
        setValue('fromStoreId', null);
        setValue('requisitionNumberId', null);
      } else if (stage === 'fromOrganizationBranchId') {
        setValue('fromStoreId', null);
        setValue('requisitionNumberId', null);
      } else if (stage === 'fromStoreId') {
        setValue('requisitionNumberId', null);
      }
    },
    [setValue]
  );

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

    // const referenceDocumentNumber = groupedRequestsList.find((item) => item.id === requisitionNumberId)?.name;
    // const filteredResponse = response?.filter((item) => item.referenceDocumentNumber === referenceDocumentNumber);

    setReqData(selectedRequestDetails);
  };

  const getResponses = (e) => {
    if (e?.target) {
      setSelectedRequestDetails(e?.target?.row?.data);
    }
  };

  useEffect(() => {
    if (!toOrganizationType) return;
    dispatch(getOrganizationStoresSecond({ organizationType: toOrganizationType }));
  }, [dispatch, toOrganizationType]);

  useEffect(() => {
    if (!fromOrganizationType) return;
    dispatch(getOrganizationStores({ organizationType: fromOrganizationType }));
  }, [dispatch, fromOrganizationType]);

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getMasterMakerLov());
  }, [dispatch]);

  useEffect(() => {
    if (projectId && showBranchAlso) resetContents('projectId');
  }, [projectId, showBranchAlso, resetContents]);

  useEffect(() => {
    if (transactionTypeId && fromStoreId && projectId) {
      if (type === 'stockLedger') {
        withSerial
          ? dispatch(
              getDetailsByRefNoThird({
                ...(transactionType === 'PTP' && { otherProjectId: projectId }),
                ...(transactionType !== 'PTP' && { projectId: projectId }),
                ...(!ignoreStoreId && !getFromOtherStore && { storeId: fromStoreId }),
                ...(!ignoreStoreId && getFromOtherStore && { otherStoreId: fromStoreId }),
                isCancelled: '0',
                isProcessed: '0',
                transactionTypeId,
                sortBy: 'updatedAt',
                sortOrder: 'DESC'
              })
            )
          : dispatch(
              getDetailsByRefNo({
                ...(transactionType === 'PTP' && { otherProjectId: projectId }),
                ...(transactionType !== 'PTP' && { projectId: projectId }),
                ...(!ignoreStoreId && !getFromOtherStore && { storeId: fromStoreId }),
                ...(!ignoreStoreId && getFromOtherStore && { otherStoreId: fromStoreId }),
                isCancelled: '0',
                isProcessed: '0',
                transactionTypeId,
                sortBy: 'updatedAt',
                sortOrder: 'DESC'
              })
            );
      } else {
        dispatch(
          fetchRequestDetails({
            projectId,
            ...(!ignoreStoreId && { fromStoreId: fromStoreId }),
            ...(approvedOnly && { approvalStatus: '1' }),
            status: '1',
            isProcessed: '0',
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
    ignoreStoreId,
    approvedOnly,
    getFromOtherStore,
    projectId,
    transactionType,
    transactionTypeId,
    type,
    withSerial
  ]);

  useEffect(() => {
    if (companyId) dispatch(getOrganizations({ transactionTypeId: companyId }));
  }, [dispatch, companyId]);

  const onFromOrgSelected = (e) => {
    if (e?.target?.value) {
      dispatch(getOrganizationsLocationByParent({ params: companyId + '/' + e?.target?.value }));
      let toProjectNStoreData = fromStoreData.filter((vl) => vl.organizationId === e?.target?.value);
      setFromStoreData(toProjectNStoreData);
    }
    resetContents('fromOrganizationId');
  };

  const onFromOrgBranchSelected = (e) => {
    if (e?.target?.value) {
      let toProjectNStoreData = fromStoreData.filter((vl) => vl.organizationId === e?.target?.value);
      setFromStoreData(toProjectNStoreData);
    }
    resetContents('fromOrganizationBranchId');
  };

  const showOrgStoreName = (arr) => {
    let newArr = [];
    arr &&
      arr.length > 0 &&
      arr.map((vl) => {
        newArr.push({
          ...vl,
          name: vl?.name + ' - ' + vl?.data?.[0]?.organization_store?.name
        });
      });
    return newArr;
  };

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={4} mb={3}>
        <Grid item xs={12} md={3} xl={3}>
          <RHFSelectbox InputLabelProps={{ shrink: true }} name="projectId" label="Project" menus={projectData} disable={disableAll} />
        </Grid>
        {showBranchAlso && (
          <>
            <Grid item xs={12} md={3} xl={3}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="fromOrganizationId"
                label={'Organization'}
                menus={concateNameAndCode(orgData)}
                disable={disableAll}
                onChange={onFromOrgSelected}
              />
            </Grid>
            <Grid item xs={12} md={3} xl={3}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="fromOrganizationBranchId"
                label={'Organization Branch'}
                menus={concateNameAndCode(orgBranchData)}
                disable={disableAll}
                onChange={onFromOrgBranchSelected}
              />
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12} md={3} xl={3}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="fromStoreId"
                label={fromStoreLabel || 'From Store'}
                menus={fromStoreDData}
                disable={disableAll}
                onChange={() => {
                  resetContents('fromStoreId');
                }}
              />
            </Grid>
          </>
        )}
        {!showBranchAlso && (
          <Grid item xs={12} md={3} xl={3}>
            <RHFSelectbox
              InputLabelProps={{ shrink: true }}
              name="fromStoreId"
              label={fromStoreLabel || 'From Store'}
              menus={fromStoreData}
              disable={disableAll}
            />
          </Grid>
        )}

        {showFromStoreAddress && (
          <Grid item xs={12} md={6} xl={6}>
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
                menus={toStoreData}
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
        {showBranchAlso && <Grid item xs={12}></Grid>}
        <Grid item display="flex" xs={12} md={getFromOtherStore ? 6 : 3} xl={getFromOtherStore ? 6 : 3}>
          <RHFSelectbox
            InputLabelProps={{ shrink: true }}
            name="requisitionNumberId"
            label="Requisition Number"
            menus={getFromOtherStore ? showOrgStoreName(groupedRequestsList) : groupedRequestsList}
            disable={disableAll}
            onChange={getResponses}
          />
          <Button disabled={disableAll || isAnyFieldEmpty} sx={{ mt: 3 }} onClick={searchData}>
            <SearchIcon />
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

RequestDropdownSection.propTypes = {
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
  showBranchAlso: PropTypes.bool,
  withSerial: PropTypes.bool,
  getFromOtherStore: PropTypes.bool
};

export default RequestDropdownSection;
