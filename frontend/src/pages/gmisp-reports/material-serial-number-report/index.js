import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, Button } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMasterMakerLov } from '../../extra-pages/master-maker-lov/useMasterMakerLov';
import { useOrganizationStore } from '../../extra-pages/organization-store/useOrganizationStore';
import request from 'utils/request';
import { FormProvider, RHFSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import {
  getCompanyStoreLocations,
  getDropdownMaterial,
  getDropdownOrganization,
  getDropdownProjects,
  getMasterMakerLov,
  getOrganizationStores
} from 'store/actions';
import toast from 'utils/ToastNotistack';
import { fetchTransactionType } from 'utils';
import { useMaterial } from 'pages/extra-pages/material/useMaterial';
import { useOrganizationStoreLocation } from 'pages/extra-pages/organization-store-location/useOrganizationStoreLocation';

const filterStoreLocations = (obj, selectedCompany) => {
  if (!obj) return null;
  return obj.filter((item) => item.organizationStoreId === selectedCompany);
};

const MaterialSerialNumberReport = () => {
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        storeId: Validations.store,
        materialId: Validations.material,
        storeLocationId: Validations.storeLocationId,
        movementTypeId: Validations.movementType
      })
    ),
    defaultValues: {},
    mode: 'all'
  });
  const { handleSubmit } = methods;

  const [selectedCompany, setSelectedCompany] = useState();

  const { masterMakerLovs } = useMasterMakerLov();
  const { organizationStores } = useOrganizationStore();
  const { materialDropdown } = useMaterial();
  const { companyStoreLocations } = useOrganizationStoreLocation();

  const materialData = materialDropdown?.materialDropdownObject;
  const orgTypeData = masterMakerLovs.masterMakerLovsObject?.rows;
  const storeData = organizationStores?.organizationStoreObject?.rows;
  const companyStoreLocationsData = companyStoreLocations?.companyStoreLocationsObject?.rows;
  const transactionTypesData = orgTypeData?.filter((item) => item.master_maker.name === 'TRANSACTION TYPE');

  const onFormSubmit = async (formValues) => {
    const response = await request('/my-api-endpoint', { method: 'POST', body: formValues });
    if (!response.success) {
      toast(response?.error?.message || 'Something wrong happened!', { variant: 'error' });
      return;
    }
  };

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getMasterMakerLov());
    dispatch(getDropdownMaterial());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDropdownOrganization(fetchTransactionType(orgTypeData, 'CONTRACTOR')));
    dispatch(getOrganizationStores({ organizationType: fetchTransactionType(orgTypeData, 'COMPANY') }));
    dispatch(getCompanyStoreLocations({ organizationType: fetchTransactionType(orgTypeData, 'COMPANY') }));
  }, [dispatch, orgTypeData]);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Material Serial Number Report'} sx={{ mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                name="storeId"
                label="Store"
                menus={storeData}
                onChange={(event) => setSelectedCompany(event?.target?.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox name="materialId" label="Material" menus={materialData} InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                name="storeLocationId"
                label="Store Location"
                menus={filterStoreLocations(companyStoreLocationsData, selectedCompany)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                name="movementTypeId"
                label="Movement Type"
                menus={transactionTypesData}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid container spacing={2} alignItems={'end'} sx={{ mt: 2 }}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                <Button type="submit" size="small" variant="contained" color="primary">
                  Proceed
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
    </>
  );
};

export default MaterialSerialNumberReport;
