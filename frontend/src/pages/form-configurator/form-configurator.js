import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Grid, Typography, Stack, IconButton, Tooltip, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { useDefaultFormAttributes } from './useDefaultAttributes';
import { FormProvider, RHFSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import { getDropdownProjects, getLovsForMasterName } from 'store/actions';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { getFormData } from 'store/actions/formMasterAction';

const AddCard = () => {
  return (
    <MainCard sx={{ height: 150 }}>
      <Grid container spacing={1}>
        <Grid item md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton component={Link} to={'/create-new-form'} sx={{ width: '4rem', height: '4.5rem', color: 'blue' }}>
            <AddIcon sx={{ fontSize: '4.5rem' }} />
          </IconButton>
        </Grid>
        <Grid item md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Create New Form
        </Grid>
      </Grid>
    </MainCard>
  );
};

const FormConfigurator = () => {
  const dispatch = useDispatch();
  const [projectId, setProjectId] = useState();
  const [typeId, setTypeId] = useState();
  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getLovsForMasterName('FORM_TYPES'));
  }, [dispatch]);
  useEffect(() => {
    dispatch(getFormData({ projectId, typeId, sortBy: 'updatedAt', sortOrder: 'DESC' }));
  }, [dispatch, projectId, typeId]);

  const { masterMakerOrgType } = useMasterMakerLov();
  const formTypeData = masterMakerOrgType?.masterObject;

  const { forms } = useDefaultFormAttributes();
  const formsList = forms?.formDataObject?.rows || [];

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;

  const methods = useForm({
    defaultValues: {
      validation: [{ name: '', country: '', code: '' }]
    },
    mode: 'all'
  });

  const onProjectChange = (e) => {
    setProjectId(e?.target?.value);
  };
  const onTypeChange = (e) => {
    setTypeId(e?.target?.value);
  };
  const selectBox = (name, label, menus, req, placeholder = false, onChange) => {
    return (
      <Stack>
        <RHFSelectbox
          placeholder={placeholder}
          name={name}
          onChange={onChange}
          label={label}
          InputLabelProps={{ shrink: true }}
          menus={menus}
          allowClear
          {...(req && { required: true })}
        />
      </Stack>
    );
  };

  const MyCard = (props) => {
    const { formName, formId, type, project } = props;
    return (
      <MainCard sx={{ height: 150 }}>
        <Grid container spacing={1}>
          <Grid item md={12} sx={{ fontWeight: 'bold', fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {formName}
          </Grid>
          <Grid item md={12} sx={{ fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {type + ' (' + project + ')'}
          </Grid>
          <Grid item md={12}>
            <Divider sx={{ mt: 2, mb: -0.5, ml: -3, mr: -3 }} />
          </Grid>
          <Grid item md={12} sx={{ fontSize: 13, display: 'flex', justifyContent: 'flex-end' }}>
            <Grid item md={12} sx={{ fontSize: 13, display: 'flex', justifyContent: 'flex-end' }}>
              <Tooltip title="Edit" placement="bottom">
                <IconButton component={Link} to={`/update-form/edit/${formId}`} color="secondary">
                  <EditOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Tools" placement="bottom">
                <IconButton component={Link} to={`/update-form/features/${formId}`} color="secondary">
                  <TuneOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </MainCard>
    );
  };

  MyCard.propTypes = {
    formName: PropTypes.string.isRequired,
    formId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    project: PropTypes.string.isRequired
  };
  return (
    <>
      <FormProvider methods={methods}>
        <MainCard
          title={
            <Grid container xl={12} spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
              <Grid item xl={6} md={6}>
                <Typography variant="h4">All Forms</Typography>
              </Grid>
              <Grid item xl={3} md={3}>
                {selectBox('projectId', '', projectData, false, 'Select Project', onProjectChange)}
              </Grid>
              <Grid item xl={3} md={3}>
                {selectBox('formTypeId', '', formTypeData, false, 'Select Form Type', onTypeChange)}
              </Grid>
            </Grid>
          }
          sx={{ height: '85vh', overflowY: 'scroll' }}
        >
          <Grid container direction="row" spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <AddCard />
            </Grid>
            {formsList.map((item) => (
              <Grid item key={item?.id} xs={12} sm={6} md={4} lg={3}>
                <MyCard formName={item?.name} type={item?.master_maker_lov?.name} formId={item?.id} project={item?.project?.code} />
              </Grid>
            ))}
          </Grid>
        </MainCard>
      </FormProvider>
    </>
  );
};

export default FormConfigurator;
