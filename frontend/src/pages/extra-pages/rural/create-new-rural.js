import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, Button, Dialog, Grid, Stack, TextField, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import request from '../../../utils/request';
import { useRural } from './useRural';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import toast from 'utils/ToastNotistack';
import { getRuralProjects } from 'store/actions';

const CreateNewRural = (props) => {
  const { data, view, update, setRefresh, refreshPagination, selectedProject, setSelectedProject, projectData } = props;
  const [open, setOpen] = useState(false);
  const [reset, setReset] = useState(false);
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.other,
        code: Validations.other,
        rank: Validations.other,
        projectId: Validations.project
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const subMethods = useForm({
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, clearErrors, getValues } = methods;

  const handleBack = useCallback(() => {
    setRefresh();
    const formValues = getValues();
    methods.reset({
      name: '',
      projectId: formValues.projectId
    });
  }, [setRefresh, methods, getValues]);

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };
    if (!data) {
      handleBack();
    }
    if (view || update) {
      setValue('projectId', data.projectId);
      handleSetValues(data);
    }
    clearErrors();
  }, [data, update, view, setValue, clearErrors, handleBack]);

  const handleProjectId = (e) => {
    setSelectedProject(e?.target?.value);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    if (selectedProject) {
      dispatch(getRuralProjects({ projectId: selectedProject }));
    }
  }, [dispatch, selectedProject, reset]);

  const { ruralProjects } = useRural();
  const { ruralData } = useMemo(
    () => ({
      ruralData: ruralProjects?.ruralProjectsObject?.rows || []
    }),
    [ruralProjects]
  );

  const onFormSubmit = async (values) => {
    delete values['isMapped'];
    values['levelType'] = 'rural';
    let response;
    if (update) {
      response = await request('/rural-hierarchies-update', { method: 'PUT', body: values, params: data.id });
    } else {
      response = await request('/rural-hierarchies-form', { method: 'POST', body: values });
    }
    if (response.success) {
      const successMessage = update ? 'Level updated successfully!' : 'Level added successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      handleBack();
      refreshPagination();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const onSubFormSubmit = async (values) => {
    values['projectId'] = selectedProject;
    values['isMapped'] = 1;
    let response;
    response = await request('/rural-hierarchies-update', { method: 'PUT', body: values, params: values.mappingColumn });
    if (response.success) {
      const successMessage = 'Mapping column updated successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      setReset(!reset);
      setOpen(false);
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const selectBox = (name, label, menus, onChange, req, disabled) => {
    return (
      <Stack>
        <RHFSelectbox
          name={name}
          label={label}
          disable={disabled}
          onChange={onChange}
          InputLabelProps={{ shrink: true }}
          menus={menus}
          {...(req && { required: true })}
          {...(view || update ? { disable: true } : {})}
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
        <MainCard
          title={
            <Grid container xl={12} spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid item xl={3} md={3}>
                <Typography variant="h4">{(view ? `View ` : update ? 'Update ' : 'Add ') + 'Rural Level'}</Typography>
              </Grid>
              {selectedProject && !view && !update && (
                <Grid item md={2} xl={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={() => setOpen(true)} size="small" variant="contained" color="primary">
                    Set Mapping Column
                  </Button>
                </Grid>
              )}
            </Grid>
          }
          sx={{ mb: 2 }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item md={3} xl={2}>
              {selectBox('projectId', 'Project Name', projectData, handleProjectId, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('name', 'Level Name', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('code', 'Level Code', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('rank', 'Rank', 'number', true)}
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
                    <Button onClick={handleBack} size="small" variant="outlined" color="primary">
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
                <Button onClick={handleBack} size="small" variant="outlined" color="primary">
                  Back
                </Button>
              )}
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
      <Dialog open={open} onClose={() => setOpen(false)} scroll="paper" disableEscapeKeyDown>
        <FormProvider methods={subMethods} onSubmit={subMethods.handleSubmit(onSubFormSubmit)}>
          <Grid container spacing={3} sx={{ p: 2 }}>
            <Grid item md={12} sx={{ fontSize: 22, fontWeight: 'bold' }}>
              Rural - Urban Mapping
            </Grid>
            <Grid item md={6} xl={6}>
              <Stack spacing={1}>
                <Typography>Project Name</Typography>
                <Autocomplete
                  value={(projectData && projectData.find((option) => option.id === selectedProject)) || null}
                  options={projectData}
                  disabled={true}
                  disableClearable
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
            </Grid>
            <Grid item md={6} xl={6}>
              {selectBox('mappingColumn', 'Mapping Column', ruralData)}
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button size="small" variant="outlined" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="small" type="submit" variant="contained">
                Save
              </Button>
            </Grid>
          </Grid>
        </FormProvider>
      </Dialog>
    </>
  );
};

CreateNewRural.propTypes = {
  projectData: PropTypes.array,
  setRefresh: PropTypes.func,
  data: PropTypes.object,
  setSelectedProject: PropTypes.func,
  selectedProject: PropTypes.string,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func
};

export default CreateNewRural;
