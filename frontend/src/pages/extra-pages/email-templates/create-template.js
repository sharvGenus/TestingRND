import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mention, MentionsInput } from 'react-mentions';
import { Button, Grid, Switch, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import { useUsers } from '../users/useUsers';
import { useSmtp } from '../smtp-configuration/useSmtp';
import { useProjects } from '../project/useProjects';
import { useApprovers } from '../approver/useApprover';
import { useOrganizations } from '../organization/useOrganizations';
import Parts from './htmlParts';
import { FormProvider, RHFSelectbox, RHFTextField, RHFSelectTags } from 'hook-form';
import MainCard from 'components/MainCard';
import {
  fetchRequestDetails,
  fetchStockLedgerDetailList,
  getApprovers,
  getDropdownProjects,
  getLovsForMasterName,
  getOrganizationsListData,
  getSmtp,
  getUsers
} from 'store/actions';
import Validations from 'constants/yupValidations';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import { concateNameAndCode } from 'utils';
import { useRequest } from 'pages/receipts/mrf-receipt/useRequest';

const CreateNewTemplates = ({ onClose, edit, data, projectId }) => {
  const dispatch = useDispatch();
  const [bodyValue, setBodyValue] = useState('');
  const [showBodyError, setShowBodyError] = useState(false);
  const [isAttachments, setIsAttachments] = useState(false);
  const [forApprover, setForApprover] = useState(false);
  const [project, setProject] = useState(null);
  const [transactionType, setTransactionType] = useState(null);
  const [orgName, setOrgName] = useState(null);
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        transactionTypeId: Validations.transaction,
        displayName: Validations.displayName,
        templateName: Validations.templateName,
        organizationId: Validations.organizationId,
        subject: Validations.subject,
        from: Validations.from,
        to: Validations.to
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const suggestions = [
    {
      id: 'transactionTypeId',
      display: 'transactionTypeId'
    },
    {
      id: 'referenceDocumentNumber',
      display: 'referenceDocumentNumber'
    },
    {
      id: 'poNumber',
      display: 'poNumber'
    },
    {
      id: 'lrNumber',
      display: 'lrNumber'
    }
  ];

  const approverSuggestions = [
    {
      id: 'referenceDocumentNumber',
      display: 'referenceDocumentNumber'
    },
    {
      id: 'requestNumber',
      display: 'requestNumber'
    },
    {
      id: 'email',
      display: 'email'
    },
    {
      id: 'name',
      display: 'name'
    }
  ];

  useEffect(() => {
    dispatch(getLovsForMasterName('TRANSACTION TYPE'));
    dispatch(getOrganizationsListData());
    dispatch(
      fetchRequestDetails({
        sortBy: 'updatedAt',
        sortOrder: 'DESC'
      })
    );
    dispatch(
      fetchStockLedgerDetailList({
        sortBy: 'updatedAt',
        sortOrder: 'DESC'
      })
    );
    dispatch(getUsers());
    dispatch(getDropdownProjects());
    dispatch(getSmtp({ all: true }));
  }, [dispatch]);

  const { smtp } = useSmtp();
  const smtpData = smtp.smtpObject?.rows || [];

  const { organizationsGetListData } = useOrganizations();
  const organizationListData = organizationsGetListData?.organizationGetListObject?.rows || [];

  const { masterMakerOrgType } = useMasterMakerLov();
  const transactionTypeData = masterMakerOrgType?.masterObject;
  const { transactionRequest } = useRequest();
  const { stockLedgerDetailList } = useStockLedger();
  const { users } = useUsers();
  const { projectsDropdown } = useProjects();

  const projectData = projectsDropdown?.projectsDropdownObject;

  const { reqData } = useMemo(
    () => ({
      reqData: transactionRequest?.requestDetails?.rows || [],
      reqCount: transactionRequest?.requestDetails?.count || 0
    }),
    [transactionRequest]
  );

  const { traxnData } = useMemo(
    () => ({
      traxnData: stockLedgerDetailList?.stockLedgerDetailListObject?.rows || [],
      traxnCount: stockLedgerDetailList?.stockLedgerDetailListObject?.count || 0
    }),
    [stockLedgerDetailList]
  );
  const usersData = users?.usersObject?.rows || [];
  const mentionInput = {
    minHeight: 200
  };

  const errorFont = {
    fontSize: 12,
    marginLeft: 5
  };

  const { handleSubmit, setValue, reset } = methods;

  const txtBox = (name, label, type, req, shrink = true) => {
    return <RHFTextField name={name} type={type} label={label} InputLabelProps={{ shrink: shrink }} {...(req && { required: true })} />;
  };

  const selectBox = (name, label, menus, req, onChange) => {
    return (
      <RHFSelectbox
        multiple={false}
        name={name}
        label={label}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        {...(onChange && { onChange })}
        {...(req && { required: true })}
      />
    );
  };

  const selectTags = (name, label, menus, req, onChange) => {
    return (
      <RHFSelectTags
        name={name}
        label={label}
        showId={true}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        {...(onChange && { onChange })}
        {...(req && { required: true })}
        success={true}
      />
    );
  };

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };

    if (edit) {
      handleSetValues(data);
      setIsAttachments(data?.isAttchmentAvailable);
      setProject(data?.projectId);
      setTransactionType(data?.transactionTypeId);
      setOrgName(data?.organizationId);
      const bodyContent = data?.body?.split("id='emailBody'>")[1]?.split('</div></div></body></html>')[0];
      setBodyValue(bodyContent?.replace(/<br\s*\/?>/gi, '\n'));
      setForApprover(data?.forApprover);
    } else if (projectId) {
      setValue('projectId', projectId);
      setProject(projectId);
    }
  }, [data, edit, projectId, setValue, setBodyValue]);

  const handleChange = (e) => {
    let val = e.target.value;
    setBodyValue(val);
  };

  const onFormSubmit = async (values) => {
    if (bodyValue === '') setShowBodyError(true);
    else {
      setShowBodyError(false);
      // const htmlData = (Parts.upperParts + values.displayName + Parts.midParts + bodyValue + Parts.lowerParts)
      const htmlData = (Parts.upperParts + Parts.midParts + bodyValue + Parts.lowerParts)
        .replace(/(?:\r\n|\r|\n)/g, '<br/>')
        .replace(/\s+/g, ' ');
      const payload = {
        ...values,
        isAttchmentAvailable: isAttachments,
        forApprover: forApprover,
        body: htmlData,
        remarks: ''
      };
      const val = edit
        ? await request('/email-template-update', { method: 'PUT', body: payload, params: data.id })
        : await request('/email-template-create', { method: 'POST', body: payload });
      if (!val?.success) {
        toast(val?.error?.message || 'Something wrong happened!', { variant: 'error' });
      } else {
        reset();
        onClose();
      }
    }
  };

  const getSuggestions = () => {
    let keySet = {};
    if (traxnData.length > 0) keySet = { ...keySet, ...traxnData[0] };
    if (reqData.length > 0) keySet = { ...keySet, ...reqData[0] };
    const arr = [...new Set(Object.keys(keySet))];
    const retSuggestions = [];
    arr.map((val) => {
      retSuggestions.push({
        id: val,
        display: val
      });
    });
    return retSuggestions && retSuggestions.length > 0 ? retSuggestions : suggestions;
  };

  const createEmailList = (arr) => {
    let list = [];
    arr.map((val) => {
      if (val && val.email)
        list.push({
          id: val?.email,
          name: val?.name
        });
    });
    return list;
  };

  const createFrom = (arr) => {
    let list = [];
    arr.map((val) => {
      if (val && val.username)
        list.push({
          id: val?.username,
          name: val?.username
        });
    });
    return list;
  };

  const onSelectedProject = (e) => {
    if (e?.target?.value) setProject(e?.target?.value);
  };

  const onSelectedTrsactionType = (e) => {
    if (e?.target?.value) setTransactionType(e?.target?.value);
  };

  const onSelectedOrgName = (e) => {
    if (e?.target?.value) setOrgName(e?.target?.value);
  };

  useEffect(() => {
    if (project && transactionType && project !== null && transactionType !== null) {
      // TODO add StoreId
      dispatch(getApprovers({ projectId: project, transactionTypeId: transactionType, all: true }));
    }
  }, [project, transactionType, dispatch]);

  const { approvers } = useApprovers();

  const { approversData } = useMemo(
    () => ({
      approversData: approvers?.approversObject?.rows || [],
      count: approvers?.approversObject?.count || 0
    }),
    [approvers]
  );

  // useEffect(() => {
  //   if (approversData && approversData.length > 0) setForApprover(true);
  //   else setForApprover(false);
  // }, [approversData]);

  const addName = (arr) => {
    const newArr = [];
    arr &&
      arr.length > 0 &&
      arr.map((val) => {
        val.name = val?.user?.name;
        newArr.push(val);
      });
    return newArr;
  };

  const filterByOrg = (arr) => {
    let respArr = [];
    if (arr && arr.length > 0) {
      respArr = arr.filter((val) => val?.organization?.id === orgName);
    }
    return respArr;
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Email Templates'} sx={{ mb: 2 }}>
          <Grid container spacing={4} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={3}>
              {selectBox('projectId', 'Project', projectData, true, onSelectedProject)}
            </Grid>
            <Grid item xs={3}>
              {selectBox('transactionTypeId', 'Transaction Type', transactionTypeData, true, onSelectedTrsactionType)}
            </Grid>
            <Grid item xs={3}>
              {selectBox('organizationId', 'Organization Name', concateNameAndCode(organizationListData), true, onSelectedOrgName)}
            </Grid>
            <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Typography>Approver</Typography>
              <Switch
                checked={forApprover}
                onChange={(e) => {
                  setForApprover(e?.target?.checked);
                }}
                sx={{ margin: 'auto' }}
              />
            </Grid>
            <Grid item xs={3}>
              {selectBox('from', 'From', createFrom(smtpData), true)}
            </Grid>
            <Grid item xs={3}>
              {txtBox('displayName', 'Display Name', 'txt', true)}
            </Grid>
            <Grid item xs={3}>
              {txtBox('subject', 'Subject', 'txt', true)}
            </Grid>
            <Grid item xs={3}>
              {txtBox('templateName', 'Template Name', 'txt', true)}
            </Grid>
            <Grid item xs={4}>
              {selectTags(
                'to',
                'To',
                createEmailList(
                  forApprover
                    ? addName(structuredClone(approversData).filter((val) => val.organizationNameId === orgName))
                    : filterByOrg(usersData)
                ),
                true
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              {selectTags('cc', 'CC', createEmailList(filterByOrg(usersData)), false)}
            </Grid>
            <Grid item xs={12} sm={4}>
              {selectTags('bcc', 'BCC', createEmailList(filterByOrg(usersData)), false)}
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography mb={1}>Body*</Typography>
              <MentionsInput style={mentionInput} aria-multiline rows={6} value={bodyValue} onChange={handleChange}>
                <Mention
                  displayTransform={(id, display) => {
                    return '@[' + display + ']';
                  }}
                  data={forApprover ? approverSuggestions : getSuggestions()}
                  markup="@[__display__]"
                />
              </MentionsInput>
              {showBodyError && (
                <Typography color={'error'} style={errorFont}>
                  {'Body is required'}
                </Typography>
              )}
            </Grid>
            <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Typography>Attachments</Typography>
              <Switch
                checked={isAttachments}
                onChange={(e) => {
                  setIsAttachments(e?.target?.checked);
                }}
                sx={{ margin: 'auto' }}
              />
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
              <Button variant="outlined" onClick={onClose}>
                Back
              </Button>
              <Button variant="contained" type="submit">
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
  edit: PropTypes.bool,
  projectId: PropTypes.string
};

export default CreateNewTemplates;
