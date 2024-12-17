import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import request from '../../../utils/request';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import toast from 'utils/ToastNotistack';

const CreateNewQAMasterLOV = (props) => {
  const {
    data,
    view,
    update,
    setRefresh,
    selectedProject,
    selectedMeterType,
    setSelectedProject,
    setSelectedMeterType,
    projectData,
    meterTypeData,
    setSelectedQAMaster,
    qaMastersData,
    observationTypeData,
    observationSeverityData,
    refreshPagination
  } = props;
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.other,
        meterTypeId: Validations.other,
        masterId: Validations.other,
        majorContributor: Validations.other,
        code: Validations.other,
        priority: Validations.priority,
        defect: Validations.other,
        observationTypeId: Validations.other,
        observationSeverityId: Validations.other
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, clearErrors, getValues } = methods;

  useEffect(() => {
    if (projectData?.length === 1) {
      setValue('projectId', projectData[0].id);
      setSelectedProject(projectData[0].id);
    }
  }, [projectData, setSelectedProject, setValue]);

  const handleBack = useCallback(() => {
    setRefresh();
    const formValues = getValues();
    methods.reset({
      projectId: formValues.projectId,
      meterTypeId: formValues.meterTypeId,
      masterId: formValues.masterId,
      majorContributor: '',
      code: '',
      priority: '',
      defect: '',
      observationTypeId: '',
      observationSeverityId: ''
    });
  }, [setRefresh, methods, getValues]);

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };
    // if (!data) {
    //   handleBack();
    // }
    if (view || update) {
      setValue('projectId', selectedProject);
      setValue('meterTypeId', selectedMeterType);
      handleSetValues(data);
    }
    clearErrors();
  }, [data, update, view, setValue, clearErrors, handleBack, selectedProject, selectedMeterType]);

  const handleProjectId = (e) => {
    setSelectedProject(e?.target?.value);
  };

  const handleMeterTypeId = (e) => {
    setSelectedMeterType(e?.target?.value);
  };

  const handleQAMasterId = (e) => {
    setSelectedQAMaster(e?.target?.value);
  };

  const onFormSubmit = async (values) => {
    let response;
    let payload = {
      ...(values.id && { id: values.id }),
      masterId: values.masterId,
      majorContributor: values.majorContributor,
      code: values.code,
      priority: values.priority,
      defect: values.defect,
      observationTypeId: values.observationTypeId,
      observationSeverityId: values.observationSeverityId
    };
    if (update) response = await request('/qa-master-maker-lov-update', { method: 'PUT', body: payload, params: data.id });
    else response = await request('/qa-master-maker-lov-form', { method: 'POST', body: payload });
    if (response.success) {
      const successMessage = update ? 'QA Master Maker LOV updated successfully!' : 'QA Master Maker LOV added successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      setRefresh();
      refreshPagination();
      handleBack();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const selectBox = (name, label, menus, req, onChange, allowClear = false) => {
    return (
      <RHFSelectbox
        name={name}
        label={label}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        onChange={onChange}
        {...(req && { required: true })}
        {...(view || update ? { disable: ['observationTypeId', 'observationSeverityId'].includes(name) && update ? false : true } : {})}
        allowClear={allowClear}
      />
    );
  };

  const txtBox = (name, label, type, req, shrink = true) => {
    return (
      <RHFTextField
        name={name}
        type={type}
        label={label}
        InputLabelProps={{ shrink: shrink }}
        {...(req && { required: true })}
        {...(view ? { disabled: true } : update ? { disabled: false } : {})}
      />
    );
  };
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'QA Master LOV'} sx={{ mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('projectId', 'Project Name', projectData, true, handleProjectId)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('meterTypeId', 'Meter Type', meterTypeData, true, handleMeterTypeId)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('masterId', 'Master Name', qaMastersData, true, handleQAMasterId)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('majorContributor', 'Major Contributor', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('code', 'Code', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('priority', 'Priority', 'number', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('defect', 'Defect', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('observationTypeId', 'Observation Type', observationTypeData, true, () => {})}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('observationSeverityId', 'Observation Severity', observationSeverityData, true, () => {})}
            </Grid>
            <Grid item md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                  <Button size="small" type="submit" variant="contained" color="primary">
                    Save
                  </Button>
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
    </>
  );
};

CreateNewQAMasterLOV.propTypes = {
  onClick: PropTypes.func,
  projectData: PropTypes.object,
  meterTypeData: PropTypes.object,
  qaMastersData: PropTypes.object,
  observationTypeData: PropTypes.object,
  observationSeverityData: PropTypes.object,
  setRefresh: PropTypes.func,
  data: PropTypes.object,
  setSelectedProject: PropTypes.func,
  setSelectedMeterType: PropTypes.func,
  selectedProject: PropTypes.string,
  selectedMeterType: PropTypes.string,
  setSelectedQAMaster: PropTypes.func,
  selectedProjectMaster: PropTypes.string,
  view: PropTypes.bool,
  refreshPagination: PropTypes.func,
  update: PropTypes.bool
};

export default CreateNewQAMasterLOV;
