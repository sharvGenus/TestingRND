import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Stack, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import request from '../../../utils/request';
import { useGaa } from '../gaa/useGaa';
import { FormProvider, RHFSelectTags, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { getProjectAreaLevels } from 'store/actions';
import toast from 'utils/ToastNotistack';
import useAuth from 'hooks/useAuth';

const NewWorkAreaAllocation = (props) => {
  const dispatch = useDispatch();
  const {
    setRefresh,
    projectData,
    selectedProject,
    organizationNameData,
    organizationTypeData,
    selectedRecord,
    setSelectedRecords,
    setSelectedOrganizationType,
    setSelectedOrganizationName,
    setSelectedOrganizationNameOuter,
    setSelectedProject,
    selectedHierarchy,
    setSelectedHierarchy,
    showAdd,
    setShowAdd,
    masterId,
    isAccessData,
    isAdmin
  } = props;
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.other,
        hierarchyType: Validations.other,
        oraganizationType: Validations.other,
        oraganizationId: Validations.other
      })
    ),
    defaultValues: {
      gaaLevelEntryId0: []
    },
    mode: 'all'
  });

  const { handleSubmit, setValue, watch } = methods;
  const valuesWatch = watch();
  const { user } = useAuth();
  const [userAssignedGaaNetworkData, setUserAssingedGaaNetworkData] = useState(null);
  const getUpdatedGaaNetworkArea = useCallback(async () => {
    if (user?.id) {
      const userId = user?.id;
      if (userId && userId !== '577b8900-b333-42d0-b7fb-347abc3f0b5c') {
        const response = await request('/get-gaanetwork-userId', {
          method: 'GET',
          query: { userId }
        });
        if (response?.success) {
          return setUserAssingedGaaNetworkData(response?.data?.data);
        }
        const error = response.error && response.error.message ? response.error.message : response.error;
        toast(error || 'Unable to fetch data. Please contact admin', { variant: 'error' });
      }
    }
  }, [user]);

  useEffect(() => {
    getUpdatedGaaNetworkArea();
  }, [dispatch, getUpdatedGaaNetworkArea]);

  useEffect(() => {
    setValue('dateFrom', new Date().toISOString().slice(0, 10));
  }, [setValue, showAdd]);

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

  const handleBack = () => {
    setSelectedOrganizationName();
    setSelectedOrganizationNameOuter(null);
    setSelectedRecords([]);
    setSelectedHierarchy();
    setSelectedOrganizationType();
    methods.reset();
    setShowAdd(false);
  };

  useEffect(() => {
    if (userAssignedGaaNetworkData) {
      setValue('hierarchyType', userAssignedGaaNetworkData?.hierarchyType);
      setSelectedHierarchy(userAssignedGaaNetworkData?.hierarchyType);
      setValue('projectId', userAssignedGaaNetworkData?.projectId);
      setSelectedProject(userAssignedGaaNetworkData?.projectId);
      let result;
      let lengthUntilIsMapped = 0;
      hierarchyLevelsData[0]?.gaaLevels.map((item) => {
        if (item.isMapped === '1') {
          return;
        }
        lengthUntilIsMapped++;
      });

      if (userAssignedGaaNetworkData?.hierarchyType === 'network') {
        result = userAssignedGaaNetworkData?.hierarchy?.slice(lengthUntilIsMapped - 1);
      } else {
        result = userAssignedGaaNetworkData?.hierarchy;
      }

      result?.map((item, index) => {
        const key = `gaaLevelEntryId${index}`;
        const value = item?.levelEntries;
        setValue(key, value);
        return item;
      });
    }
  }, [showAdd, userAssignedGaaNetworkData, hierarchyLevelsData, setValue, setSelectedHierarchy, setSelectedProject, projectData]);

  const hierarchyData =
    userAssignedGaaNetworkData?.hierarchyType === 'network'
      ? [
          {
            id: 'network',
            name: 'Network'
          }
        ]
      : [
          {
            id: 'gaa',
            name: 'Gaa'
          }
          // disabled network
          // {
          //   id: 'network',
          //   name: 'Network'
          // }
        ];

  const onFormSubmit = async (values) => {
    values = structuredClone(values);
    const suffixes = Object.keys(values)
      .filter((key) => key.startsWith('gaaLevelEntryId') && values[key].length > 0)
      .map((key) => parseInt(key.match(/-?\d+$/)[0]));
    if (suffixes.length > 0) {
      const largestSuffix = Math.max(...suffixes);
      values['gaaLevelEntryId'] = values[`gaaLevelEntryId${largestSuffix}`];
    }
    const { gaaLevelEntryId } = values;

    const lovArray = [...(gaaLevelEntryId || []).map((id) => ({ id, isAccess: gaaLevelEntryId.length > 0 }))];

    const body = {
      dateForm: values.dateFrom,
      lovArray,
      roleId: null,
      projectId: values.projectId,
      hierarchyType: values.hierarchyType,
      masterId: masterId || 'd4dc5b2c-8c9c-4bd9-93e3-f9f3d42f5cc7',
      userId: selectedRecord
    };

    try {
      if (selectedRecord?.length) {
        const response = await request('/govern-user-rows', { method: 'POST', body });
        if (response.success) {
          const successMessage = 'GAA & Network Area Allocated Successfully!';
          toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
          setRefresh();
          handleBack();
          delete values['oraganizationId'];
          delete values['organizationType'];
          delete values['oraganizationIds'];
          delete values['organizationTypes'];
          delete values['userSelected'];
        }
      } else {
        toast('Please select atleast one user.', { variant: 'error' });
      }
    } catch (error) {
      toast('An error occurred. Please try again.', { variant: 'error' });
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
        disabled={true}
        name={name}
        type={type}
        label={label}
        InputLabelProps={{ shrink: shrink }}
        {...(req && { required: true })}
        defaultValue={defaultValue}
      />
    );
  };

  const handleOrganizationTypeId = (e) => {
    setSelectedOrganizationType(e?.target?.value);
  };

  const handleOrganizationId = (e) => {
    setSelectedOrganizationName(e?.target?.value);
  };

  const handleOrganizationIdOuter = (e) => {
    setSelectedOrganizationNameOuter(e?.target?.value);
  };

  const handleProjectId = (e) => {
    setSelectedProject(e?.target?.value);
  };

  const handleHierarchyId = (e) => {
    Object.keys(methods.getValues()).forEach((key) => {
      if (key.startsWith('gaaLevelEntryId')) {
        const previousValue = methods.getValues()[key];
        methods.setValue(key, previousValue ? previousValue : []);
      }
    });
    setSelectedHierarchy(e?.target?.value);
  };

  const addArea = () => {
    setShowAdd(true);
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
  const isDisabled = (hierarchyRanks, hierarachyNames, index, type) => {
    if (userAssignedGaaNetworkData === null) {
      if (type === true) {
        return index !== 0 && !valuesWatch?.[`gaaLevelEntryId${index - 1}`]?.length;
      } else {
        return index !== 0 && !valuesWatch?.[`gaaLevelEntryId${index}`]?.length;
      }
    } else {
      const levelRank = userAssignedGaaNetworkData?.levelRank;
      if (levelRank !== undefined) {
        if (type === true) {
          return hierarchyRanks <= levelRank;
        } else {
          if (hierarachyNames === userAssignedGaaNetworkData?.levelName) {
            return hierarchyRanks <= levelRank;
          } else {
            return null;
          }
        }
      }
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard
          title={
            <Grid container xl={12} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid item>
                <Typography variant="h4">GAA & Network Area Allocation</Typography>
              </Grid>
              {!showAdd ? (
                <Grid item sx={{ display: 'flex' }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={addArea}
                    disabled={isAccessData || isAdmin === '577b8900-b333-42d0-b7fb-347abc3f0b5c' ? false : true}
                  >
                    Assign New Area
                  </Button>
                </Grid>
              ) : (
                <Grid item sx={{ display: 'flex', gap: 2 }}>
                  <Button size="small" variant="outlined" color="primary" onClick={handleBack}>
                    Back
                  </Button>
                  <Button size="small" type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                </Grid>
              )}
            </Grid>
          }
          sx={{ mb: 2 }}
        >
          {showAdd ? (
            <>
              <Grid container rowSpacing={2} columnSpacing={4}>
                <Grid item md={3} xl={3}>
                  {selectBox('projectId', 'Project', projectData, true, handleProjectId)}
                </Grid>
                <Grid item md={3} xl={3}>
                  {selectBox('hierarchyType', 'Hierarchy Type', hierarchyData, true, handleHierarchyId)}
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
                              disable={isDisabled(gaa.rank, gaa.name, index, true)}
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
                            disable={userAssignedGaaNetworkData?.hierarchyType === 'network' && userAssignedGaaNetworkData?.levelRank >= 1}
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
                              onChange={handleChangeDropDown.bind(
                                null,
                                index + 1,
                                hierarchyLevelsData[1].networkLevels,
                                valuesWatch,
                                false
                              )}
                              disable={isDisabled(network.rank, network.name, index)}
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
              <Grid container rowSpacing={2} columnSpacing={4} sx={{ mt: 2, pb: 2 }}>
                <Grid item md={3} xl={3}>
                  {selectBox('oraganizationType', 'Organization Type', organizationTypeData, true, handleOrganizationTypeId)}
                </Grid>
                <Grid item md={3} xl={3}>
                  {selectBox('oraganizationId', 'Organization Name', organizationNameData, true, handleOrganizationId)}
                </Grid>
                <Grid item md={3} xl={3}>
                  {txtBox('dateFrom', 'Allocation Date', 'date')}
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid container spacing={4}>
                <Grid item md={3} xl={3}>
                  {selectBox('oraganizationTypes', 'Organization Type', organizationTypeData, true, handleOrganizationTypeId)}
                </Grid>
                <Grid item md={3} xl={3}>
                  {selectBox('oraganizationIds', 'Organization Name', organizationNameData, true, handleOrganizationIdOuter)}
                </Grid>
              </Grid>
            </>
          )}
        </MainCard>
      </FormProvider>
    </>
  );
};

NewWorkAreaAllocation.propTypes = {
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
  setSelectedHierarchy: PropTypes.func,
  showAdd: PropTypes.bool,
  setShowAdd: PropTypes.func,
  masterId: PropTypes.string,
  isAccessData: PropTypes.object,
  isAdmin: PropTypes.string
};

export default NewWorkAreaAllocation;
