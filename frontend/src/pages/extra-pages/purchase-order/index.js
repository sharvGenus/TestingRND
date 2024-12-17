import { Button, Grid, IconButton, Modal, Tooltip } from '@mui/material';
import { CloseCircleOutlined } from '@ant-design/icons';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizations } from '../organization/useOrganizations';
import ViewPurchaseOrder from './viewOrder';
import { usePurchaseOrder } from './usePurchaseOrder';
import TableForm from 'tables/table';
import MainCard from 'components/MainCard';
import usePagination from 'hooks/usePagination';
import { FormProvider, RHFSelectbox } from 'hook-form';
import { getMasterMakerLov, getOrganizationList, getOrganizationListSecond, plantCodeList, purchaseOrderList } from 'store/actions';
import { concateNameAndCode } from 'utils';

const Actions = ({ value, onView }) => {
  return (
    <div>
      <Tooltip title="View" placement="bottom">
        <IconButton color="secondary" onClick={() => onView(value)}>
          <VisibilityOutlinedIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

Actions.propTypes = {
  value: PropTypes.any,
  onView: PropTypes.func
};

const PurchaseOrder = () => {
  const dispatch = useDispatch();
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    dispatch(getMasterMakerLov());
  }, [dispatch]);
  const { masterMakerLovs } = useMasterMakerLov();
  const fetchTransactionType = (data, type) => {
    const res = data && data.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : null;
  };
  const orgTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const orgTypeSupplierId = fetchTransactionType(orgTypeData, 'SUPPLIER');
  const orgTypeCompanyId = fetchTransactionType(orgTypeData, 'COMPANY');

  useEffect(() => {
    dispatch(getOrganizationList(orgTypeSupplierId));
    dispatch(getOrganizationListSecond(orgTypeCompanyId));
  }, [dispatch, orgTypeCompanyId, orgTypeSupplierId]);

  const { organizationsList, organizationsListSecond } = useOrganizations();
  const supplierList = organizationsList?.organizationObject?.rows || [];
  const companyList = organizationsListSecond?.organizationObject?.rows || [];
  const organizationData = [...supplierList, ...companyList];

  const methods = useForm({
    resolver: yupResolver(Yup.object().shape({})),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit } = methods;

  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();

  // const openModalWithIndex = (index) => {
  //   setPreviewAction('view');
  //   setSelectedBlockIndex(index);
  // };

  const [contentToShow, setContentToShow] = useState(null);
  const [showDetails, setShowDetails] = useState(null);

  const columns = [
    {
      Header: 'Actions',
      accessor: 'actions'
    },
    {
      Header: 'PO Number',
      accessor: 'poNumber'
    },
    {
      Header: 'PO Date',
      accessor: 'poDate'
    },
    {
      Header: 'Revision Ref.',
      accessor: 'revisionReference'
    },
    {
      Header: 'Revision Date',
      accessor: 'revisionDate'
    }
  ];

  const selectBox = (name, label, menus, req, onChange) => {
    return (
      <RHFSelectbox
        name={name}
        label={label}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        {...(onChange && { onChange })}
        {...(req && { required: true })}
        // {...(view ? { disable: true } : update ? { disable: false } : {})}
      />
    );
  };

  const onView = (val) => {
    const value = JSON.parse(JSON.stringify(val));
    value.organization = organization;
    setContentToShow(value);
    setShowDetails(true);
  };

  const closeModal = () => {
    setShowDetails(false);
  };

  const addActions = (arr) => {
    let lst = [];
    arr.map((val) => {
      lst.push({
        ...val,
        actions: <Actions value={val} onView={onView} />
      });
    });
    return lst;
  };

  const closeCss = { cursor: 'pointer', fontSize: 20 };

  const getFilterData = (arr, id) => {
    const filteredArr = arr.filter((val) => val.id === id);
    return filteredArr[0];
  };

  const onSelectedOrg = (e) => {
    if (e?.target?.value) {
      const code = getFilterData(organizationData, e?.target?.value).integrationId;
      dispatch(plantCodeList(code));
    }
  };

  const { plantCodeData, purchaseOrderData } = usePurchaseOrder();
  const plantCodeListData = plantCodeData?.plantCodeDetails?.rows || [];
  const purchaseOrderListData = purchaseOrderData?.purchaseOrderDetails?.poDataArr || [];

  const addIdName = (arr) => {
    let list = [];
    arr.map((val) => {
      list.push({
        id: val?.plantCode,
        name: val?.plantCode
      });
    });
    return list;
  };

  const onFormSubmit = (values) => {
    dispatch(
      purchaseOrderList({
        organizationIntegrationId: getFilterData(organizationData, values.organizationId).integrationId,
        plantCode: values.plantCode
      })
    );
    setOrganization(getFilterData(organizationData, values.organizationId));
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Purchase Order'} sx={{ mb: 2 }}>
          <Grid container spacing={4} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={3}>
              {selectBox('organizationId', 'Supplier/Company', concateNameAndCode(organizationData), true, onSelectedOrg)}
            </Grid>
            <Grid item xs={3}>
              {selectBox('plantCode', 'Plant Code', addIdName(plantCodeListData), true)}
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Button variant="contained" type="submit">
                Proceed
              </Button>
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
      <TableForm
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        pageIndex={pageIndex}
        pageSize={pageSize}
        columns={columns}
        data={addActions(purchaseOrderListData)}
        count={purchaseOrderListData.length}
        hideActions
        hideAddButton
      />
      <Modal open={showDetails} onClose={closeModal} aria-labelledby="modal-modal-title">
        <MainCard sx={{ width: 1150 }} modal darkTitle content={false}>
          <Grid container spacing={2} alignItems={'center'} sx={{ mt: -2 }}>
            <Grid item xs={5.7} ml={3}>
              <h2>{'Purchase Order Details'}</h2>
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
              <CloseCircleOutlined onClick={closeModal} style={closeCss} />
            </Grid>
          </Grid>
          <Grid m={2}>
            <ViewPurchaseOrder data={contentToShow} />
          </Grid>
        </MainCard>
      </Modal>
    </>
  );
};

export default PurchaseOrder;
