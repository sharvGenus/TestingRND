import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Grid, Typography, styled } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Mention, MentionsInput } from 'react-mentions';
import { useTicketMapping } from '../configurator/useTicketMapping';
import { FormProvider, RHFSelectTags, RHFSelectbox, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import MainCard from 'components/MainCard';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { getDropdownProjects, getSmtp } from 'store/actions';
import { useProjectMasterMakerLov } from 'pages/extra-pages/project-master-maker-lov/useProjectMasterMakerLov';
import { useSmtp } from 'pages/extra-pages/smtp-configuration/useSmtp';

const MentionsInputStyled = styled(MentionsInput)(({ theme }) => ({
  minHeight: 200,
  '& textarea': {
    borderRadius: theme.spacing(0.5),
    borderColor: theme.palette.grey[400],
    outline: 0,
    padding: theme.spacing(1)
  }
}));

const ticketSuggestions = [
  {
    id: 'ticketNumber',
    display: 'Ticket Number'
  },
  {
    id: 'ticketStatus',
    display: 'Ticket Status'
  },
  {
    id: 'issueType',
    display: 'Issue Name'
  },
  {
    id: 'subIssueType',
    display: 'Sub-Issue Name'
  },
  {
    id: 'remarks',
    display: 'Remarks'
  },
  {
    id: 'createdAt',
    display: 'Created On'
  },
  {
    id: 'updatedAt',
    display: 'Updated On'
  },
  {
    id: 'supervisor',
    display: 'Supervisor Name'
  },
  {
    id: 'ticketPriority',
    display: 'Ticket Priority'
  },
  {
    id: 'installer',
    display: 'Installer Name'
  },
  {
    id: 'description',
    display: 'Description'
  }
];

const CreateNewTemplates = ({ edit, data, onClose }) => {
  const dispatch = useDispatch();

  const [bodyValue, setBodyValue] = useState('');
  const [showBodyError, setShowBodyError] = useState(false);

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;

  const { projectWiseTicketMapping } = useTicketMapping();
  const projectWiseTicketMappingData = projectWiseTicketMapping?.projectWiseTicketMappingObject?.rows || [];

  const { projectMasterMakerLovs } = useProjectMasterMakerLov();
  const projectMasterMakerLovData = projectMasterMakerLovs?.projectMasterMakerLovsObject?.rows || [];

  const { smtp } = useSmtp();
  const smtpData = smtp.smtpObject?.rows || [];

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getSmtp({ all: true }));
  }, [dispatch]);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.required,
        displayName: Validations.required,
        templateName: Validations.required,
        from: Validations.required,
        subject: Validations.required,
        issueIds: Validations.otherArray,
        subIssueIds: Validations.otherArray
      })
    ),
    defaultValues: {
      projectId: data?.projectId || '',
      displayName: data?.displayName || '',
      templateName: data?.templateName || '',
      from: data?.from || '',
      subject: data?.subject || '',
      issueIds: data?.issueIds || [],
      subIssueIds: data?.subIssueIds || []
    },
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    if (data) {
      setBodyValue(data?.body || '');
    }
  }, [setValue, data]);

  const onFormSubmitHandler = async (formValues) => {
    if (!bodyValue) return;
    const payload = {
      ...formValues,
      body: bodyValue.replace(/[<>]/g, '')
    };

    const response = await request(edit ? '/ticket-email-template-update' : '/ticket-email-template-create', {
      method: edit ? 'PUT' : 'POST',
      params: edit ? data.id : '',
      body: payload
    });
    if (response.success) {
      toast(`Successfully ${edit ? 'updated' : 'created'} email template.`, {
        variant: 'success',
        autoHideDuration: 10000
      });
      onClose(true);
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmitHandler)}>
        <MainCard title={edit ? 'Edit Template' : data ? 'View Template' : 'Create Template'}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography color="error">Note: Ticket Issue and Sub-Issue types will come from Project Wise Ticket Configurator</Typography>
            </Grid>
            <Grid item xs={3}>
              <RHFSelectbox
                disable={data}
                name="projectId"
                label="Project"
                InputLabelProps={{ shrink: true }}
                menus={projectData}
                required={true}
              />
            </Grid>
            <Grid item xs={3}>
              <RHFTextField
                disabled={data && !edit}
                name={'templateName'}
                type="text"
                label={'Template Name'}
                InputLabelProps={{ shrink: true }}
                required={true}
              />
            </Grid>
            <Grid item xs={3}>
              <RHFTextField
                disabled={data && !edit}
                name={'displayName'}
                type="text"
                label={'From Display Name'}
                InputLabelProps={{ shrink: true }}
                required={true}
              />
            </Grid>
            <Grid item xs={3}>
              <RHFSelectbox
                name="from"
                label="From"
                disable={data && !edit}
                multiple={false}
                InputLabelProps={{ shrink: true }}
                required={true}
                menus={smtpData?.map((user) => ({ id: user?.username, name: user?.username })) || []}
              />
            </Grid>
            <Grid item xs={6}>
              <RHFTextField
                disabled={data && !edit}
                name={'subject'}
                type="text"
                label={'Subject'}
                InputLabelProps={{ shrink: true }}
                required={true}
              />
            </Grid>
            <Grid item xs={6}>
              <RHFSelectTags
                name={'issueIds'}
                label={'Ticket Issues'}
                disable={data && !edit}
                InputLabelProps={{ shrink: true }}
                menus={
                  projectWiseTicketMappingData.filter((mapping) => mapping.projectId === methods.watch('projectId'))[0]?.issueFields || []
                }
                onChange={(list) => {
                  const availableLovIds = projectMasterMakerLovData.filter((lov) => list?.includes(lov.masterId)).map((lov) => lov.id);
                  methods.setValue(
                    'subIssueIds',
                    methods.watch('subIssueIds').filter((value) => availableLovIds.includes(value))
                  );
                }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <RHFSelectTags
                name={'subIssueIds'}
                label={'Ticket Sub-Issues'}
                disable={data && !edit}
                menus={projectMasterMakerLovData
                  .filter((lov) => methods.watch('issueIds')?.includes(lov.masterId))
                  .map((lov) => ({ name: lov.name, id: lov.id }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography mb={1}>Body*</Typography>
              <MentionsInputStyled
                aria-multiline
                rows={6}
                value={bodyValue}
                disabled={data && !edit}
                onChange={(e) => {
                  setBodyValue(e?.target?.value);
                  if (!e.target.value) setShowBodyError(true);
                  else if (showBodyError) setShowBodyError(false);
                }}
              >
                <Mention
                  displayTransform={(id, display) => {
                    return '@[' + display + ']';
                  }}
                  data={ticketSuggestions}
                  markup="@[__display__]"
                />
              </MentionsInputStyled>
              {showBodyError && (
                <Typography color={'error'} sx={{ fontSize: 13 }}>
                  {'Body is required'}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
              <Button size="small" variant="outlined" onClick={onClose}>
                Back
              </Button>
              <Button size="small" variant="contained" type="submit">
                {edit ? 'Update' : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
    </>
  );
};

CreateNewTemplates.propTypes = {
  data: PropTypes.any,
  onClose: PropTypes.func,
  edit: PropTypes.bool
};

export default CreateNewTemplates;
