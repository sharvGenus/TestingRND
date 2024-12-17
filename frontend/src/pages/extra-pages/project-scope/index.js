import { Dialog } from '@mui/material';
import { Grid } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useProjects } from '../project/useProjects';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { Headers } from './headers';
import BasicDetails from './basicDetails';
import Details from './details';
import { Table, Actions } from './TableComponent';
import ExtAndSatDetails from './extAndSatDetails';
import { useProjectScope } from './useProjectScope';
import MainCard from 'components/MainCard';
import { FormProvider, RHFSelectbox } from 'hook-form';
import {
  getLovsForMasterName,
  getLovsForMasterNameSecond,
  getLovsForMasterNameThird,
  getProjectAllScope,
  getProjectScope,
  getProjectScopeAllHistory,
  getProjectScopeHistory,
  getProjects,
  getWebformData
} from 'store/actions';
import { useDefaultFormAttributes } from 'pages/form-configurator/useDefaultAttributes';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import ConfirmModal from 'components/modal/ConfirmModal';

const ProjectScope = () => {
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [extAndSatData, setExtAndSatData] = useState(0);
  const [selectedProject, setSelectedProject] = useState({});
  const [openDetails, setOpenDetails] = useState(false);
  const [detailType, setDetailType] = useState('');
  const [update, setUpdate] = useState(false);
  const [formTypeData, setFormTypeData] = useState([]);
  const [formData, setFormData] = useState([]);
  const [materialTypeData, setMaterialTypeData] = useState([]);
  const [uomData, setUomData] = useState([]);
  const { masterMakerOrgType, masterMakerOrgTypeSecond, masterMakerOrgTypeThird } = useMasterMakerLov();
  const [data, setData] = useState([]);
  const [recordData, setRecordData] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [listType, setListType] = useState(1);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [pageHIndex, setPageHIndex] = useState(1);
  const [pageHSize, setPageHSize] = useState(25);

  const dispatch = useDispatch();
  const methods = useForm({});

  const { setValue } = methods;

  const { uomAllData } = useMemo(
    () => ({
      uomAllData: masterMakerOrgType.masterObject || []
    }),
    [masterMakerOrgType]
  );

  const { formTypeAllData } = useMemo(
    () => ({
      formTypeAllData: masterMakerOrgTypeSecond.masterObject || []
    }),
    [masterMakerOrgTypeSecond]
  );

  const { materialTypeAllData } = useMemo(
    () => ({
      materialTypeAllData: masterMakerOrgTypeThird.masterObject || []
    }),
    [masterMakerOrgTypeThird]
  );

  useEffect(() => {
    if (materialTypeAllData) setMaterialTypeData(materialTypeAllData);
  }, [materialTypeAllData]);

  useEffect(() => {
    if (uomAllData) setUomData(uomAllData);
  }, [uomAllData]);

  useEffect(() => {
    if (formTypeAllData) setFormTypeData(formTypeAllData);
  }, [formTypeAllData]);

  const {
    projects: {
      projectsObject: { rows: projectData }
    }
  } = useProjects();

  useEffect(() => {
    if (projectData && projectData.length === 1) {
      setSelectedProject(projectData?.[0]);
      setValue('projectId', projectData?.[0]?.id);
    }
  }, [projectData, setValue]);

  const { projectScope, projectScopeHistory, projectAllScope, projectScopeAllHistory } = useProjectScope();

  const { projectScopeData, projectScopeCounts } = useMemo(
    () => ({
      projectScopeData: projectScope?.projectScopeObject?.rows || [],
      projectScopeCounts: projectScope?.projectScopeObject?.count || 0,
      isLoading: projectScope.loading || false
    }),
    [projectScope]
  );

  const { allData } = useMemo(
    () => ({
      allData: projectAllScope?.projectScopeObject?.rows || [],
      isLoading: projectAllScope.loading || false
    }),
    [projectAllScope]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: projectScopeHistory?.projectScopeHistoryObject?.rows || [],
      historyCounts: projectScopeHistory?.projectScopeHistoryObject?.count || 0,
      isLoading: projectScopeHistory.loading || false
    }),
    [projectScopeHistory]
  );

  const { allHData } = useMemo(
    () => ({
      allHData: projectScopeAllHistory?.projectScopeHistoryObject?.rows || [],
      isLoading: projectScopeAllHistory.loading || false
    }),
    [projectScopeAllHistory]
  );

  const { webforms } = useDefaultFormAttributes();
  const { formsList } = useMemo(
    () => ({
      formsList: webforms?.webformDataObject?.rows || []
    }),
    [webforms]
  );

  useEffect(() => {
    setFormData(formsList);
  }, [formsList]);

  const onProjectSelected = (e) => {
    if (e?.target?.row) setSelectedProject(e?.target?.row);
  };

  useEffect(() => {
    dispatch(getProjects());
    setFormTypeData([]);
    setFormData([]);
  }, [dispatch]);

  useEffect(() => {
    dispatch(getLovsForMasterName('UOM'));
    dispatch(getLovsForMasterNameSecond('FORM_TYPES'));
    dispatch(getLovsForMasterNameThird('MATERIAL TYPE'));
  }, [dispatch]);

  useEffect(() => {
    if (selectedProject && selectedProject.id) {
      dispatch(getProjectScope({ projectId: selectedProject?.id, listType, pageIndex, pageSize }));
      dispatch(getProjectAllScope({ projectId: selectedProject?.id, listType }));
    }
  }, [dispatch, selectedProject, listType, pageIndex, pageSize]);

  const onFormSubmit = async (values) => {
    values.installationMonth = parseFloat(Number(values.installationMonth).toFixed(2));
    values.installationMonthIncentive = parseFloat(Number(values.installationMonthIncentive).toFixed(2));
    values.orderQuantity = parseFloat(Number(values.orderQuantity).toFixed(3));
    values.projectId = selectedProject?.id;
    let response;
    if (values.id) {
      response = await request('/project-scope-update', { method: 'PUT', body: values, params: values.id });
    } else response = await request('/project-scope-create', { method: 'POST', body: values });

    if (response.success) {
      const successMessage = values.id ? 'Project scope updated successfully!' : 'Project scope created successfully!';
      dispatch(getProjectScope({ projectId: values.projectId, listType, pageIndex, pageSize }));
      dispatch(getProjectAllScope({ projectId: values.projectId, listType }));
      setOpenDetails(false);
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
    } else {
      toast(response.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const onFormTypeChange = (e) => {
    if (e?.target?.value) {
      dispatch(getWebformData({ projectId: selectedProject.id, typeId: e?.target?.value }));
    }
  };

  const onAdd = (dtlType) => {
    setOpenDetails(true);
    setDetailType(dtlType);
    setRecordData(null);
    setUpdate(false);
  };

  useEffect(() => {
    setData(projectScopeData);
  }, [projectScopeData]);

  const onEdit = (editData) => {
    dispatch(getWebformData({ projectId: selectedProject.id, typeId: editData?.form?.master_maker_lov?.id }));
    setRecordData(editData);
    setOpenDetails(true);
    setDetailType('scope');
    setUpdate(true);
  };
  const onDelete = (deleteData) => {
    setRecordData(deleteData);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    const response = await request(`/project-scope-delete`, { method: 'DELETE', params: recordData.id });
    if (response.success) {
      setOpenDeleteModal(false);
      dispatch(getProjectScope({ projectId: recordData.projectId, listType, pageIndex, pageSize }));
      dispatch(getProjectAllScope({ projectId: recordData.projectId, listType }));
    } else {
      toast(response?.error?.message);
    }
  };

  const showHistory = (restoreData) => {
    setOpenHistoryModal(true);
    setRecordData(restoreData);
    dispatch(getProjectScopeHistory({ recordId: restoreData?.id, pageIndex: pageHIndex, pageSize: pageHSize }));
    dispatch(getProjectScopeAllHistory({ recordId: restoreData?.id }));
  };

  useEffect(() => {
    dispatch(getProjectScopeHistory({ recordId: recordData?.id, pageIndex: pageHIndex, pageSize: pageHSize }));
    dispatch(getProjectScopeAllHistory({ recordId: recordData?.id }));
  }, [dispatch, pageHIndex, pageHSize, recordData]);

  const onExtensions = (extData) => {
    setRecordData(extData);
    setExtAndSatData(1);
  };

  const onSat = (satData) => {
    setRecordData(satData);
    setExtAndSatData(2);
  };

  const addActions = (dta, onlyHistory = false) => {
    return (
      dta &&
      dta.length &&
      dta.map((vl) => {
        return {
          ...vl,
          actions: (
            <Actions
              values={vl}
              onEdit={onEdit}
              onDelete={onDelete}
              onExtensions={onExtensions}
              onSat={onSat}
              showHistory={showHistory}
              onlyHistory={onlyHistory}
            />
          )
        };
      })
    );
  };

  return (
    <>
      {extAndSatData > 0 ? (
        <ExtAndSatDetails
          title={extAndSatData === 1 ? 'Extension' : extAndSatData === 2 ? 'SAT Details' : ''}
          pageType={extAndSatData === 1 ? 'extension' : extAndSatData === 2 ? 'sat' : ''}
          onBack={(e) => {
            dispatch(getProjectScope({ projectId: recordData.projectId, listType, pageIndex, pageSize }));
            dispatch(getProjectAllScope({ projectId: recordData.projectId, listType }));
            setExtAndSatData(e);
          }}
          esData={recordData}
          projectData={selectedProject}
        />
      ) : (
        <>
          <FormProvider methods={methods}>
            <MainCard title={'Project Scope'}>
              <Grid container spacing={3}>
                <Grid item md={3} xl={2} mb={3}>
                  <RHFSelectbox name="projectId" label="Project" menus={projectData || []} onChange={onProjectSelected} />
                </Grid>
              </Grid>
              {selectedProject && selectedProject?.id && <BasicDetails basicData={selectedProject} />}
            </MainCard>
          </FormProvider>
          {openDetails && (
            <MainCard style={{ marginTop: 20 }}>
              <Details
                data={recordData}
                dataType={detailType}
                update={update}
                projectData={selectedProject}
                formTypeData={formTypeData}
                onFormTypeChange={onFormTypeChange}
                formData={formData}
                materialTypeData={materialTypeData}
                uomData={uomData}
                onBack={setOpenDetails}
                onSubmit={onFormSubmit}
              />
            </MainCard>
          )}
          {selectedProject && selectedProject?.id && (
            <MainCard style={{ marginTop: 20 }}>
              <Grid container>
                <Table
                  tableTitle="Project Scope"
                  tableData={addActions(data, !listType && true) || []}
                  tableDataCount={projectScopeCounts}
                  tableColumn={Headers.scope}
                  type={0}
                  onAdd={() => {
                    if (openDetails) setOpenDetails(false);
                    setTimeout(() => {
                      onAdd('scope');
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
        </>
      )}
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
          tableData={historyData || []}
          tableDataCount={historyCounts || 0}
          tableColumn={[...Headers.scope].slice(1)}
          onAdd={() => {}}
          setPageInd={setPageHIndex}
          setPageSze={setPageHSize}
          allData={allHData}
        />
      </Dialog>
    </>
  );
};

export default ProjectScope;
