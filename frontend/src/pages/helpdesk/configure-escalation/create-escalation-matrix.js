import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, Dialog, Grid, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useEmailTemplate } from '../configure-email-template/useEmailTemplate';
import MainCard from 'components/MainCard';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { FormProvider, RHFSelectTags, RHFSelectbox, RHFTextField } from 'hook-form';
import { getDropdownProjects, getProjectMasterMaker, getProjectMasterMakerLov, getTicketEmailTemplates, getUsers } from 'store/actions';
import { useProjectMasterMaker } from 'pages/extra-pages/project-master-maker/useProjectMasterMaker';
import { useProjectMasterMakerLov } from 'pages/extra-pages/project-master-maker-lov/useProjectMasterMakerLov';
import { useUsers } from 'pages/extra-pages/users/useUsers';
import toast from 'utils/ToastNotistack';
import request from 'utils/request';

function splitNumbersAndLetters(inputString) {
  let matches = inputString.match(/(\d+)|([a-zA-Z]+)/g);
  matches = matches ? matches : [];
  return matches;
}

function validateJiraTimeFormat(timeString) {
  const timeUnit = { w: 5, d: 4, h: 3, m: 2, s: 1 };
  const time = timeString.trim().split(' ');
  if (time.length > Object.keys(timeUnit).length) return false;
  let currentLevel = Math.min(); // Assigned Max number value [infinity]
  for (let instance of time) {
    const split = splitNumbersAndLetters(instance);
    if (split.length !== 2) return false;
    if (!timeUnit[split[1]]) return false;
    if (currentLevel > timeUnit[split[1]]) currentLevel = timeUnit[split[1]];
    else return false;
  }
  return true;
}

const CreateEscalationMatrix = ({ edit, rowData, onBack }) => {
  const dispatch = useDispatch();

  const [escalationLevel, setEscalationLevel] = useState(1);
  const [showEmailBody, setShowEmailBody] = useState(false);

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;

  const { projectMasterMakers } = useProjectMasterMaker();
  const projectMastersData = useMemo(() => projectMasterMakers?.projectMasterMakerObject?.rows || [], [projectMasterMakers]);

  const { projectMasterMakerLovs } = useProjectMasterMakerLov();
  const projectMasterMakerLovData = useMemo(
    () => projectMasterMakerLovs?.projectMasterMakerLovsObject?.rows || [],
    [projectMasterMakerLovs]
  );

  const { users } = useUsers();
  const userData = users?.usersObject?.rows || [];

  const { templateList } = useEmailTemplate();
  const templateData = useMemo(() => templateList?.ticketEmailTemplates?.rows || [], [templateList]);

  const methods = useForm({
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    dispatch(getProjectMasterMaker());
    dispatch(getProjectMasterMakerLov());
    dispatch(getDropdownProjects());
    dispatch(getTicketEmailTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (rowData) {
      setEscalationLevel(rowData?.levels?.length || 0);
      setValue('projectId', rowData.projectId);
      setValue('emailTemplateId', rowData.emailTemplateId);
      const { levels } = rowData;
      levels.forEach((level, index) => {
        setValue(`time${index}`, level.time);
        setValue(`to${index}`, level.to);
        setValue(`cc${index}`, level.cc);
      });
    }
  }, [setValue, setEscalationLevel, rowData]);

  const projectId = methods.watch('projectId');
  useEffect(() => {
    if (projectId) {
      dispatch(getUsers({ projectId }));
    }
  }, [dispatch, projectId]);

  const emailTemplateIdWatch = methods.watch('emailTemplateId');
  useEffect(() => {
    if (emailTemplateIdWatch) {
      const [selectedTemplate] = templateData.filter((template) => template.id === emailTemplateIdWatch);
      if (!selectedTemplate) return;
      const selectedIssueIds = projectMastersData.filter((master) => selectedTemplate?.issueIds?.includes(master.id));
      const selectedSubIssueIds = projectMasterMakerLovData.filter((lov) => selectedTemplate?.subIssueIds?.includes(lov.id));
      setValue(
        'issues',
        selectedIssueIds.map((item) => item.id)
      );
      setValue(
        'sub-issues',
        selectedSubIssueIds.map((item) => item.id)
      );
    }
  }, [emailTemplateIdWatch, projectMasterMakerLovData, projectMastersData, templateData, setValue]);

  const onSubmitHandler = async (formValue) => {
    const levels = {};
    for (let i = 0; i < escalationLevel; i++) {
      const time = formValue[`time${i}`];
      const to = formValue[`to${i}`];
      const cc = formValue[`cc${i}`];
      let errorMessage = null;
      if (!time) {
        errorMessage = 'Time is required';
      } else if (!validateJiraTimeFormat(time)) {
        errorMessage = 'Invalid time format';
      } else if (!to.length) {
        errorMessage = 'To list cannot be empty';
      } else if (!cc.length) {
        errorMessage = 'CC list cannot be empty';
      }
      if (errorMessage) {
        toast(errorMessage + ` in Level ${i + 1}`, { variant: 'error' });
        return;
      }
      levels[i] = { time, to, cc };
    }

    let payload = {
      projectId: formValue.projectId,
      emailTemplateId: formValue.emailTemplateId,
      levels
    };

    if (rowData) {
      const newLevels = Object.keys(levels).map((key) => {
        const level = levels[key];
        const index = key;
        if (rowData.levels[index]) {
          return { ...rowData.levels[index], to: level.to, cc: level.cc, time: level.time };
        } else {
          return {
            isNew: true,
            ...level
          };
        }
      });

      if (newLevels.length < rowData.levels.length) {
        const newLevelsLength = newLevels.length;
        [...Array(rowData.levels.length - newLevels.length)].map((_, index) => {
          newLevels.push({ isDeleted: true, id: rowData.levels[newLevelsLength + index].id });
        });
      }

      payload = {
        ...rowData,
        emailTemplateId: formValue.emailTemplateId,
        levels: newLevels
      };
    }

    const response = await request(edit ? '/escalation-matrix-update' : '/escalation-matrix-create', {
      method: edit ? 'PUT' : 'POST',
      body: payload,
      params: rowData?.id
    });
    if (response.success) {
      toast(`Successfully created escalation matrix.`, {
        variant: 'success',
        autoHideDuration: 10000
      });
      onBack(true);
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitHandler)}>
        <MainCard title={edit ? 'Edit Escalation' : rowData ? 'View Escalation' : 'Create Escalation'}>
          <Grid container rowSpacing={3} columnSpacing={2} sx={{ mb: 2 }}>
            <Grid item xs={3}>
              <RHFSelectbox
                name={'projectId'}
                label={'Project'}
                InputLabelProps={{ shrink: true }}
                menus={projectData}
                onChange={() => {
                  setValue('emailTemplateId', '');
                  setValue('issues', []);
                  setValue('sub-issues', []);
                }}
                disable={!!rowData}
                allowClear
                required
              />
            </Grid>
            <Grid item xs={3}>
              <RHFSelectbox
                name={'emailTemplateId'}
                label={'Email Template'}
                InputLabelProps={{ shrink: true }}
                menus={templateData
                  .filter((template) => template.projectId === methods.watch('projectId'))
                  .map((template) => ({ id: template.id, name: template.templateName }))}
                disable={!edit && rowData}
                allowClear
                required
              />
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setShowEmailBody(true);
                }}
                disabled={!methods.watch('emailTemplateId')}
              >
                Email Body
              </Button>
            </Grid>
            <Grid item xs={6}>
              <RHFSelectTags
                name={`issues`}
                label={`Issue`}
                disable
                menus={projectMastersData.map((data) => ({ id: data.id, name: data.name }))}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <RHFSelectTags
                name={`sub-issues`}
                label={`Sub-Issue`}
                disable
                menus={projectMasterMakerLovData.map((data) => ({ id: data.id, name: data.name }))}
                required
              />
            </Grid>
          </Grid>
          <Typography color="error" sx={{ mb: 2 }}>
            {`Note: Time format should be similar to "2w 3d 4h 5m 6s" where "w" is week, "d" is day, "h" is hours, "m" is minutes, and "s" is
            seconds.`}
          </Typography>
          {[...Array(escalationLevel).keys()].map((index) => (
            <>
              <Grid key={index} sx={{ mb: 1 }} container rowSpacing={1} columnSpacing={2} alignItems={'center'}>
                <Grid item xs={12} display={'flex'} alignItems={'center'} gap="20px">
                  <Typography variant="h4">{`Level ${index + 1}`}</Typography>
                  {index === escalationLevel - 1 && index !== 0 && ((edit && rowData) || (!edit && !rowData)) && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => {
                        methods.unregister(`time${index}`);
                        methods.unregister(`to${index}`);
                        methods.unregister(`cc${index}`);
                        setEscalationLevel((prev) => (prev -= 1));
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </Grid>
                <Grid item xs={3}>
                  <RHFTextField name={`time${index}`} disabled={!edit && rowData} label={'Time'} />
                </Grid>
              </Grid>
              <Grid container sx={{ mb: 2 }} rowSpacing={1} columnSpacing={2} alignItems={'center'}>
                <Grid item xs={6}>
                  <RHFSelectTags disable={!edit && rowData} name={`to${index}`} label={`To`} menus={userData} required />
                </Grid>
                <Grid item xs={6}>
                  <RHFSelectTags disable={!edit && rowData} name={`cc${index}`} label={`CC`} menus={userData} required />
                </Grid>
              </Grid>
            </>
          ))}
          <Grid container sx={{ mt: 2 }}>
            <Grid item xs={12} display={'flex'} justifyContent={'flex-end'} gap={'20px'}>
              <Button variant="outlined" size="small" color="primary" onClick={onBack}>
                Back
              </Button>
              {((edit && rowData) || (!edit && !rowData)) && (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => {
                      setEscalationLevel((prev) => (prev += 1));
                    }}
                  >
                    Add Level
                  </Button>
                  <Button variant="contained" size="small" color="primary" type="submit">
                    Save
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
      <Dialog
        open={showEmailBody}
        onClose={() => {
          setShowEmailBody(false);
        }}
        fullWidth
      >
        <Box sx={{ width: '100%', padding: 2 }}>
          <TextField
            multiline
            fullWidth
            value={templateData.filter((template) => template.id === methods.watch('emailTemplateId'))[0]?.body || ''}
          />
        </Box>
      </Dialog>
    </>
  );
};

CreateEscalationMatrix.propTypes = {
  edit: PropTypes.any,
  rowData: PropTypes.any,
  onBack: PropTypes.func
};

export default CreateEscalationMatrix;
