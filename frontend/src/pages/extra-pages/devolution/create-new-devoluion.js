import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Button, Grid, Typography } from '@mui/material';
import { useOrganizations } from '../organization/useOrganizations';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import { getDropdownOrganization, getDropdownProjects, getFormData, getLovsForMasterName, getOrganizationStores } from 'store/actions';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { useDefaultFormAttributes } from 'pages/form-configurator/useDefaultAttributes';
import request from 'utils/request';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import toast from 'utils/ToastNotistack';
import CircularLoader from 'components/CircularLoader';

const hierarchyData = [
  {
    id: 'gaa',
    name: 'GAA'
  }
];

const CreateNewDevolution = ({ setShowTable, setSerialDataArr }) => {
  const [lastArgs, setLastArgs] = useState(null);
  const [areaLevelsData, setAreaLevelsData] = useState(null);
  const [hierarchyType, setHierachyType] = useState(hierarchyData[0]?.id);
  const [loading, setLoading] = useState(false);
  const [accessRank, setAccessRank] = useState(-1);
  const [customerStoreData, setCustomerStoreData] = useState([]);
  const [customerAddress, setCustomerAddress] = useState('');

  const validationSchema = Yup.object().shape({
    projectId: Validations.other,
    formTypeId: Validations.formType,
    formId: Validations.form,
    customerId: Validations.other,
    customerStoreId: Validations.other,
    ...(areaLevelsData && {
      hierarchyType: Validations.required
    })
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      gaaLevelEntryId0: []
    },
    mode: 'all'
  });

  const { handleSubmit, watch, setValue } = methods;
  const [projectId, formTypeId, formId, fromDate, toDate, newSerialNoPrefix, fromNewSerialNo, toNewSerialNo] = watch([
    'projectId',
    'formTypeId',
    'formId',
    'fromDate',
    'toDate',
    'newSerialNoPrefix',
    'fromNewSerialNo',
    'toNewSerialNo'
  ]);

  const { masterMakerOrgType } = useMasterMakerLov();
  const formTypeData = masterMakerOrgType?.masterObject;

  const projectOptions = useProjects()?.projectsDropdown?.projectsDropdownObject;
  const { forms } = useDefaultFormAttributes();
  const formsList = forms?.formDataObject?.rows || [];

  const { organizationsDropdown } = useOrganizations();
  const { organizationStores } = useOrganizationStore();
  const customerData = organizationsDropdown?.organizationDropdownObject || [];
  const customerStores = organizationStores?.organizationStoreObject?.rows || [];

  const txtBox = (name, label, type, defaultValue, req, shrink = true) => {
    return (
      <RHFTextField
        name={name}
        disabled={false}
        type={type}
        label={label}
        InputLabelProps={{ shrink: shrink }}
        {...(req && { required: true })}
        defaultValue={defaultValue}
      />
    );
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDropdownOrganization('e9206924-c5cb-454e-af1e-124d8179299a')); //customer
    dispatch(getOrganizationStores({ organizationType: 'e9206924-c5cb-454e-af1e-124d8179299a' }));
  }, [dispatch]);

  const onSubmit = useCallback(
    async (values) => {
      let newLevelFilter = {};
      let errorFlag = false;
      if (areaLevelsData) {
        for (let i = areaLevelsData?.length - 1; i >= 0; i--) {
          if (values[`gaaLevelEntryId${i}`]?.length) {
            newLevelFilter[`${areaLevelsData[i].columnName}`] = values[`gaaLevelEntryId${i}`];
            break;
          }
        }
        if (!values['gaaLevelEntryId0']?.length) {
          methods.setError('gaaLevelEntryId0', { message: 'This field is required' }, { shouldFocus: true });
          errorFlag = true;
        }
        for (let i = 1; i < areaLevelsData.length; i++) {
          const { rank } = areaLevelsData[i];
          if (rank <= accessRank && !values[`gaaLevelEntryId${i}`]?.length) {
            methods.setError(`gaaLevelEntryId${i}`, { message: 'This field is required' }, { shouldFocus: true });
            errorFlag = true;
          }
        }
      }
      if (errorFlag) return;
      const payLoad = {
        projectId,
        formId,
        gaaLevelFilter: newLevelFilter,
        forMaterialPopup: true,
        ...(fromDate && { fromDate }),
        ...(toDate && { toDate }),
        ...(newSerialNoPrefix && { newSerialNoPrefix }),
        ...(fromNewSerialNo && { fromNewSerialNo }),
        ...(toNewSerialNo && { toNewSerialNo })
      };

      if (!projectId?.length || JSON.stringify(payLoad) === JSON.stringify(lastArgs)) return;
      setLastArgs(payLoad);
      setLoading(true);
      const response = await request('/devolution-form-data', { method: 'POST', timeoutOverride: 20 * 60000, body: payLoad });
      if (response.success) {
        let { rows, oldSerialNo } = response.data.data;
        setSerialDataArr(rows, oldSerialNo);
        setShowTable({
          projectId,
          formId,
          gaaHierarchy: newLevelFilter,
          customerId: values.customerId,
          customerStoreId: values.customerStoreId
        });
        setLoading(false);
      } else {
        setLoading(false);
        toast(response?.error?.message);
      }
    },
    [
      areaLevelsData,
      projectId,
      formId,
      setShowTable,
      fromDate,
      setSerialDataArr,
      toDate,
      lastArgs,
      methods,
      accessRank,
      newSerialNoPrefix,
      fromNewSerialNo,
      toNewSerialNo
    ]
  );

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getLovsForMasterName('FORM_TYPES'));
  }, [dispatch, projectId]);

  useEffect(() => {
    if (!projectId || !formTypeId) {
      return;
    }
    dispatch(getFormData({ projectId, typeId: formTypeId }));
  }, [dispatch, formTypeId, projectId]);

  const getProjectAreaLevels = useCallback(async () => {
    setLoading(true);
    const response = await request('/area-project-level', { method: 'GET', params: formId, query: { formId, sort: ['rank', 'ASC'] } });
    if (response.success) {
      const { data, accessRank: accessRankData } = response.data;
      setAccessRank(accessRankData);
      if (data) {
        setAreaLevelsData(data[0]?.gaaLevels);
      } else {
        setAreaLevelsData(null);
      }
    }
    setLoading(false);
  }, [formId]);

  useEffect(() => {
    formId && getProjectAreaLevels();
  }, [formId, getProjectAreaLevels]);

  const filteredMenus = useCallback(
    (gaa, index) => {
      const prev = index - 1;
      return watch()?.[`gaaLevelEntryId${prev}`]
        ? gaa.gaa_level_entries.filter((x) => watch()?.[`gaaLevelEntryId${prev}`]?.includes(x?.parentId))
        : gaa.gaa_level_entries;
    },
    [watch]
  );

  const handleChangeDropDown = useCallback(
    (index, hLevelData, currentValues, isFixedLength, values) => {
      currentValues = structuredClone(currentValues);
      currentValues[`gaaLevelEntryId${index}`] = values;
      let i = index;
      while (i < (isFixedLength ? hLevelData.length - 1 : hLevelData.length)) {
        const nextKey = `gaaLevelEntryId${i + 1}`;
        const curKey = `gaaLevelEntryId${i}`;
        const nextGaa = hLevelData[i + 1];
        const nextMenus =
          currentValues?.[curKey] && nextGaa?.gaa_level_entries
            ? nextGaa?.gaa_level_entries?.filter((x) => currentValues?.[curKey] === x?.parentId)
            : nextGaa?.gaa_level_entries || [];
        const nextValue =
          (Array.isArray(currentValues[nextKey]) && currentValues[nextKey]?.filter((x) => nextMenus.some((y) => y.id === x))) || [];
        setValue(nextKey, nextValue);
        currentValues[nextKey] = nextValue;
        i += 1;
      }
    },
    [setValue]
  );

  const onStoreSelected = (e) => {
    const respSData = e?.target?.row;
    const cityDetails = respSData?.cities ? respSData?.cities : respSData?.city;
    const addressdata = respSData?.registeredOfficeAddress ? respSData?.registeredOfficeAddress : respSData?.address;
    const pincode = respSData?.registeredOfficePincode ? respSData?.registeredOfficePincode : respSData?.pinCode;
    setCustomerAddress(
      `${addressdata}, ${cityDetails?.name}, ${cityDetails?.state?.name}, ${cityDetails?.state?.country?.name} ${
        pincode ? ',' + pincode : ''
      }`
    );
  };

  return (
    <>
      {loading && <CircularLoader />}
      <MainCard title="Create Devolution">
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4} mb={3}>
            <Grid item md={3} xl={3}>
              <RHFSelectbox
                name="projectId"
                label="Project"
                menus={projectOptions || []}
                required
                onChange={() => {
                  setValue('formTypeId', '');
                  setValue('formId', '');
                }}
              />
            </Grid>
            <Grid item md={3} xl={3}>
              <RHFSelectbox name="formTypeId" label="Form Type" menus={formTypeData} required onChange={() => setValue('formId', '')} />
            </Grid>
            <Grid item md={3} xl={3}>
              <RHFSelectbox name="formId" label="Form Name" menus={formsList || []} required />
            </Grid>
            <Grid item md={3} xl={3}>
              <RHFSelectbox
                name="hierarchyType"
                label="Hierarchy Type"
                menus={hierarchyData}
                required={false}
                onChange={(e) => setHierachyType(e?.target?.value)}
                defaultValue={hierarchyData[0].id}
              />
            </Grid>
            {hierarchyType === 'gaa' &&
              formId &&
              areaLevelsData?.length > 0 &&
              areaLevelsData?.map((item, index) => {
                return (
                  <Grid item md={3} xl={3} key={item.id}>
                    <RHFSelectbox
                      required={index === 0 || item.rank <= accessRank}
                      showHelperText={false}
                      name={`gaaLevelEntryId${index}`}
                      label={item.name}
                      onChange={handleChangeDropDown.bind(null, index, areaLevelsData, watch(), true)}
                      menus={filteredMenus(item, index)}
                      disable={index !== 0 && item.rank > accessRank && !watch()?.[`gaaLevelEntryId${index - 1}`]?.length}
                      allowClear
                    />
                  </Grid>
                );
              })}
            <Grid item md={12} mt={-4}></Grid>
            <Grid item md={3} xl={3}>
              <RHFSelectbox
                name="customerId"
                label="Customer"
                menus={customerData}
                required
                onChange={(e) => {
                  let selectedStores = customerStores.filter((v) => v.organizationId === e?.target?.value);
                  setCustomerStoreData(selectedStores);
                }}
              />
            </Grid>
            <Grid item md={3} xl={3}>
              <RHFSelectbox name="customerStoreId" label="Customer Store" menus={customerStoreData} onChange={onStoreSelected} required />
            </Grid>
            {customerAddress !== '' && (
              <Grid item md={6} xl={6}>
                <Typography>Customer Store Address: </Typography>
                <Typography mt={2}>{customerAddress}</Typography>
              </Grid>
            )}
            <Grid item md={12} mt={-4}></Grid>
            <Grid item md={3} xl={3}>
              {txtBox('fromDate', 'Date From', 'date')}
            </Grid>
            <Grid item md={3} xl={3}>
              {txtBox('toDate', 'Date To', 'date')}
            </Grid>
            <Grid item md={12} mt={-4}></Grid>
            <Grid item md={3}>
              {txtBox('newSerialNoPrefix', 'New Serial No. Prefix', 'text')}
            </Grid>
            <Grid item md={3}>
              {txtBox('fromNewSerialNo', 'From New Serial No.', 'number')}
            </Grid>
            <Grid item md={3}>
              {txtBox('toNewSerialNo', 'To New Serial No.', 'number')}
            </Grid>
            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
              <Button disabled={loading} type="submit" size="small" variant="contained" color="primary">
                Proceed
              </Button>
            </Grid>
          </Grid>
        </FormProvider>
      </MainCard>
    </>
  );
};

CreateNewDevolution.propTypes = {
  setShowTable: PropTypes.func,
  setSerialDataArr: PropTypes.func
};

export default CreateNewDevolution;
