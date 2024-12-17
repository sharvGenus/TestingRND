import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Stack, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import request from '../../../utils/request';
import { useGaa } from '../gaa/useGaa';
import { useProjects } from '../project/useProjects';
import { FormProvider, RHFSelectTags, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { getDropdownProjects, getProjectAreaLevels } from 'store/actions';
import toast from 'utils/ToastNotistack';

const EditWorkAreaAllocation = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const hierarchyData = [
    {
      id: 'gaa',
      name: 'Gaa'
    },
    {
      id: 'network',
      name: 'Network'
    }
  ];
  const [selectedProject, setSelectedProject] = useState();
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  const [userWorkAreaData, setUserWorkAreaData] = useState({});
  const getUpdatedWorkArea = useCallback(async () => {
    const response = await request('/get-work-area-by-userId', {
      method: 'GET',
      query: { userId }
    });
    if (response.success) {
      return setUserWorkAreaData(response?.data?.data);
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    toast(error || 'Unable to fetch data. Please contact admin', { variant: 'error' });
  }, [userId]);

  useEffect(() => {
    userId && getUpdatedWorkArea();
  }, [dispatch, userId, getUpdatedWorkArea]);

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.other,
        hierarchyType: Validations.other,
        gaaLevelEntryId0: Validations.areaLevel
      })
    ),
    defaultValues: {
      gaaLevelEntryId0: []
    },
    mode: 'all'
  });

  const { handleSubmit, setValue, watch } = methods;
  const valuesWatch = watch();

  useEffect(() => {
    setValue('dateFrom', new Date().toISOString().slice(0, 10));
  }, [setValue]);

  useEffect(() => {
    if (selectedProject) {
      dispatch(getProjectAreaLevels(selectedProject));
    }
  }, [dispatch, selectedProject]);
  const { projectAreaLevels } = useGaa();
  const { hierarchyLevelsData } = useMemo(
    () => ({
      hierarchyLevelsData: projectAreaLevels?.projectAreaLevelsObject || []
    }),
    [projectAreaLevels]
  );
  const [userForms, setUserForms] = useState([]);
  useEffect(() => {
    setValue('hierarchyType', userWorkAreaData?.hierarchyType);
    setSelectedHierarchy(userWorkAreaData?.hierarchyType);
    setValue('projectId', userWorkAreaData?.projectId);
    setSelectedProject(userWorkAreaData?.projectId);
    setValue('user', userWorkAreaData?.user?.name);
    setValue('forms', userWorkAreaData?.forms);
    userWorkAreaData?.forms?.length &&
      setUserForms(
        userWorkAreaData?.forms?.map((item) => ({
          name: item,
          id: item
        }))
      );
    let result;
    let lengthUntilIsMapped = 0;
    hierarchyLevelsData[0]?.gaaLevels.map((item) => {
      if (item.isMapped === '1') {
        return;
      }
      lengthUntilIsMapped++;
    });

    if (userWorkAreaData?.hierarchyType === 'network') {
      result = userWorkAreaData?.hierarchy?.slice(lengthUntilIsMapped - 1);
    } else {
      result = userWorkAreaData?.hierarchy;
    }

    result?.map((item, index) => {
      const key = `gaaLevelEntryId${index}`;
      const value = item?.levelEntries;
      setValue(key, value);
      return item;
    });
  }, [userWorkAreaData, hierarchyLevelsData, setValue]);

  const navigate = useNavigate();
  const onFormSubmit = async (values) => {
    values = structuredClone(values);
    const suffixes = Object.keys(values)
      .filter((key) => key.startsWith('gaaLevelEntryId') && values[key].length > 0)
      .map((key) => parseInt(key.match(/-?\d+$/)[0]));
    if (suffixes.length > 0) {
      const largestSuffix = Math.max(...suffixes);
      values['gaaLevelEntryId'] = values[`gaaLevelEntryId${largestSuffix}`];
    }
    values.userId = [userId];
    values.isActive = 1;
    let response = await request('/work-area-assignment-create', { method: 'POST', body: values });
    if (response.success) {
      const successMessage = 'Work Area Updated Successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      navigate('/work-area-allocation');
    } else {
      toast(response?.error?.message || 'Something went wrong', { variant: 'error' });
    }
  };

  const selectBox = (name, label, menus, req, onChange) => {
    return (
      <Stack>
        <RHFSelectbox
          name={name}
          label={label}
          onChange={onChange}
          InputLabelProps={{ shrink: true }}
          menus={menus}
          {...(req && { required: true })}
        />
      </Stack>
    );
  };

  const txtBox = (name, label, type, defaultValue, req, shrink = true) => {
    return (
      <RHFTextField
        name={name}
        disabled={name == 'user' || name == 'forms' ? true : false}
        type={type}
        label={label}
        InputLabelProps={{ shrink: shrink }}
        {...(req && { required: true })}
        defaultValue={defaultValue}
      />
    );
  };

  const handleProjectId = (e) => {
    setSelectedProject(e?.target?.value);
  };

  const handleHierarchyId = (e) => {
    Object.keys(methods.getValues()).forEach((key) => {
      if (key.startsWith('gaaLevelEntryId')) {
        methods.setValue(key, []);
      }
    });
    setSelectedHierarchy(e?.target?.value);
  };

  const lastGaa = hierarchyLevelsData[0]?.gaaLevels.find((item) => item.isMapped === '1');

  const filteredMenus = useCallback(
    (gaa, index) => {
      const prev = index - 1;
      return valuesWatch?.[`gaaLevelEntryId${prev}`]
        ? gaa.gaa_level_entries.filter((x) => valuesWatch?.[`gaaLevelEntryId${prev}`]?.includes(x?.parentId))
        : gaa.gaa_level_entries;
    },
    [valuesWatch]
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
            ? nextGaa?.gaa_level_entries?.filter((x) => currentValues?.[curKey]?.includes(x?.parentId))
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

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard
          title={
            <Grid container xl={12} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid item>
                <Typography variant="h4">Edit Work Area Allocation</Typography>
              </Grid>
              <Grid item sx={{ display: 'flex', gap: 2 }}>
                <Button size="small" variant="outlined" color="primary" onClick={() => navigate('/work-area-allocation')}>
                  Back
                </Button>
                <Button size="small" type="submit" variant="contained" color="primary">
                  Update
                </Button>
              </Grid>
            </Grid>
          }
          sx={{ mb: 2 }}
        >
          <>
            <Grid container spacing={4}>
              <Grid item md={3} xl={3}>
                {txtBox('user', 'User', 'text')}
              </Grid>
              <Grid item md={10} xl={10}>
                <RHFSelectTags name="forms" label="Forms Assigned" menus={userForms} disable />
              </Grid>
              <Grid item md={3} xl={3}>
                {selectBox('projectId', 'Project', projectData, true, handleProjectId)}
              </Grid>
              <Grid item md={3} xl={3}>
                {selectBox('hierarchyType', 'Hierarchy Type', hierarchyData, true, handleHierarchyId)}
              </Grid>
              <Grid item md={3} xl={3}>
                {txtBox('dateFrom', 'Applicable Date', 'date')}
              </Grid>
              {selectedProject ? (
                selectedHierarchy === 'gaa' ? (
                  hierarchyLevelsData && hierarchyLevelsData[0]?.gaaLevels?.length ? (
                    hierarchyLevelsData[0]?.gaaLevels.map((gaa, index) => {
                      return (
                        <Grid item md={10} xl={10} key={gaa.id}>
                          <RHFSelectTags
                            name={`gaaLevelEntryId${index}`}
                            label={gaa.name}
                            onChange={handleChangeDropDown.bind(null, index, hierarchyLevelsData[0]?.gaaLevels, valuesWatch, true)}
                            menus={filteredMenus(gaa, index)}
                            disable={index !== 0 && !valuesWatch?.[`gaaLevelEntryId${index - 1}`]?.length}
                          />
                        </Grid>
                      );
                    })
                  ) : (
                    <></>
                  )
                ) : selectedHierarchy === 'network' ? (
                  <>
                    {lastGaa && (
                      <Grid item md={10} xl={10} key={lastGaa.id}>
                        <RHFSelectTags
                          name="gaaLevelEntryId0"
                          label={lastGaa.name}
                          menus={lastGaa.gaa_level_entries}
                          onChange={handleChangeDropDown.bind(null, 0, hierarchyLevelsData[1].networkLevels, valuesWatch, false)}
                        />
                      </Grid>
                    )}
                    {hierarchyLevelsData && hierarchyLevelsData[1]?.networkLevels?.length ? (
                      hierarchyLevelsData[1].networkLevels.map((network, index) => (
                        <Grid item md={10} xl={10} key={network.id}>
                          <RHFSelectTags
                            name={`gaaLevelEntryId${index + 1}`}
                            label={network.name}
                            menus={filteredMenus(network, index + 1)}
                            onChange={handleChangeDropDown.bind(null, index + 1, hierarchyLevelsData[1].networkLevels, valuesWatch, false)}
                            disable={!valuesWatch?.[`gaaLevelEntryId${index}`]?.length}
                          />
                        </Grid>
                      ))
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
            </Grid>
          </>
        </MainCard>
      </FormProvider>
    </>
  );
};

EditWorkAreaAllocation.propTypes = {
  projectData: PropTypes.array,
  organizationNameData: PropTypes.array,
  organizationTypeData: PropTypes.array,
  setRefresh: PropTypes.func,
  setSelectedOrganizationType: PropTypes.func,
  setSelectedOrganizationName: PropTypes.func,
  setSelectedOrganizationNameOuter: PropTypes.func,
  setSelectedProject: PropTypes.func,
  selectedHierarchy: PropTypes.string,
  selectedProject: PropTypes.string,
  setSelectedRecords: PropTypes.func,
  selectedRecord: PropTypes.array,
  setSelectedUser: PropTypes.func,
  setSelectedHierarchy: PropTypes.func,
  showAdd: PropTypes.bool,
  userData: PropTypes.array,
  setShowAdd: PropTypes.func
};

export default EditWorkAreaAllocation;
