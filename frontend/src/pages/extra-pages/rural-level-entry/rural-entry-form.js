/* eslint-disable */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Grid, Stack } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import request from '../../../utils/request';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { getRuralLevelParents, getRuralProjects } from 'store/actions';
import toast from 'utils/ToastNotistack';
import { useRural } from '../rural/useRural';

const RuralLevelEntryForm = (props) => {
  const dispatch = useDispatch();
  const [selectedParent, setSelectedParent] = useState();
  const {
    data,
    view,
    update,
    setRefresh,
    selectedProject,
    setSelectedProject,
    setSelectedRuralId,
    refreshPagination,
    projectData,
    setSelectedParentId,
    user
  } = props;

  const statusMenudata =
    user?.id === '577b8900-b333-42d0-b7fb-347abc3f0b5c' || user?.id === '57436bed-c176-4625-96af-aaeec88cdc90'
      ? [
          {
            name: 'Approved',
            id: 'Approved'
          },
          {
            name: 'Unapproved',
            id: 'Unapproved'
          }
        ]
      : [
          {
            name: 'Unapproved',
            id: 'Unapproved'
          }
        ];

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.other,
        code: Validations.other,
        urbanHierarchyId: Validations.other,
        projectId: Validations.other,
        approvalStatus: Validations.other
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, getValues, clearErrors } = methods;

  const handleLevelBack = useCallback(() => {
    setRefresh();
    const formValues = getValues();
    methods.reset({
      name: '',
      code: '',
      projectId: formValues.projectId,
      urbanHierarchyId: formValues.urbanHierarchyId,
      approvalStatus: ''
    });
  }, [setRefresh, methods, getValues]);

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };
    if (!data) {
      handleLevelBack();
    }
    if (view || update) {
      setValue('urbanHierarchyId', data.urbanHierarchyId);
      setValue('projectId', data?.urban_hierarchy?.projectId);
      setValue('approvalStatus', data?.approvalStatus);
      handleSetValues(data);
    }
    clearErrors();
  }, [data, update, view, setValue, clearErrors, handleLevelBack]);

  useEffect(() => {
    if (selectedProject && user?.id) {
      const userId =
        user?.id === '577b8900-b333-42d0-b7fb-347abc3f0b5c' || user?.id === '57436bed-c176-4625-96af-aaeec88cdc90' ? '' : user?.id;
      dispatch(getRuralProjects({ projectId: selectedProject, userId: userId }));
    }
  }, [dispatch, selectedProject]);

  const { ruralProjects } = useRural();
  const { ruralData } = useMemo(
    () => ({
      ruralData: ruralProjects?.ruralProjectsObject?.rows || []
    }),
    [ruralProjects]
  );

  const onFormSubmit = async (values) => {
    let response;
    if (update) response = await request('/rural-level-entry-update', { method: 'PUT', body: values, params: data.id });
    else response = await request('/rural-level-entry-form', { method: 'POST', body: values });
    if (response.success) {
      const successMessage = update ? 'Level Entry updated successfully!' : 'Level Entry added successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      setRefresh();
      refreshPagination();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const handleRuralId = (e) => {
    setSelectedRuralId(e?.target?.value);
    const parentLevel = ruralData.find((item) => item.rank + 1 == e.target?.rank);
    setSelectedParent(parentLevel?.name);
    setSelectedParentId(parentLevel?.id);
    dispatch(getRuralLevelParents({ listType: 1, ruralId: parentLevel?.id }));
  };

  const { ruralLevelParents } = useRural();
  const { ruralLevelParentsData } = useMemo(
    () => ({
      ruralLevelParentsData:
        ruralLevelParents.ruralLevelParentsObject?.rows?.map((item) => ({
          id: item.id,
          name: `${item.name} - ${item.id}`
        })) || [],
      isLoading: ruralLevelParents.loading || false
    }),
    [ruralLevelParents]
  );

  const handleStatusId = (e) => {
    setValue('approvalStatus', e?.target?.value);
  };

  const handleProjectId = (e) => {
    setSelectedProject(e?.target?.value);
  };

  const selectBox = (name, label, menus, onChange, req, disabled) => {
    return (
      <Stack>
        <RHFSelectbox
          name={name}
          label={label}
          onChange={onChange}
          InputLabelProps={{ shrink: true }}
          menus={menus}
          {...(req && { required: true })}
          {...(view || update ? { disable: disabled } : {})}
        />
      </Stack>
    );
  };

  const txtBox = (name, label, type, req, shrink = true) => {
    return (
      <Stack spacing={1}>
        <RHFTextField
          name={name}
          type={type}
          label={label}
          InputLabelProps={{ shrink: shrink }}
          {...(req && { required: true })}
          {...(view ? { disabled: true } : update ? { disabled: false } : {})}
        />
      </Stack>
    );
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'Rural Level Entry'} sx={{ mb: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item md={3} xl={2}>
              {selectBox('projectId', 'Project Name', projectData, handleProjectId, true, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'urbanHierarchyId',
                'Level Name',
                user?.id === '577b8900-b333-42d0-b7fb-347abc3f0b5c' || user?.id === '57436bed-c176-4625-96af-aaeec88cdc90'
                  ? ruralData
                  : ruralData.slice(1),
                handleRuralId,
                true,
                true
              )}
            </Grid>
            {selectedParent && (
              <Grid item md={6} xl={4}>
                {selectBox('parentId', `Select ${selectedParent}`, ruralLevelParentsData, true, true)}
              </Grid>
            )}
            <Grid item md={3} xl={2}>
              {selectBox('approvalStatus', `Select Status`, statusMenudata, handleStatusId, true, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('name', 'Entry Name', 'text', true, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('code', 'Entry Code', 'text', true, false)}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={'end'} sx={{ mt: 1 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
              {!view ? (
                update ? (
                  <Grid item sx={{ display: 'flex', gap: '20px' }}>
                    <Button size="small" type="submit" variant="contained" color="primary">
                      Update
                    </Button>
                    <Button onClick={handleLevelBack} size="small" variant="outlined" color="primary">
                      Back
                    </Button>
                  </Grid>
                ) : (
                  <Grid item sx={{ display: 'flex', gap: '20px' }}>
                    <Button size="small" type="submit" variant="contained" color="primary">
                      Save
                    </Button>
                  </Grid>
                )
              ) : (
                <Button onClick={handleLevelBack} size="small" variant="outlined" color="primary">
                  Back
                </Button>
              )}
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
    </>
  );
};

RuralLevelEntryForm.propTypes = {
  projectData: PropTypes.array,
  setRefresh: PropTypes.func,
  data: PropTypes.object,
  setSelectedRuralId: PropTypes.func,
  selectedProject: PropTypes.string,
  setSelectedProject: PropTypes.func,
  view: PropTypes.bool,
  update: PropTypes.bool,
  handleBack: PropTypes.func,
  refreshPagination: PropTypes.func,
  setSelectedParentId: PropTypes.func,
  user: PropTypes.object
};

export default RuralLevelEntryForm;