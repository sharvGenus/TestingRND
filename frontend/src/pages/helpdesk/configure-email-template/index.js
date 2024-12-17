import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTicketMapping } from '../configurator/useTicketMapping';
import CreateNewTemplates from './create-email-template';
import { useEmailTemplate } from './useEmailTemplate';
import TableForm from 'tables/table';
import { getProjectMasterMakerLov, getProjectWiseTicketMapping, getTicketEmailTemplates } from 'store/actions';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import ConfirmModal from 'components/modal/ConfirmModal';
import usePagination from 'hooks/usePagination';
import { useProjectMasterMakerLov } from 'pages/extra-pages/project-master-maker-lov/useProjectMasterMakerLov';

const ConfigureEmailTemplate = () => {
  const templateTableHeader = [
    {
      Header: 'Template Name',
      accessor: 'templateName'
    },
    {
      Header: 'Project',
      accessor: 'project.name'
    },
    {
      Header: 'Subject',
      accessor: 'subject'
    },
    {
      Header: 'Issue',
      accessor: (list) =>
        list?.['issueIds']?.map((issueId, index) => (
          <>
            <Fragment key={issueId}>
              {
                projectWiseTicketMappingData
                  .filter((mapping) => mapping.projectId === list['projectId'])[0]
                  ?.['issueFields']?.filter((issue) => issue.id === issueId)[0]?.name
              }
            </Fragment>
            {index < list['issueIds'].length - 1 && <br />}
          </>
        ))
    },
    {
      Header: 'Sub Issues',
      accessor: (list) =>
        list?.['subIssueIds']?.map((subIssueId, index) => (
          <>
            <Fragment key={subIssueId}>{projectMasterMakerLovData.filter((lov) => lov.id === subIssueId)[0]?.['name']}</Fragment>
            {index < list['subIssueIds'].length - 1 && <br />}
          </>
        ))
    }
  ];

  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();

  const dispatch = useDispatch();
  const [createOrEdit, setCreateOrEdit] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const deleteIdRef = useRef(null);

  const { projectMasterMakerLovs } = useProjectMasterMakerLov();
  const projectMasterMakerLovData = projectMasterMakerLovs?.projectMasterMakerLovsObject?.rows || [];

  const { projectWiseTicketMapping } = useTicketMapping();
  const projectWiseTicketMappingData = projectWiseTicketMapping?.projectWiseTicketMappingObject?.rows || [];

  const { templateList } = useEmailTemplate();
  const { templateData, templateCount } = useMemo(
    () => ({
      templateData: templateList?.ticketEmailTemplates?.rows || [],
      templateCount: templateList?.ticketEmailTemplates?.count || 0
    }),
    [templateList]
  );

  const getEmailTemplates = useCallback(() => {
    dispatch(getTicketEmailTemplates({ pageIndex, pageSize }));
  }, [dispatch, pageIndex, pageSize]);

  useEffect(() => {
    getEmailTemplates();
  }, [getEmailTemplates]);

  useEffect(() => {
    dispatch(getProjectMasterMakerLov());
    dispatch(getProjectWiseTicketMapping());
  }, [dispatch]);

  const confirmDelete = async () => {
    const response = await request('/ticket-email-template-delete', { method: 'DELETE', params: deleteIdRef.current });
    if (response.success) {
      toast(`Successfully deleted email template.`, {
        variant: 'success',
        autoHideDuration: 10000
      });
      deleteIdRef.current = null;
      setOpenDeleteModal(false);
      getEmailTemplates();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  return (
    <>
      {createOrEdit ? (
        <CreateNewTemplates
          edit={edit}
          data={editData}
          onClose={(isChanged) => {
            setCreateOrEdit(false);
            setEdit(false);
            setEditData();
            if (isChanged) {
              getEmailTemplates();
            }
          }}
        />
      ) : (
        <TableForm
          title="Email Templates"
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
          hideHistoryIcon
          hideExportButton
          onClick={() => {
            setCreateOrEdit(true);
          }}
          handleRowDelete={(id) => {
            deleteIdRef.current = id;
            setOpenDeleteModal(true);
          }}
          handleRowUpdate={(e) => {
            setCreateOrEdit(true);
            setEditData(e);
            setEdit(true);
          }}
          handleRowView={(e) => {
            setCreateOrEdit(true);
            setEditData(e);
            setEdit(false);
          }}
          data={templateData}
          columns={templateTableHeader}
          count={templateCount}
        />
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

export default ConfigureEmailTemplate;
