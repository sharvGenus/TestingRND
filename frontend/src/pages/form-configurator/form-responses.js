import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Grid, Typography, Stack, IconButton, Tooltip, Divider } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { useDefaultFormAttributes } from './useDefaultAttributes';
import { FormProvider, RHFSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import { getDropdownProjects, getLovsForMasterName } from 'store/actions';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { getWebformData } from 'store/actions/formMasterAction';

const FormResponses = () => {
  const dispatch = useDispatch();
  const [projectId, setProjectId] = useState();
  const [typeId, setTypeId] = useState();
  const { info, ctg } = useParams();

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getLovsForMasterName('FORM_TYPES'));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getWebformData({
        projectId,
        typeId: info ? ctg : typeId,
        sortBy: 'updatedAt',
        sortOrder: 'DESC',
        accessSource: info ? 'Reports' : 'Form Responses'
      })
    );
  }, [dispatch, projectId, typeId, info, ctg]);

  const { masterMakerOrgType } = useMasterMakerLov();
  const formTypeData = masterMakerOrgType?.masterObject;

  const { webforms } = useDefaultFormAttributes();
  const formsList = webforms?.webformDataObject?.rows || [];

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
    const { formName, formId, title } = props;
    return (
      <MainCard sx={{ height: 150 }}>
        <Grid container spacing={1}>
          <Grid item md={12} sx={{ fontWeight: 'bold', fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {formName}
          </Grid>
          <Grid item md={12} sx={{ fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </Grid>
          <Grid item md={12}>
            <Divider sx={{ mt: 2, mb: -0.5, ml: -3, mr: -3 }} />
          </Grid>
          <Grid item md={12} sx={{ fontSize: 13, display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title="Response" placement="bottom">
              <IconButton
                component={Link}
                to={info ? `/form-reports/${formId}/${formName}/${info}` : `/form-responses/${formId}/${formName}`}
                color="secondary"
              >
                <MenuOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </MainCard>
    );
  };

  MyCard.propTypes = {
    formName: PropTypes.string.isRequired,
    formId: PropTypes.string.isRequired,
    title: PropTypes.string
  };

  return (
    <>
      <FormProvider methods={methods}>
        <MainCard
          title={
            <Grid container xl={12} spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
              <Grid item xl={6} md={6}>
                <Typography variant="h4">{info ? `${info} Reports` : 'Form Responses'}</Typography>
              </Grid>
              {info ? <Grid item xl={3} md={3} /> : <></>}
              <Grid item xl={3} md={3}>
                {selectBox('projectId', '', projectData, false, 'Select Project', onProjectChange)}
              </Grid>
              {info ? (
                <></>
              ) : (
                <Grid item xl={3} md={3}>
                  {selectBox('formTypeId', '', formTypeData, false, 'Select Form Type', onTypeChange)}
                </Grid>
              )}
            </Grid>
          }
          sx={{ height: '85vh', overflowY: 'scroll' }}
        >
          <Grid container direction="row" spacing={2}>
            {formsList
              ?.filter((x) => x.isPublished)
              ?.map((item) => (
                <Grid item key={item?.id} xs={12} sm={6} md={4} lg={3}>
                  <MyCard
                    formName={item?.name}
                    type={item?.master_maker_lov?.name}
                    formId={item?.id}
                    title={info ? `${info} ( ${item?.project?.code} )` : `${item?.master_maker_lov?.name} ( ${item?.project?.code} )`}
                  />
                </Grid>
              ))}
          </Grid>
        </MainCard>
      </FormProvider>
    </>
  );
};

export default FormResponses;
