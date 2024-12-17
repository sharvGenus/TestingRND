import PropTypes from 'prop-types';
// import { useState } from 'react';
// import { Dialog } from '@mui/material';
import * as Yup from 'yup';
import { Button, Dialog, Grid } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { Headers } from './headers';
import Details from './details';
import { Actions, Table } from './TableComponent';
import { useProjectScope } from './useProjectScope';
import MainCard from 'components/MainCard';
import { FormProvider } from 'hook-form';
import Validations from 'constants/yupValidations';
import {
  getProjectScopeAllExtension,
  getProjectScopeAllSat,
  getProjectScopeExtension,
  getProjectScopeExtensionAllHistory,
  getProjectScopeExtensionHistory,
  getProjectScopeSat,
  getProjectScopeSatAllHistory,
  getProjectScopeSatHistory
} from 'store/actions';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import ConfirmModal from 'components/modal/ConfirmModal';
import FilesDisplayModal from 'components/modal/FilesDisplayModal';

const ExtAndSatDetails = ({ title, pageType, onBack, projectData, esData }) => {
  const dispatch = useDispatch();
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [data, setData] = useState([]);
  const [listType, setListType] = useState(1);
  const [recordData, setRecordData] = useState([]);
  const [detailType, setDetailType] = useState('');
  const [update, setUpdate] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [pageHIndex, setPageHIndex] = useState(1);
  const [pageHSize, setPageHSize] = useState(25);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const {
    projectScopeExtension,
    projectScopeExtensionHistory,
    projectScopeSat,
    projectScopeSatHistory,
    projectScopeAllExtension,
    projectScopeExtensionAllHistory,
    projectScopeAllSat,
    projectScopeSatAllHistory
  } = useProjectScope();

  const { extOrSatData, extOrSatDataCount } = useMemo(
    () => ({
      extOrSatData:
        pageType === 'extension'
          ? projectScopeExtension?.projectScopeExtensionObject?.rows
          : pageType === 'sat'
          ? projectScopeSat?.projectScopeSatObject?.rows
          : [],
      extOrSatDataCount:
        pageType === 'extension'
          ? projectScopeExtension?.projectScopeExtensionObject?.count
          : pageType === 'sat'
          ? projectScopeSat?.projectScopeSatObject?.count
          : 0
    }),
    [projectScopeExtension, projectScopeSat, pageType]
  );

  const { allData } = useMemo(
    () => ({
      allData:
        pageType === 'extension'
          ? projectScopeAllExtension?.projectScopeExtensionObject?.rows
          : pageType === 'sat'
          ? projectScopeAllSat?.projectScopeSatObject?.rows
          : []
    }),
    [projectScopeAllExtension, projectScopeAllSat, pageType]
  );

  const { extOrSatDataHistory, extOrSatDataHistoryCount } = useMemo(
    () => ({
      extOrSatDataHistory:
        pageType === 'extension'
          ? projectScopeExtensionHistory?.projectScopeExtensionHistoryObject?.rows
          : pageType === 'sat'
          ? projectScopeSatHistory?.projectScopeSatHistoryObject?.rows
          : [],
      extOrSatDataHistoryCount:
        pageType === 'extension'
          ? projectScopeExtensionHistory?.projectScopeExtensionHistoryObject?.count
          : pageType === 'sat'
          ? projectScopeSatHistory?.projectScopeSatHistoryObject?.count
          : 0
    }),
    [projectScopeExtensionHistory, projectScopeSatHistory, pageType]
  );

  const { allHData } = useMemo(
    () => ({
      allHData:
        pageType === 'extension'
          ? projectScopeExtensionAllHistory?.projectScopeExtensionHistoryObject?.rows
          : pageType === 'sat'
          ? projectScopeSatAllHistory?.projectScopeSatHistoryObject?.rows
          : []
    }),
    [projectScopeExtensionAllHistory, projectScopeSatAllHistory, pageType]
  );

  useEffect(() => {
    setData(extOrSatData);
  }, [extOrSatData]);

  const { handleSubmit } = methods;

  const onFormSubmit = async (values) => {
    if (pageType === 'extension') {
      values.extensionMonth = parseFloat(Number(values.extensionMonth).toFixed(2));
      values.extensionQuantity = parseFloat(Number(values.extensionQuantity).toFixed(3));
    }
    if (pageType === 'sat') {
      values.satExecutionQuantity = parseFloat(Number(values.satExecutionQuantity).toFixed(3));
    }

    let response;
    if (values.id) {
      let apiPath = '';
      if (pageType === 'extension') apiPath = '/project-scope-extension-update';
      if (pageType === 'sat') apiPath = '/project-scope-sat-update';
      response = await request(apiPath, { method: 'PUT', body: values, params: values.id });
    } else {
      let apiPath = '';
      if (pageType === 'extension') apiPath = '/project-scope-extension-create';
      if (pageType === 'sat') apiPath = '/project-scope-sat-create';
      response = await request(apiPath, { method: 'POST', body: values });
    }

    if (response.success) {
      let psec;
      if (pageType === 'extension') psec = 'Project Scope Extension';
      if (pageType === 'sat') psec = 'Project Scope Sat';
      const successMessage = values.id ? `${psec} updated successfully!` : `${psec} created successfully!`;
      if (pageType === 'extension') {
        dispatch(getProjectScopeExtension({ projectScopeId: values.projectScopeId, listType, pageIndex, pageSize }));
        dispatch(getProjectScopeAllExtension({ projectScopeId: values.projectScopeId, listType }));
      }
      if (pageType === 'sat') {
        dispatch(getProjectScopeSat({ projectScopeId: values.projectScopeId, listType, pageIndex, pageSize }));
        dispatch(getProjectScopeAllSat({ projectScopeId: values.projectScopeId, listType }));
      }
      setOpenDetails(false);
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
    } else {
      toast(response.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const onAdd = (dtlType) => {
    setOpenDetails(true);
    setDetailType(dtlType);
    setRecordData([]);
    setUpdate(false);
  };

  const onEdit = (editData) => {
    setRecordData(editData);
    setOpenDetails(true);
    setDetailType(pageType);
    setUpdate(true);
  };

  const onDelete = (deleteData) => {
    setRecordData(deleteData);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    let deleteUrl;
    if (pageType === 'extension') deleteUrl = '/project-scope-extension-delete';
    if (pageType === 'sat') deleteUrl = '/project-scope-sat-delete';

    const response = await request(deleteUrl, { method: 'DELETE', params: recordData.id });
    if (response.success) {
      setOpenDeleteModal(false);
      if (pageType === 'extension') {
        dispatch(getProjectScopeExtension({ projectScopeId: esData.id, listType, pageIndex, pageSize }));
        dispatch(getProjectScopeAllExtension({ projectScopeId: esData.id, listType }));
      } else if (pageType === 'sat') {
        dispatch(getProjectScopeSat({ projectScopeId: esData.id, listType, pageIndex, pageSize }));
        dispatch(getProjectScopeAllSat({ projectScopeId: esData.id, listType }));
      }
    } else {
      toast(response?.error?.message);
    }
  };

  const showHistory = (restoreData) => {
    setRecordData(restoreData);
    setOpenHistoryModal(true);
    if (pageType === 'extension') {
      dispatch(getProjectScopeExtensionHistory({ recordId: restoreData?.id, pageIndex: pageHIndex, pageSize: pageHSize }));
      dispatch(getProjectScopeExtensionAllHistory({ recordId: restoreData?.id }));
    }
    if (pageType === 'sat') {
      dispatch(getProjectScopeSatHistory({ recordId: restoreData?.id, pageIndex: pageHIndex, pageSize: pageHSize }));
      dispatch(getProjectScopeSatAllHistory({ recordId: restoreData?.id }));
    }
  };

  useEffect(() => {
    if (pageType === 'extension') {
      dispatch(getProjectScopeExtensionHistory({ recordId: recordData?.id, pageIndex: pageHIndex, pageSize: pageHSize }));
      dispatch(getProjectScopeExtensionAllHistory({ recordId: recordData?.id }));
    }
    if (pageType === 'sat') {
      dispatch(getProjectScopeSatHistory({ recordId: recordData?.id, pageIndex: pageHIndex, pageSize: pageHSize }));
      dispatch(getProjectScopeSatAllHistory({ recordId: recordData?.id }));
    }
  }, [dispatch, pageHIndex, pageHSize, pageType, recordData]);

  const fileFields = [
    {
      name: 'attachments',
      label: 'Attachments',
      accept: '*',
      required: true,
      multiple: true
    }
  ];

  const addActions = (dta, onlyHistory = false, noActions = false) => {
    return (
      dta &&
      dta.length &&
      dta.map((vl) => {
        return {
          ...vl,
          ...(pageType === 'extension' && {
            files: vl?.attachments && <FilesDisplayModal view fileFields={fileFields} tasks={[]} data={{ attachments: vl.attachments }} />
          }),
          ...(!noActions && {
            actions: (
              <Actions values={vl} onEdit={onEdit} onDelete={onDelete} showHistory={showHistory} onlyHistory={onlyHistory} hideExtAndSat />
            )
          })
        };
      })
    );
  };

  useEffect(() => {
    if (pageType === 'extension') {
      dispatch(getProjectScopeExtension({ projectScopeId: esData.id, listType, pageIndex, pageSize }));
      dispatch(getProjectScopeAllExtension({ projectScopeId: esData.id, listType }));
    } else if (pageType === 'sat') {
      dispatch(getProjectScopeSat({ projectScopeId: esData.id, listType, pageIndex, pageSize }));
      dispatch(getProjectScopeAllSat({ projectScopeId: esData.id, listType }));
    }
  }, [dispatch, pageType, esData, listType, pageIndex, pageSize]);

  return (
    <>
      {openDetails && (
        <MainCard style={{ marginTop: 20 }}>
          <Details
            data={recordData}
            dataType={detailType}
            update={update}
            preFilledData={esData}
            onBack={setOpenDetails}
            onSubmit={onFormSubmit}
            projectData={projectData}
          />
        </MainCard>
      )}
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        {data && (
          <MainCard style={{ marginTop: 20 }}>
            <Grid container>
              <Table
                tableTitle={title}
                tableData={addActions(data, !listType && true) || []}
                tableDataCount={extOrSatDataCount}
                tableColumn={Headers[pageType]}
                type={1}
                onAdd={() => {
                  if (openDetails) setOpenDetails(false);
                  setTimeout(() => {
                    onAdd(pageType);
                  }, 100);
                }}
                listType={listType}
                setListType={setListType}
                setPageInd={setPageIndex}
                setPageSze={setPageSize}
                allData={allData}
              />
            </Grid>
          </MainCard>
        )}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', marginTop: 2 }}>
          <Button
            onClick={() => {
              onBack(0);
            }}
            size="small"
            variant="outlined"
            color="primary"
          >
            Back
          </Button>
        </Grid>
      </FormProvider>
      <ConfirmModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete?"
        confirmBtnTitle="Delete"
      />
      <Dialog
        open={openHistoryModal}
        onClose={() => {
          setOpenHistoryModal(false);
          setPageHIndex(1);
          setPageHSize(25);
        }}
        scroll="paper"
        disableEscapeKeyDown
        maxWidth="lg"
      >
        <Table
          isHistory
          tableTitle="History"
          tableData={addActions(extOrSatDataHistory, false, true)}
          tableDataCount={extOrSatDataHistoryCount}
          tableColumn={[...Headers[pageType]].slice(1)}
          onAdd={() => {}}
          setPageInd={setPageHIndex}
          setPageSze={setPageHSize}
          allData={allHData}
        />
      </Dialog>
    </>
  );
};

ExtAndSatDetails.propTypes = {
  title: PropTypes.string,
  pageType: PropTypes.string,
  onBack: PropTypes.func,
  esData: PropTypes.any,
  projectData: PropTypes.any
};

export default ExtAndSatDetails;
