import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Dialog, Grid, IconButton, Typography, useTheme } from '@mui/material';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack } from '@mui/system';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { Alert, AlertTitle } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useTicketMapping } from '../configurator/useTicketMapping';
import { ticketTableColumns } from './constants';
import { FormProvider, RHFRadio, RHFSelectbox, RHFTextField } from 'hook-form';
import {
  getAllSupervisors,
  getDropdownOrganization,
  getLovsForMasterName,
  getOrganizationsLocationByParent,
  getProjectMasterMakerLov,
  getProjectWiseTicketMapping,
  getRoleProjects,
  getUsers
} from 'store/actions';
import request from 'utils/request';
import MainCard from 'components/MainCard';
import TableForm from 'tables/table';
import { useProjectMasterMakerLov } from 'pages/extra-pages/project-master-maker-lov/useProjectMasterMakerLov';
import { useUsers } from 'pages/extra-pages/users/useUsers';
import toast from 'utils/ToastNotistack';
import { useRoles } from 'pages/extra-pages/roles-and-permissions/useRoles';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { useOrganizations } from 'pages/extra-pages/organization/useOrganizations';
import Validations from 'constants/yupValidations';
import { concateNameAndCode } from 'utils';
import { TICKET_PRIORITY_LIST } from 'constants/constants';
import FileSections from 'components/attachments/FileSections';
import ImageCard from 'pages/form-configurator/responses/response-images';
import useAuth from 'hooks/useAuth';

const SUPERVISOR_NOTES = {
  role: 'All supervisors assigned in the "Supervisor Assignment" module will be displayed.',
  gaa: `The GAA area will be displayed according to the selected record's hierarchy. If the supervisor's name is not displayed, navigate to the "Supervisor Assignment" module and assign a supervisor with their O&M engineer.`,
  organization: `If the supervisor's name is not displayed, navigate to "Supervisor Assignment" module and assign a supervisor with their O&M engineer.`
};

const fileFields = [
  {
    name: 'attachments',
    label: 'Attachments',
    accept: 'image/*',
    required: false,
    multiple: true
  }
];

const TicketForm = ({
  disableFields,
  projectId,
  onFormSubmit,
  ticket,
  geoLocation,
  tableData,
  tableColumns,
  openTickets,
  ticketStatusTypeList,
  onCloseTicketForm,
  gaaResponseData
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState();
  const [gaaLevelData, setGAALevelData] = useState([]);
  const [userList, setUserList] = useState({ supervisor: [], installer: [] });
  const [occupiedUsers, setOccupiedUsers] = useState({});
  const [loading, setLoading] = useState(false);
  const [openImage, setOpenImage] = useState(false);

  const { projectMasterMakerLovs } = useProjectMasterMakerLov();
  const projectMasterMakerLovData = projectMasterMakerLovs?.projectMasterMakerLovsObject?.rows || [];

  const { projectWiseTicketMapping } = useTicketMapping();
  const projectWiseTicketMappingData = projectWiseTicketMapping.projectWiseTicketMappingObject?.rows || [];

  const { users } = useUsers();
  const { user: loggedInUser } = useAuth();
  const hasAccess = useMemo(() => (loggedInUser?.role?.addTicket ? 'true' : 'false'), [loggedInUser]);
  const userData = useMemo(() => users?.usersObject?.rows || [], [users]);

  const { roleProjects } = useRoles();
  const roleProjectsData = roleProjects?.roleProjectsObject?.rows || [];

  const { masterMakerOrgType } = useMasterMakerLov();
  const organizationTypeData = masterMakerOrgType?.masterObject;

  const { organizationsDropdown, organizationsLocByParent } = useOrganizations();
  const organizationListData = organizationsDropdown?.organizationDropdownObject || [];
  const organizationBranchData = organizationsLocByParent?.organizationObject?.rows || [];

  const { supervisorUsers } = useUsers();
  const supervisorAssignmentsData = useMemo(() => supervisorUsers?.supervisorUsersObject?.rows || [], [supervisorUsers]);

  const getTicketFormData = useCallback(
    async (formId, responseId) => {
      const response = await request('/ticket-form-data', { method: 'GET', query: { formId, responseId } });
      if (response.success) {
        setFormData(response.data.data);
      } else {
        toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
        onCloseTicketForm();
      }
    },
    [onCloseTicketForm]
  );
  const getGAAData = useCallback(async () => {
    const { responseId, formId } = gaaResponseData || {};
    if (responseId && formId) {
      const response = await request('/ticket-gaa-data', { method: 'GET', query: { responseId, formId } });
      if (response.success) {
        setGAALevelData(response.data?.data?.data || []);
      } else {
        toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
        onCloseTicketForm();
      }
    }
  }, [gaaResponseData, onCloseTicketForm]);

  const getTicketOccupiedUserList = useCallback(async () => {
    const response = await request('/ticket-occupied-user-list', { method: 'GET' });
    if (response.success) {
      setOccupiedUsers(response?.data?.data || {});
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
      onCloseTicketForm();
    }
  }, [onCloseTicketForm]);

  useEffect(() => {
    if (ticket) {
      getTicketFormData(ticket.formId, ticket.responseId);
    } else if (tableData && tableColumns) {
      setFormData({ data: [tableData], columns: tableColumns });
    }
  }, [ticket, tableData, tableColumns, getTicketFormData]);

  useEffect(() => {
    getGAAData();
  }, [getGAAData]);

  useEffect(() => {
    getTicketOccupiedUserList();
    dispatch(getProjectMasterMakerLov());
    if (projectId) {
      dispatch(getUsers({ projectId, hasAccess }));
      dispatch(getProjectWiseTicketMapping({ projectId }));
      dispatch(getRoleProjects({ selectedProject: projectId }));
      dispatch(getAllSupervisors({ projectId: [projectId], hasAccess }));
    }
    dispatch(getLovsForMasterName('ORGANIZATION TYPE'));
  }, [dispatch, getTicketOccupiedUserList, projectId, hasAccess]);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        priority: Validations.required,
        issueId: Validations.required,
        subIssueId: Validations.required,
        assigneeType: Validations.required,
        mobileNumber: Yup.string().matches('^((\\+91)?|91)?[6789]\\d{9}$', ' ').required(' '),
        description: Validations.required,
        supervisorId: Yup.string().when('assigneeType', {
          is: (assigneeType) => assigneeType === 'supervisor',
          then: Yup.string().required(' ')
        }),
        assigneeId: Yup.string().when('assigneeType', {
          is: (assigneeType) => assigneeType === 'installer',
          then: Yup.string().required(' ')
        })
      })
    ),
    defaultValues: {
      issueId: ticket?.issueId || '',
      subIssueId: ticket?.subIssueId || '',
      assigneeType: ticket?.assigneeType || 'nomc',
      description: ticket?.description || '',
      supervisorId: ticket?.supervisorId || '',
      assigneeId: ticket?.assigneeId || '',
      ticketStatus: ticket?.ticketStatus || '',
      remarks: ticket?.remarks || '',
      mobileNumber: ticket?.mobileNumber || '',
      assignBy: ticket?.assignBy || '',
      priority: ticket?.priority || ''
    },
    mode: 'all'
  });

  const { handleSubmit, setValue, getValues } = methods;

  const assignByWatch = methods.watch('assignBy');
  const gaaLevelWatch = methods.watch('gaaLevel');
  const roleWatch = methods.watch('role');
  const organizationNameWatch = methods.watch('organizationName');
  const organizationTypeWatch = methods.watch('organizationType');
  const organizationBranchWatch = methods.watch('organizationBranch');
  useEffect(() => {
    let supervisor, installer;
    const supervisorIds = supervisorAssignmentsData.map((user) => user.id);
    const installerList = userData.filter((user) => !supervisorIds.includes(user.id));
    switch (assignByWatch) {
      case 'gaa': {
        supervisor =
          supervisorAssignmentsData?.filter((user) =>
            gaaLevelData.filter((data) => data.id === gaaLevelWatch)[0]?.userIds.includes(user.id)
          ) || [];
        installer =
          installerList?.filter((user) => gaaLevelData.filter((data) => data.id === gaaLevelWatch)[0]?.userIds.includes(user.id)) || [];
        break;
      }
      case 'role': {
        supervisor = [...supervisorAssignmentsData] || [];
        installer = installerList?.filter((user) => user.roleId === roleWatch) || [];
        break;
      }
      case 'organization': {
        supervisor =
          supervisorAssignmentsData?.filter(
            (user) =>
              user.oraganizationId === organizationNameWatch &&
              user.oraganizationType === organizationTypeWatch &&
              (organizationBranchWatch ? user.organisationBranchId === organizationBranchWatch : true)
          ) || [];
        installer =
          installerList?.filter(
            (user) =>
              user.oraganizationId === organizationNameWatch &&
              user.oraganizationType === organizationTypeWatch &&
              (organizationBranchWatch ? user.organisationBranchId === organizationBranchWatch : true)
          ) || [];
        break;
      }
      default: {
        supervisor = [];
        installer = [];
      }
    }
    supervisor = supervisor.map((user) => ({ id: user.id, name: `${user.name}-${user.code}` }));
    installer = installer.map((user) => ({ id: user.id, name: `${user.name}-${user.code}` }));
    setUserList({ supervisor, installer });
  }, [
    assignByWatch,
    gaaLevelWatch,
    roleWatch,
    organizationBranchWatch,
    organizationNameWatch,
    organizationTypeWatch,
    userData,
    supervisorAssignmentsData,
    gaaLevelData
  ]);

  useEffect(() => {
    if (organizationTypeWatch && organizationNameWatch) {
      dispatch(
        getOrganizationsLocationByParent({
          params: organizationTypeWatch + '/' + organizationNameWatch,
          hasAccess
        })
      );
    }
    if (organizationTypeWatch) {
      dispatch(getDropdownOrganization(`${organizationTypeWatch}?hasAccess=${hasAccess}`));
    }
  }, [dispatch, organizationTypeWatch, organizationNameWatch, hasAccess]);

  const setMethodValue = useCallback(
    (assignBy, assignedUser, gaaLevels) => {
      if (assignBy === 'role') {
        setValue('role', assignedUser?.roleId || '');
      } else if (assignBy === 'organization') {
        setValue('organizationBranch', assignedUser?.organisationBranchId || '');
        setValue('organizationName', assignedUser?.oraganizationId || '');
        setValue('organizationType', assignedUser?.oraganizationType || '');
      } else if (assignBy === 'gaa') {
        for (let i = 0; i < gaaLevels.length; i++) {
          const { userIds, id } = gaaLevels[i];
          if (userIds?.includes(assignedUser?.id)) {
            setValue('gaaLevel', id);
            break;
          }
        }
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (!ticket || ticket.assigneeType === 'nomc') return;
    let assignedUser = null;
    switch (getValues('assigneeType')) {
      case 'installer': {
        if (!userData.length) return;
        [assignedUser] = userData.filter((user) => user.id === getValues('assigneeId'));
        break;
      }
      case 'supervisor': {
        if (!supervisorAssignmentsData.length) return;
        [assignedUser] = supervisorAssignmentsData.filter((supervisor) => supervisor.id === getValues('supervisorId'));
        break;
      }
    }
    setMethodValue(getValues('assignBy'), assignedUser, gaaLevelData);
  }, [userData, supervisorAssignmentsData, gaaLevelData, setMethodValue, getValues, ticket]);

  const onGeoLocationClickHandler = (geoLocationString) => {
    const location = geoLocationString.split(',');
    window.open(`https://maps.google.com?q=${location[0]},${location[1]}`, '_blank');
  };

  const onSubmitHandler = async (values) => {
    setLoading(true);

    if (!ticket) {
      if (values.assigneeType) values.assignBy = 'organization';
      await onFormSubmit(values, projectWiseTicketMappingData[0]?.id);
      setLoading(false);
      return;
    }

    values.newAttachments = values['attachments-paths'];
    delete values['attachments-paths'];
    delete values['attachments'];

    //Update ticket
    const payload = {
      ...ticket,
      ...values
    };

    if (values.assigneeType === 'supervisor' || values.assigneeType === 'installer') {
      if (values.assigneeType === 'supervisor') {
        payload.assigneeId = values.supervisorId;
      } else if (values.assigneeType === 'installer') {
        payload.supervisorId = null;
      }
      payload.ticketStatus = payload.ticketStatus === 'open' ? 'assigned' : payload.ticketStatus;
    } else {
      payload.assigneeId = null;
      payload.supervisorId = null;
      payload.ticketStatus = payload.ticketStatus === 'assigned' ? 'open' : payload.ticketStatus;
    }

    if (payload.ticketStatus === 'closed') {
      payload.supervisorId = null;
      payload.assigneeId = null;
    }

    const response = await request('/update-ticket', { method: 'PUT', params: ticket.id, body: payload });
    if (response.success) {
      toast(`Ticket updated successfully.`, { variant: 'success', autoHideDuration: 10000 });
      onCloseTicketForm(true);
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }

    setLoading(false);
  };

  return (
    <>
      {tableData && (
        <Stack spacing={2} sx={{ mb: 2 }}>
          <TableForm
            hidePagination
            hideHeader
            data={formData?.data?.map((data, index) => ({ ...data, id: index })) || []}
            columns={formData?.columns?.map((field) => ({ Header: field.name, accessor: field.name })) || []}
            count={formData?.data?.length || 0}
            hideEmptyTable
            hideActions={true}
          />
        </Stack>
      )}
      {tableData && tableData['MDM Payload Status'] !== 'Success' ? (
        <Alert severity="error" icon={<WarningIcon sx={{ ml: 1, mr: 0.5, mt: 0.5 }} />}>
          <AlertTitle sx={{ mt: 1 }}>{`O&M activity can't be performed. Please sync data to MDM before proceeding.`}</AlertTitle>
        </Alert>
      ) : tableData && openTickets?.length > 0 ? (
        <>
          <Alert severity="error" icon={<WarningIcon sx={{ ml: 1, mr: 0.5, mt: 0.5 }} />} sx={{ mb: 2 }}>
            <AlertTitle sx={{ mt: 1 }}>Ticket Already Exists.</AlertTitle>
          </Alert>
          <TableForm
            hidePagination
            hideHeader
            data={openTickets || []}
            columns={ticketTableColumns}
            count={openTickets?.length || 0}
            hideEmptyTable
            hideActions={true}
          />
        </>
      ) : (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitHandler)}>
          <MainCard
            title={
              ticket ? (
                <Grid sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <IconButton sx={{ position: 'absolute', left: 10 }} onClick={() => onCloseTicketForm()} color="primary">
                    <ArrowBackOutlinedIcon />
                  </IconButton>
                  <Typography sx={{ position: 'relative', left: 25 }} variant="h4">
                    {`Edit Ticket : ${ticket?.updatedTicketNumber || ''}`}
                  </Typography>
                </Grid>
              ) : null
            }
          >
            <Grid container rowSpacing={3} columnSpacing={2} sx={{ mb: 4 }} alignItems={'flex-end'}>
              {ticket && (
                <Grid item xs={12}>
                  <TableForm
                    hidePagination
                    hideHeader
                    data={formData?.data?.map((data, index) => ({ ...data, id: index })) || []}
                    columns={formData?.columns?.map((field) => ({ Header: field.name, accessor: field.name })) || []}
                    count={formData?.data?.length || 0}
                    hideEmptyTable
                    hideActions={true}
                  />
                </Grid>
              )}
              <Grid item xs={3}>
                <RHFTextField
                  disabled={disableFields}
                  name={'mobileNumber'}
                  type={'number'}
                  placeholder={'Mobile Number'}
                  label={'Consumer Mobile Number'}
                  required
                />
              </Grid>
              <Grid item xs={3}>
                <RHFTextField
                  name={'geoLocation'}
                  label={'Geo Location'}
                  value={ticket ? formData?.location || '' : geoLocation}
                  disabled
                />
              </Grid>
              <Grid item xs={3}>
                {(ticket ? formData?.location : geoLocation) && (
                  <Button
                    disabled={disableFields}
                    onClick={() => {
                      onGeoLocationClickHandler(ticket ? formData?.location || ',' : geoLocation);
                    }}
                  >
                    View on Map
                  </Button>
                )}
              </Grid>
            </Grid>
            <Grid container rowSpacing={3} columnSpacing={2}>
              <Grid item md={3}>
                <RHFSelectbox
                  name={'issueId'}
                  placeholder="Select Issue Type"
                  label={'Issue Type'}
                  onChange={() => {
                    methods.setValue('subIssueId', '');
                  }}
                  menus={projectWiseTicketMappingData[0]?.issueFields}
                  disable={disableFields}
                  required
                />
              </Grid>
              <Grid item md={3}>
                <RHFSelectbox
                  name={'subIssueId'}
                  placeholder="Select Sub Issue Type"
                  label={'Sub-Issue Type'}
                  menus={projectMasterMakerLovData
                    .filter((lov) => lov.masterId === methods.watch('issueId'))
                    .map((lov) => ({ name: lov.name, id: lov.id }))}
                  disable={disableFields}
                  required
                />
              </Grid>
              {ticketStatusTypeList && ticket && (
                <Grid item md={3}>
                  <RHFSelectbox
                    name={'ticketStatus'}
                    placeholder="Select ticket status"
                    label={'Ticket Status'}
                    menus={ticketStatusTypeList}
                    disable={disableFields}
                    onChange={(e) => {
                      if (e?.target?.value === 'open') {
                        methods.setValue('assigneeId', '');
                        methods.setValue('supervisorId', '');
                        methods.setValue('assigneeType', 'nomc');
                        methods.setValue('assignBy', '');
                      }
                    }}
                  />
                </Grid>
              )}
              <Grid item md={3}>
                <RHFSelectbox
                  required
                  name={'priority'}
                  placeholder="Select ticket priority"
                  label={'Ticket Priority'}
                  menus={TICKET_PRIORITY_LIST}
                  disable={disableFields}
                  allowClear
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <RHFRadio
                  name="assigneeType"
                  title="Assignee Type"
                  singleLineRadio={'true'}
                  disabled={(ticket && methods.watch('ticketStatus') !== 'assigned') || disableFields}
                  labels={[
                    { name: 'NOMC', value: 'nomc', disabled: ticket && methods.watch('ticketStatus') !== 'open' },
                    { name: 'Supervisor', value: 'supervisor' },
                    { name: 'O&M Engineer', value: 'installer' }
                  ]}
                  onChange={(e) => {
                    methods.setValue('role', '');
                    methods.setValue('assigneeId', '');
                    methods.setValue('supervisorId', '');
                    methods.setValue('organizationType', '');
                    methods.setValue('organizationName', '');
                    methods.setValue('organizationBranch', '');

                    if (e.target.value === 'nomc') {
                      methods.setValue('assignBy', '');
                    }
                  }}
                  style={{
                    '& label': { marginTop: '0', width: '33%' },
                    marginTop: '10px !important',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.divider : theme.palette.grey.A800,
                    padding: '3px 0'
                  }}
                  required
                />
              </Grid>
              <Grid item xs={8} md={6}>
                <RHFRadio
                  name="assignBy"
                  title="Assign By"
                  singleLineRadio={'true'}
                  labels={[
                    { name: 'GAA', value: 'gaa' },
                    { name: 'Role', value: 'role' },
                    { name: 'Organization', value: 'organization' }
                  ]}
                  disabled={
                    !methods.watch('assigneeType') ||
                    methods.watch('assigneeType') === 'nomc' ||
                    (ticket && methods.watch('ticketStatus') !== 'assigned') ||
                    disableFields
                  }
                  style={{
                    '& label': { marginTop: '0', width: '33%' },
                    marginTop: '10px !important',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.divider : theme.palette.grey.A800,
                    padding: '3px 0'
                  }}
                  required
                />
              </Grid>
              {methods.watch('assigneeType') === 'supervisor' && methods.watch('assignBy') && (
                <Grid item xs={12}>
                  <Typography color="error">Note: {SUPERVISOR_NOTES[methods.watch('assignBy')]}</Typography>
                </Grid>
              )}
              {methods.watch('assigneeType') !== 'nomc' && methods.watch('assignBy') && (
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {methods.watch('assignBy') === 'role' && methods.watch('assigneeType') !== 'supervisor' && (
                      <Grid item xs={3}>
                        <RHFSelectbox
                          name={'role'}
                          placeholder="Role"
                          label={'Select Role'}
                          menus={roleProjectsData?.filter(({ forTicket }) => forTicket)}
                          onChange={() => {
                            methods.setValue('supervisorId', '');
                            methods.setValue('assigneeId', '');
                          }}
                          required
                          disable={ticket && methods.watch('ticketStatus') !== 'assigned'}
                        />
                      </Grid>
                    )}
                    {methods.watch('assignBy') === 'organization' && (
                      <>
                        <Grid item md={3}>
                          <RHFSelectbox
                            name={'organizationType'}
                            placeholder="Organization Type"
                            label={'Select Organization Type'}
                            menus={organizationTypeData}
                            onChange={() => {
                              methods.setValue('organizationName', '');
                              methods.setValue('organizationBranch', '');
                              methods.setValue('supervisorId', '');
                              methods.setValue('assigneeId', '');
                            }}
                            required
                            disable={ticket && methods.watch('ticketStatus') !== 'assigned'}
                          />
                        </Grid>
                        <Grid item md={3}>
                          <RHFSelectbox
                            name={'organizationName'}
                            placeholder="Organization Name"
                            label={'Select Organization Name'}
                            menus={organizationListData}
                            onChange={() => {
                              methods.setValue('organizationBranch', '');
                              methods.setValue('supervisorId', '');
                              methods.setValue('assigneeId', '');
                            }}
                            required
                            disable={ticket && methods.watch('ticketStatus') !== 'assigned'}
                          />
                        </Grid>
                        <Grid item md={3}>
                          <RHFSelectbox
                            name={'organizationBranch'}
                            placeholder="Organization Branch"
                            label={'Select Organization Branch'}
                            menus={concateNameAndCode(organizationBranchData)}
                            onChange={() => {
                              methods.setValue('supervisorId', '');
                              methods.setValue('assigneeId', '');
                            }}
                            allowClear
                            disable={ticket && methods.watch('ticketStatus') !== 'assigned'}
                          />
                        </Grid>
                      </>
                    )}
                    {methods.watch('assignBy') === 'gaa' && (
                      <Grid item md={3}>
                        <RHFSelectbox
                          name={'gaaLevel'}
                          placeholder="GAA Level"
                          label={'Select GAA Level'}
                          menus={gaaLevelData.map((data) => ({ id: data.id, name: `${data.name} (${data.value})` }))}
                          onChange={() => {
                            methods.setValue('supervisorId', '');
                            methods.setValue('assigneeId', '');
                          }}
                          allowClear
                          disable={ticket && methods.watch('ticketStatus') !== 'assigned'}
                        />
                      </Grid>
                    )}
                    <Grid item xs={3}>
                      <RHFSelectbox
                        name={methods.watch('assigneeType') === 'supervisor' ? 'supervisorId' : 'assigneeId'}
                        placeholder={methods.watch('assigneeType') === 'supervisor' ? 'Supervisor' : 'O&M Engineer'}
                        label={`Select ${methods.watch('assigneeType') === 'supervisor' ? 'Supervisor' : 'O&M Engineer'}`}
                        menus={userList[methods.watch('assigneeType')].map((user) => ({
                          id: user.id,
                          name: `${user.name} (${occupiedUsers[user.id] || 0})`
                        }))}
                        required
                        disable={ticket && methods.watch('ticketStatus') !== 'assigned'}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
              <Grid item xs={6}>
                <RHFTextField
                  required
                  name={'description'}
                  disabled={disableFields}
                  label={'Ticket Description'}
                  placeholder="Enter ticket description"
                  multiline
                  rows={5}
                />
              </Grid>
              <Grid item xs={6}>
                <RHFTextField
                  name={'remarks'}
                  disabled={disableFields}
                  label={'Remarks'}
                  placeholder="Enter ticket remarks"
                  multiline
                  rows={5}
                />
              </Grid>
              <Grid item xs={4} sx={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <Button
                  disabled={!methods.watch('attachments')}
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    setOpenImage(true);
                  }}
                >
                  View Attachments
                </Button>
                <FileSections disabled={disableFields} fileFields={fileFields} setValue={setValue} />
              </Grid>
              <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                <Button sx={{ mt: 1 }} disabled={disableFields || loading} variant="contained" size="small" color="primary" type="submit">
                  {ticket ? 'Update Ticket' : 'Raise Ticket'}
                </Button>
              </Grid>
            </Grid>
          </MainCard>
        </FormProvider>
      )}
      {/* {imageFile && <img src={imageFile} />} */}
      <Dialog open={openImage} onClose={() => setOpenImage(null)} scroll="paper" disableEscapeKeyDown>
        <ImageCard base64Image imageList={methods.watch('attachments-paths')?.map((item) => item.fileData) || []} />
      </Dialog>
    </>
  );
};

TicketForm.propTypes = {
  projectId: PropTypes.string,
  onFormSubmit: PropTypes.func,
  ticket: PropTypes.any,
  tableData: PropTypes.any,
  tableColumns: PropTypes.array,
  ticketStatusTypeList: PropTypes.array,
  openTickets: PropTypes.array,
  onCloseTicketForm: PropTypes.func,
  geoLocation: PropTypes.string,
  disableFields: PropTypes.bool,
  gaaResponseData: PropTypes.object
};

export default TicketForm;
