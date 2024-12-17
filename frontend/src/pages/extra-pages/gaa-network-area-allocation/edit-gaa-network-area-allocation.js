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
import useAuth from 'hooks/useAuth';

const EditWorkAreaAllocation = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const [selectedProject, setSelectedProject] = useState();
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  const [userGaaNetworkdata, setUserGaaNetworkdata] = useState({});
  const getUpdatedGaaNetworkArea = useCallback(async () => {
    const response = await request('/get-gaanetwork-userId', {
      method: 'GET',
      query: { userId }
    });
    if (response.success) {
      return setUserGaaNetworkdata(response?.data?.data);
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    toast(error || 'Unable to fetch data. Please contact admin', { variant: 'error' });
  }, [userId]);

  useEffect(() => {
    userId && getUpdatedGaaNetworkArea();
  }, [dispatch, userId, getUpdatedGaaNetworkArea]);

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

  const { user } = useAuth();
  const [userLoggedInGaaNetworkData, setUserLoggedInGaaNetworkData] = useState(null);
  const fetchUserDetailsLoggedIn = useCallback(async () => {
    if (user?.id) {
      const userLoggedInId = user?.id;
      if (userLoggedInId && userLoggedInId !== '577b8900-b333-42d0-b7fb-347abc3f0b5c') {
        const response = await request('/get-gaanetwork-userId', {
          method: 'GET',
          query: { userId: userLoggedInId }
        });
        if (response?.success) {
          return setUserLoggedInGaaNetworkData(response?.data?.data);
        }
        const error = response.error && response.error.message ? response.error.message : response.error;
        toast(error || 'Unable to fetch data. Please contact admin', { variant: 'error' });
      }
    }
  }, [user]);

  useEffect(() => {
    fetchUserDetailsLoggedIn();
  }, [dispatch, fetchUserDetailsLoggedIn]);

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

  useEffect(() => {
    setValue('hierarchyType', userGaaNetworkdata?.hierarchyType);
    setSelectedHierarchy(userGaaNetworkdata?.hierarchyType);
    setValue('projectId', userGaaNetworkdata?.projectId);
    setSelectedProject(userGaaNetworkdata?.projectId);
    setValue('user', userGaaNetworkdata?.user?.name);
    let result;
    let lengthUntilIsMapped = 0;
    hierarchyLevelsData[0]?.gaaLevels.map((item) => {
      if (item.isMapped === '1') {
        return;
      }
      lengthUntilIsMapped++;
    });

    if (userGaaNetworkdata?.hierarchyType === 'network') {
      result = userGaaNetworkdata?.hierarchy?.slice(lengthUntilIsMapped - 1);
    } else {
      result = userGaaNetworkdata?.hierarchy;
    }

    result?.map((item, index) => {
      const key = `gaaLevelEntryId${index}`;
      const value = item?.levelEntries;
      setValue(key, value);
      return item;
    });
  }, [userGaaNetworkdata, hierarchyLevelsData, setValue]);

  const hierarchyData =
    userLoggedInGaaNetworkData?.hierarchyType === 'network'
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
    const { gaaLevelEntryId } = values;

    const lovArray = [...(gaaLevelEntryId || []).map((id) => ({ id, isAccess: gaaLevelEntryId.length > 0 }))];

    const body = {
      dateForm: values.dateFrom,
      lovArray,
      roleId: null,
      projectId: values.projectId,
      hierarchyType: values.hierarchyType,
      masterId: 'd4dc5b2c-8c9c-4bd9-93e3-f9f3d42f5cc7',
      userId: [userId]
    };

    try {
      const response = await request('/govern-user-rows', { method: 'POST', body });
      if (response.success) {
        const successMessage = 'GAA & Network Area Updated Successfully!';
        toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
        navigate('/gaa-network-area-allocation');
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
        name={name}
        disabled={name == 'user' ? true : false}
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
    if (
      userLoggedInGaaNetworkData?.hierarchyType === 'gaa' &&
      userGaaNetworkdata?.hierarchyType === 'network' &&
      e?.target?.value === 'gaa'
    ) {
      toast('Go to Assign New Area to Give GAA Level Access Rights for this User.', { variant: 'error' });
      setSelectedHierarchy((prev) => prev);
    } else {
      setSelectedHierarchy(e?.target?.value);
    }
    Object.keys(methods.getValues()).forEach((key) => {
      if (key.startsWith('gaaLevelEntryId')) {
        const previousValue = methods.getValues()[key];
        methods.setValue(key, previousValue ? previousValue : []);
      }
    });
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
    if (user?.id && user?.id === '577b8900-b333-42d0-b7fb-347abc3f0b5c') {
      if (type === true) {
        return index !== 0 && !valuesWatch?.[`gaaLevelEntryId${index - 1}`]?.length;
      } else {
        return index !== 0 && !valuesWatch?.[`gaaLevelEntryId${index}`]?.length;
      }
    } else {
      const levelRank = userLoggedInGaaNetworkData?.levelRank;
      if (levelRank !== undefined) {
        if (type === true) {
          return hierarchyRanks <= levelRank;
        } else {
          if (hierarachyNames === userLoggedInGaaNetworkData?.levelName) {
            return hierarchyRanks <= levelRank;
          } else {
            return null;
          }
        }
      }
    }
  };

  hierarchyLevelsData[0]?.gaaLevels.map((gaa, index) => {
    return (
      <Grid item md={10} xl={10} key={gaa.id}>
        <RHFSelectTags
          name={`gaaLevelEntryId${index}`}
          label={gaa.name}
          onChange={handleChangeDropDown.bind(null, index, hierarchyLevelsData[0]?.gaaLevels, valuesWatch, true)}
          menus={filteredMenus(gaa, index)}
          disable={user?.id && isDisabled(gaa.name, index, true)}
        />
      </Grid>
    );
  });

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard
          title={
            <Grid container xl={12} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid item>
                <Typography variant="h4">Edit GAA & Network Area Allocation</Typography>
              </Grid>
              <Grid item sx={{ display: 'flex', gap: 2 }}>
                <Button size="small" variant="outlined" color="primary" onClick={() => navigate('/gaa-network-area-allocation')}>
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
                            disable={user?.id && isDisabled(gaa.rank, gaa.name, index, true)}
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
                          disable={userLoggedInGaaNetworkData?.hierarchyType === 'network' && userLoggedInGaaNetworkData?.levelRank >= 1}
                        />
                      </Grid>
                    )}
                    {hierarchyLevelsData && hierarchyLevelsData[1]?.networkLevels?.length ? (
                      hierarchyLevelsData[1].networkLevels.map((network, index) => {
                        return (
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
                              disable={user?.id && isDisabled(network.rank, network.name, index)}
                            />
                          </Grid>
                        );
                      })
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
