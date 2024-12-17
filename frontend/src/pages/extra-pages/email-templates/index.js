import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Divider, Grid, IconButton, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useProjects } from '../project/useProjects';
import { useTemplateList } from './useTemplateList';
import CreateNewTemplates from './create-template';
import MainCard from 'components/MainCard';
import { getDropdownProjects, getEmailTemplates } from 'store/actions';
import { FormProvider, RHFSelectbox } from 'hook-form';
import Validations from 'constants/yupValidations';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import ConfirmModal from 'components/modal/ConfirmModal';

const AddCard = ({ openCreate }) => {
  return (
    <MainCard sx={{ height: 150 }}>
      <Grid container spacing={1}>
        <Grid item md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton sx={{ width: '4rem', height: '4.5rem', color: 'blue' }} onClick={openCreate}>
            <AddIcon sx={{ fontSize: '4.5rem' }} />
          </IconButton>
        </Grid>
        <Grid item md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Create New Template
        </Grid>
      </Grid>
    </MainCard>
  );
};

AddCard.propTypes = {
  openCreate: PropTypes.func
};

const MyCard = ({ data, onEdit, onDelete }) => {
  return (
    <MainCard sx={{ height: 150, width: '100%' }}>
      <Grid container spacing={1}>
        <Grid item md={12} sx={{ fontWeight: 'bold', fontSize: 17, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {data?.displayName}
        </Grid>
        <Grid item md={12} sx={{ fontSize: 14 }}>
          {data?.transaction_type?.name}
        </Grid>
        <Grid item md={12}>
          <Divider sx={{ mt: 2, mb: -0.5, ml: -3, mr: -3 }} />
        </Grid>
        <Grid item md={12} sx={{ fontSize: 13, display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title="Delete" placement="bottom">
            <IconButton color="secondary" onClick={onDelete}>
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit" placement="bottom">
            <IconButton color="secondary" onClick={onEdit}>
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </MainCard>
  );
};

MyCard.propTypes = {
  data: PropTypes.any,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

const EmailTemplates = () => {
  const dispatch = useDispatch();
  const [createOrEdit, setCreateOrEdit] = useState(false);
  const [edit, setEdit] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [templateSet, setTemplateSet] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [projectId, setProjectId] = useState(null);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit } = methods;

  useEffect(() => {
    dispatch(getEmailTemplates());
  }, [dispatch]);

  const { templateList } = useTemplateList();

  const { templateData } = useMemo(
    () => ({
      templateData: templateList?.templateObject?.rows || [],
      count: templateList?.templateObject?.count || 0
    }),
    [templateList]
  );

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

  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  const { projectsDropdown } = useProjects();
  const { projectData } = useMemo(
    () => ({
      projectData: projectsDropdown?.projectsDropdownObject || []
    }),
    [projectsDropdown]
  );

  useEffect(() => {
    if (projectId && projectId !== null && templateData && templateData.length > 0) {
      setTemplateSet(templateData.filter((val) => val.projectId === projectId));
    }
  }, [projectData, projectId, templateData]);

  const openCreate = () => {
    setCreateOrEdit(true);
  };

  const onEdit = (value) => {
    setEdit(true);
    setEditData(value);
    setCreateOrEdit(true);
  };

  const confirmDelete = async () => {
    const response = await request('/email-template-delete', { method: 'DELETE', params: deleteId });
    if (response.success) {
      onClose();
      setTemplateSet(templateData.filter((val) => val.id !== deleteId));
      setDeleteId(null);
      setOpenDeleteModal(false);
    } else {
      toast(response?.error?.message);
    }
  };

  const onClose = () => {
    setEdit(false);
    setEditData(null);
    setCreateOrEdit(false);
    dispatch(getEmailTemplates());
  };

  const onFormSubmit = (value) => {
    setProjectId(value.projectId);
    setTemplateSet(templateData.filter((val) => val.projectId === value.projectId));
    setShowDetails(true);
  };

  return (
    <>
      {!createOrEdit ? (
        <MainCard title={'Email Templates List'} sx={{ mb: 2 }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
            <Grid container spacing={4}>
              <Grid item xs={3}>
                {selectBox('projectId', 'Project', projectData, true)}
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems={'center'} sx={{ mt: 2 }}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                <Button size="small" type="submit" variant="contained" color="primary">
                  Proceed
                </Button>
              </Grid>
            </Grid>
          </FormProvider>
          {showDetails && (
            <Grid container spacing={4} alignItems="center" sx={{ mb: 2 }}>
              <Grid item md={3} spacing={3}>
                <AddCard openCreate={openCreate} />
              </Grid>
              {templateSet &&
                templateSet.length > 0 &&
                templateSet.map((val) => (
                  <Grid key={val} md={3} item spacing={4}>
                    <MyCard
                      data={val}
                      onEdit={() => {
                        onEdit(val);
                      }}
                      onDelete={() => {
                        setDeleteId(val.id);
                        setOpenDeleteModal(true);
                      }}
                    />
                  </Grid>
                ))}
            </Grid>
          )}
        </MainCard>
      ) : (
        <CreateNewTemplates edit={edit} data={editData} onClose={onClose} projectId={projectId} />
      )}
      <ConfirmModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete?"
        confirmBtnTitle="Delete"
      />
    </>
  );
};

export default EmailTemplates;
