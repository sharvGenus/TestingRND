import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, Button } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMaterial } from '../material/useMaterial';
import MaterialInputs from './material-input';
import { FormProvider, RHFSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { getDropdownProjects, getMaterial } from 'store/actions';
import { useProjects } from 'pages/extra-pages/project/useProjects';

const MaterialQuantity = () => {
  const dispatch = useDispatch();
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState(null);
  const [disableAll, setDisableAll] = useState(false);
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        materialId: Validations.material
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit } = methods;

  useEffect(() => {
    dispatch(getMaterial());
    dispatch(getDropdownProjects());
  }, [dispatch]);

  const { projectsDropdown } = useProjects();
  const { material } = useMaterial();

  const projectData = projectsDropdown?.projectsDropdownObject;
  const materialData = material?.materialObject.rows;

  const onFormSubmit = async (formValues) => {
    setFormData(formValues);
    setShowAdd(!showAdd);
    setDisableAll(true);
  };

  return (
    <>
      <FormProvider methods={methods}>
        <MainCard title={'Material Quantity'} sx={{ mb: 2 }}>
          <Grid container spacing={4} sx={{ mb: 2 }}>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                name="projectId"
                label="Project"
                InputLabelProps={{ shrink: true }}
                menus={projectData}
                disable={disableAll}
                required
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                name="materialId"
                label="Material"
                type="text"
                InputLabelProps={{ shrink: true }}
                menus={materialData}
                disable={disableAll}
                required
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={'end'} sx={{ mt: 2 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mb: '15px' }}>
              <Button size="small" variant="contained" onClick={handleSubmit(onFormSubmit)} color="primary">
                Next
              </Button>
            </Grid>
          </Grid>
        </MainCard>
        {showAdd && (
          <MaterialInputs
            otherMaterialData={materialData}
            formData={formData}
            setShowAdd={setShowAdd}
            showAdd={showAdd}
            setDisableAll={setDisableAll}
          />
        )}
      </FormProvider>
    </>
  );
};

export default MaterialQuantity;
