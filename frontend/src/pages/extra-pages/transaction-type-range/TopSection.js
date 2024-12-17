import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
  Button,
  Grid
  //  Stack
} from '@mui/material';

// third party
import * as Yup from 'yup';

// assets

// project import
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizations } from '../organization/useOrganizations';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import {
  getDropdownOrganization,
  getLovsForMasterName,
  getLovsForMasterNameSecond,
  getOrganizationStores,
  getOrganizationsLocationByParent
} from 'store/actions';
import request from 'utils/request';
import { concateNameAndCode } from 'utils';

function TopSection({ disableAll, onSubmit: handleSectionSubmit, data }) {
  const [disablePrefix, setDisablePrefix] = useState(false);
  const [orgStoreData, setOrgStoreData] = useState([]);
  const [orgBranchData, setOrgBranchData] = useState([]);
  const [orgId, setOrgId] = useState([]);
  const [organization, setOrganization] = useState([]);
  const [organizationType, setOrganizationType] = useState([]);
  const [organizationTypeId, setOrganizationTypeId] = useState(null);
  // const [branch, setBranch] = useState([]);
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        organizationId: Validations.organizationId,
        storeId: Validations.store,
        prefix: Validations.alphanumericWithAlphabetRequired('Prefix')
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  // const { setOrganizationId, setStoreId } = useTransactionTypeRangeContext();

  const { handleSubmit, setValue, clearErrors } = methods;

  // const [organizationId, storeId] = watch(['organizationId', 'storeId']);

  // useEffect(() => {
  //   setOrganizationId(organizationId);
  // }, [organizationId, setOrganizationId]);

  // useEffect(() => {
  //   setStoreId(storeId);
  // }, [setStoreId, storeId]);

  const dispatch = useDispatch();
  const {
    masterMakerOrgTypeSecond: { masterObject: organizationTypeData }
  } = useMasterMakerLov();
  const { organizationStores } = useOrganizationStore();
  const {
    organizationsDropdown: { organizationDropdownObject: organizationData },
    organizationsLocByParent
  } = useOrganizations();

  const { organizationBranchData } = useMemo(
    () => ({
      organizationBranchData: organizationsLocByParent?.organizationObject?.rows || [],
      isLoading: organizationsLocByParent.loading || false
    }),
    [organizationsLocByParent]
  );

  const storeData = organizationStores?.organizationStoreObject?.rows;

  useEffect(() => {
    if (organizationBranchData) setOrgBranchData(organizationBranchData);
  }, [organizationBranchData]);

  useEffect(() => {
    if (organizationTypeData) {
      const newData = organizationTypeData.filter((x) => ['COMPANY', 'CONTRACTOR'].includes(x?.name));
      setOrganizationType(newData);
    }
  }, [organizationTypeData]);

  const onFormSubmit = async (formValues) => {
    handleSectionSubmit(formValues);
  };

  useEffect(() => {
    if (storeData && storeData.length > 0) setOrgStoreData(storeData.filter((vl) => vl.organizationId === orgId));
  }, [storeData, orgId]);

  useEffect(() => {
    dispatch(getLovsForMasterName('TRANSACTION TYPE'));
    dispatch(getLovsForMasterNameSecond('ORGANIZATION TYPE'));
  }, [dispatch]);
  // useEffect(() => {
  //   if (!selectedOrganizationTypeId) return;
  //   dispatch(getOrganizationStores({ organizationType: selectedOrganizationTypeId }));
  // }, [combinedOrgData, dispatch, selectedOrganizationTypeId]);
  useEffect(() => {
    if (organizationTypeId) {
      dispatch(getDropdownOrganization(organizationTypeId));
    }
  }, [dispatch, organizationTypeId]);

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };
    if (data) {
      handleSetValues(data);
      if (data?.organization) {
        setValue('organizationTypeId', data?.organization?.organization_type?.name);
      }
      if (
        data.organization_store &&
        data.organization_store.organization &&
        data.organization_store.organization.parentId &&
        data.organization_store.organization.parentId !== null
      ) {
        setValue('org', data.organization.name);
        setValue('orgBranch', data.organization_store.organization.name);
        setValue('orgStore', data.organization_store.name);
      } else {
        setValue('org', data.organization.name);
        setValue('orgBranch', '');
        setValue('orgStore', data.organization_store.name);
      }
    }
  }, [data, setValue, dispatch]);

  const onorganizationTypeSelected = (e) => {
    if (e?.target?.value) {
      setValue('organizationId', '');
      setValue('branchId', '');
      setValue('storeId', '');
      setValue('prefix', '');
      setDisablePrefix(false);
      setOrganizationTypeId(e?.target?.value);
    }
  };

  const onorganizationSelected = (e) => {
    if (e?.target?.value) {
      let dat = e?.target?.row;
      setValue('branchId', '');
      setValue('storeId', '');
      setValue('prefix', '');
      setDisablePrefix(false);
      setOrgId(e?.target?.value);
      setOrganization(e?.target?.value);
      dispatch(getOrganizationsLocationByParent({ params: dat?.organization_type?.id + '/' + dat?.id }));
      dispatch(getOrganizationStores({ organizationType: dat?.organization_type?.id }));
    }
  };

  const onBranchSelected = (e) => {
    if (e?.target?.value) {
      setValue('storeId', '');
      setValue('prefix', '');
      let dat = e?.target?.row;
      setOrgId(e?.target?.value);
      dispatch(getOrganizationStores({ organizationType: dat?.organization_type?.id }));
    }
  };

  const onStoreSelected = async (e) => {
    if (e?.target?.value) {
      const strId = e?.target?.value;
      const respData = await request('/all-transaction-type-range-list', {
        method: 'GET',
        query: {
          pageSize: 1,
          pageIndex: 1,
          storeId: strId,
          organizationId: organization
        }
      });

      const receivedPrefix = respData?.data?.data?.rows?.[0]?.prefix;
      if (receivedPrefix) {
        setDisablePrefix(true);
        clearErrors();
        setValue('prefix', receivedPrefix);
      } else {
        setValue('prefix', '');
        setDisablePrefix(false);
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={3}>
          {data ? (
            <RHFTextField
              name="organizationTypeId"
              type="text"
              label="Organization Type"
              InputLabelProps={{ shrink: true }}
              disabled={disablePrefix || disableAll}
              required
            />
          ) : (
            <RHFSelectbox
              name="organizationTypeId"
              menus={organizationType}
              label="Organization Type"
              InputLabelProps={{ shrink: true }}
              onChange={onorganizationTypeSelected}
              disable={disableAll}
              required
            />
          )}
        </Grid>
        <Grid item xs={12} sm={3}>
          {data ? (
            <RHFTextField
              name="org"
              type="text"
              label="Organization"
              InputLabelProps={{ shrink: true }}
              disabled={disablePrefix || disableAll}
              required
            />
          ) : (
            <RHFSelectbox
              name="organizationId"
              menus={concateNameAndCode(organizationData)}
              label="Organization"
              InputLabelProps={{ shrink: true }}
              onChange={onorganizationSelected}
              disable={disableAll}
              required
            />
          )}
        </Grid>
        <Grid item xs={12} sm={3}>
          {data ? (
            <RHFTextField
              name="orgBranch"
              type="text"
              label="Organization Branch"
              InputLabelProps={{ shrink: true }}
              disabled={disablePrefix || disableAll}
            />
          ) : (
            <RHFSelectbox
              name="branchId"
              menus={concateNameAndCode(orgBranchData)}
              label="Organization Branch"
              InputLabelProps={{ shrink: true }}
              onChange={onBranchSelected}
              disable={disableAll}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={3}>
          {data ? (
            <RHFTextField
              name="orgStore"
              type="text"
              label="Store"
              InputLabelProps={{ shrink: true }}
              disabled={disablePrefix || disableAll}
              required
            />
          ) : (
            <RHFSelectbox
              name="storeId"
              label="Store"
              menus={concateNameAndCode(orgStoreData)}
              onChange={onStoreSelected}
              InputLabelProps={{ shrink: true }}
              disable={disableAll}
              required
            />
          )}
        </Grid>
        <Grid item xs={12} sm={3}>
          <RHFTextField
            name="prefix"
            type="text"
            label="Prefix"
            InputLabelProps={{ shrink: true }}
            disabled={disablePrefix || disableAll}
            required
          />
        </Grid>

        {!disableAll && (
          <Grid item xs={12} textAlign={'right'} mt={-2}>
            <Button sx={{ mt: 4.5 }} size="small" type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        )}
      </Grid>
    </FormProvider>
  );
}

TopSection.propTypes = {
  data: PropTypes.object,
  onSubmit: PropTypes.func,
  disableAll: PropTypes.bool
};

export default TopSection;
