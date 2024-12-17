import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Grid, Button, Stack, Divider } from '@mui/material';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useProjects } from '../project/useProjects';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import { useOrganizations } from '../organization/useOrganizations';
import { useApprovers } from './useApprover';
import DragDropTable from './DragDropTable';
import MainApproverSection from './main-approver-section';
import { FormProvider, RHFSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import {
  getApprovers,
  getDropdownOrganization,
  getDropdownOrganizationStores,
  getDropdownProjects,
  getLovsForMasterName,
  getOrganizationsLocationByParent
} from 'store/actions';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import ConfirmModal from 'components/modal/ConfirmModal';
import { concateNameAndCode } from 'utils';

const TableForm = ({
  columns,
  data,
  count,
  onClick,
  title,
  setUpdateData,
  setShowUpdate,
  handleRowDelete,
  hideEditAction,
  handleRowUpdate,
  showUpdate
}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DragDropTable
            data={data}
            onClick={onClick}
            count={count}
            title={title}
            handleRowUpdate={handleRowUpdate}
            columns={columns}
            setShowUpdate={setShowUpdate}
            handleRowDelete={handleRowDelete}
            hideEditAction={hideEditAction}
            setUpdateData={setUpdateData}
            showUpdate={showUpdate}
          />
        </Grid>
      </Grid>
    </DndProvider>
  );
};

TableForm.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  onClick: PropTypes.func,
  title: PropTypes.string,
  count: PropTypes.number,
  hideActions: PropTypes.bool,
  handleRowDelete: PropTypes.func,
  handleRowUpdate: PropTypes.func,
  hideEditAction: PropTypes.bool,
  setShowUpdate: PropTypes.bool,
  setUpdateData: PropTypes.func,
  showUpdate: PropTypes.bool
};

const CreateNewApprover = (props) => {
  const { setAddApprover, addApprover } = props;
  const navigate = useNavigate();
  const [disableAll, setDisableAll] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showAdd, setShowAdd] = useState(true);
  const [values, setValues] = useState({});
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const [organizationId, setOrganizationId] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [storeData, setStoreData] = useState([]);
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        storeId: Validations.requiredWithLabel('Store'),
        oraganizationNameId: Validations.requiredWithLabel('Organization Name'),
        projectId: Validations.project,
        transactionTypeId: Validations.transaction
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;

  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        Header: 'Level',
        accessor: 'rank'
      },
      {
        Header: 'Organization Name',
        accessor: 'organization.name'
      },
      {
        Header: 'Organization Store',
        accessor: 'organization_store.name'
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
      },
      {
        Header: 'Created On',
        accessor: 'createdAt'
      },
      {
        Header: 'Updated On',
        accessor: 'updatedAt'
      }
    ],
    []
  );

  useEffect(() => {
    dispatch(getLovsForMasterName('TRANSACTION TYPE'));
    dispatch(getDropdownProjects());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDropdownOrganization('420e7b13-25fd-4d23-9959-af1c07c7e94b'));
    dispatch(getDropdownOrganizationStores('420e7b13-25fd-4d23-9959-af1c07c7e94b'));
  }, [dispatch]);

  const {
    masterMakerOrgType: { masterObject: transactionData }
  } = useMasterMakerLov();
  const {
    projectsDropdown: { projectsDropdownObject: projectData }
  } = useProjects();

  const {
    organizationsDropdown: { organizationDropdownObject: organizationNameData },
    organizationsLocByParent: {
      organizationObject: { rows: organizationBranchData }
    }
  } = useOrganizations();

  const {
    organizationStoresDropdown: {
      organizationStoreDropdownObject: { rows: organizationData = [] }
    }
  } = useOrganizationStore();

  useEffect(() => {
    if (organizationId) {
      setStoreData(organizationData?.filter((x) => x?.organizationId === organizationId));
    }
  }, [organizationId, organizationData]);

  const { approvers } = useApprovers();
  const { data, count } = useMemo(
    () => ({
      data: approvers.approversObject?.rows || [],
      count: approvers.approversObject?.count || 0,
      isLoading: approvers.loading || false
    }),
    [approvers]
  );

  const onInitialFormSubmit = (iniValues) => {
    // TODO add StoreId
    dispatch(getApprovers({ ...iniValues, sortBy: 'rank', sortOrder: 'ASC' }));
    setValues(iniValues);
    setDisableAll(true);
  };

  const updateRowdata = async () => {
    const payload = {
      projectId: updateData[0]?.projectId,
      transactionTypeId: updateData[0]?.transactionTypeId,
      organizationTypeId: '420e7b13-25fd-4d23-9959-af1c07c7e94b',
      organizationNameId: updateData[0]?.organizationNameId,
      storeId: updateData[0]?.storeId,
      approvers: updateData
    };

    const response = await request('/approver-update', { method: 'PUT', body: payload });

    if (response.success) {
      toast('Approver updated successfully!', { variant: 'success', autoHideDuration: 10000 });
      // TODO add StoreId
      dispatch(getApprovers({ ...values, sortBy: 'rank', sortOrder: 'ASC' }));
      setDisableAll(true);
      setShowAdd(true);
      setShowUpdate(false);
      navigate('/approver-master');
    } else {
      toast(response.error?.message || 'Update failed. Please try again.', { variant: 'error' });
    }
  };

  const onBack = () => {
    setDisableAll(false);
    setShowAdd(true);
    setShowUpdate(false);
    setAddApprover(!addApprover);
  };
  const onAdd = () => {
    setShowAdd(!showAdd);
  };

  const selectBox = (name, label, menus, req, onChange) => {
    return (
      <Stack>
        <RHFSelectbox
          name={name}
          label={label}
          InputLabelProps={{ shrink: true }}
          menus={menus}
          {...(disableAll && { disable: true })}
          {...(typeof onChange === 'function' && { onChange })}
          {...(req && { required: true })}
        />
      </Stack>
    );
  };

  const onOrganizationSelected = (e) => {
    if (e?.target?.value) {
      setOrganizationId(e?.target?.value);
      setParentId(e?.target?.value);
      setValue('oraganizationBranchId', '');
      setValue('storeId', '');
      const targetRow = e?.target?.row;
      dispatch(getOrganizationsLocationByParent({ params: targetRow?.organization_type?.id + '/' + targetRow?.id }));
      dispatch(getDropdownOrganizationStores(targetRow?.organization_type?.id));
    }
  };

  const onBranchSelected = (e) => {
    if (e?.target?.value) {
      setValue('storeId', '');
      const targetRow = e?.target?.row;
      setOrganizationId(e?.target?.value);
      dispatch(getDropdownOrganizationStores(targetRow?.organization_type?.id));
    }
  };

  const handleRowDelete = (val) => {
    setDeleteId(val);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    const response = await request('/approver-delete', { method: 'DELETE', params: deleteId });
    if (response.success) {
      // TODO add StoreId
      dispatch(getApprovers({ ...values, sortBy: 'rank', sortOrder: 'ASC' }));
      setDisableAll(true);
      setOpenDeleteModal(false);
    } else {
      toast(response?.error?.message);
    }
  };
  return (
    <>
      <FormProvider methods={methods}>
        <MainCard title="Approver">
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('projectId', 'Project', projectData, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'transactionTypeId',
                'Transaction Type',
                transactionData.filter((v) => ['MRF', 'MRR', 'STR', 'CONSUMPTIONREQUEST'].includes(v?.name?.toUpperCase())),
                true
              )}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('oraganizationNameId', 'Organization', concateNameAndCode(organizationNameData), true, onOrganizationSelected)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'oraganizationBranchId',
                'Organization Branch',
                concateNameAndCode(organizationBranchData),
                false,
                onBranchSelected
              )}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('storeId', 'Store', storeData, true)}
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mt: 2 }}>
                <Button onClick={onBack} size="small" variant="outlined" color="primary">
                  Back
                </Button>
                {!disableAll && (
                  <Button onClick={handleSubmit(onInitialFormSubmit)} size="small" variant="contained" color="primary">
                    Proceed
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 3, mb: 3 }}>
            <Grid item md={12} xl={12}>
              <Divider />
            </Grid>
          </Grid>
          {!showAdd && (
            <MainApproverSection
              setDisableAll={setDisableAll}
              setShow={setShowAdd}
              formvalue={values}
              setShowUpdate={setShowUpdate}
              organizationId={parentId}
            />
          )}
          {disableAll && data && count > -1 && (
            <>
              <TableForm
                title="Approver"
                data={data}
                count={count}
                onClick={onAdd}
                columns={columns}
                handleRowDelete={handleRowDelete}
                hideEditAction={true}
                setShowUpdate={setShowUpdate}
                setUpdateData={setUpdateData}
                showUpdate={showUpdate}
              />
              {showUpdate && (
                <Grid item md={12} xl={2} sx={{ mt: 4 }}>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                    <Button onClick={handleSubmit(updateRowdata)} size="small" variant="contained" color="primary">
                      Update
                    </Button>
                  </Grid>
                </Grid>
              )}
              <ConfirmModal
                open={openDeleteModal}
                handleClose={() => setOpenDeleteModal(false)}
                handleConfirm={confirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete?"
                confirmBtnTitle="Delete"
              />
            </>
          )}
        </MainCard>
      </FormProvider>
    </>
  );
};

CreateNewApprover.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  updateData: PropTypes.object,
  setBasic: PropTypes.func,
  setAddApprover: PropTypes.func,
  addApprover: PropTypes.bool
};

export default CreateNewApprover;
