import { useEffect, useMemo, useState } from 'react';
import { Dialog, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Headers, PreData } from './headers';
import Calendar from './Calendar';
import { useDailyExecutionPlan } from './useDailyExecutionPlan';
import TableForm from 'tables/table';
import MainCard from 'components/MainCard';
import { getAllDailyExecutionPlan, getDailyExecutionPlan, getDailyExecutionPlanHistory } from 'store/actions';
import ConfirmModal from 'components/modal/ConfirmModal';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';

const DailyExecutionPlan = () => {
  const dispatch = useDispatch();
  const [listType, setListType] = useState(1);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [materialTypeId, setMaterialTypeId] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [dData, setDData] = useState([]);

  const handleRowDelete = (deleteData) => {
    setRecordId(deleteData);
    setOpenDeleteModal(true);
  };

  const onImportDone = () => {
    dispatch(getDailyExecutionPlan({ projectId, materialTypeId, month, year, listType }));
    dispatch(getAllDailyExecutionPlan({ projectId, materialTypeId, listType }));
  };

  const confirmDelete = async () => {
    const response = await request(`/daily-execution-plan-delete`, { method: 'DELETE', params: recordId });
    if (response.success) {
      setOpenDeleteModal(false);
      onImportDone();
    } else {
      toast(response?.error?.message);
    }
  };

  const handleRowHistory = (restoreData) => {
    setOpenHistoryModal(true);
    setRecordId(restoreData);
    dispatch(getDailyExecutionPlanHistory({ recordId: restoreData?.id }));
  };

  const { dailyExecutionPlan, allDailyExecutionPlan, dailyExecutionPlanHistory } = useDailyExecutionPlan();

  const { data } = useMemo(
    () => ({
      data: dailyExecutionPlan?.dailyExecutionPlanObject?.rows || []
    }),
    [dailyExecutionPlan]
  );

  useEffect(() => {
    setDData(data);
  }, [data]);

  const { allData } = useMemo(
    () => ({
      allData: allDailyExecutionPlan?.allDailyExecutionPlanObject?.rows || []
    }),
    [allDailyExecutionPlan]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: dailyExecutionPlanHistory?.dailyExecutionPlanHistoryObject?.rows || [],
      historyCounts: dailyExecutionPlanHistory?.dailyExecutionPlanHistoryObject?.count || 0
    }),
    [dailyExecutionPlanHistory]
  );

  const onDataSelected = (values) => {
    setProjectId(values.projectId);
    setMaterialTypeId(values.materialTypeId);
    setMonth(values.month);
    setYear(values.year);
    values?.projectId &&
      values?.projectId !== null &&
      values?.materialTypeId &&
      values?.materialTypeId !== null &&
      dispatch(getDailyExecutionPlan({ ...values, listType }));
  };

  const getAllData = (values) => {
    dispatch(getAllDailyExecutionPlan({ ...values, listType }));
  };

  useEffect(() => {
    if (projectId && projectId !== null && materialTypeId && materialTypeId !== null)
      dispatch(getAllDailyExecutionPlan({ projectId, materialTypeId, listType }));
  }, [dispatch, projectId, materialTypeId, listType]);

  return (
    <>
      <MainCard title={'Daily Execution Plan'} style={{ marginTop: 20 }}>
        <Grid container>
          <Calendar getFormsdata={onDataSelected} getAllFormsData={getAllData} data={dData} setData={setDData} />
        </Grid>
        <Grid container>
          {projectId && materialTypeId && projectId !== null && materialTypeId !== null && (
            <TableForm
              title={`Daily-execution-plan-${allData?.[0]?.project?.name?.replaceAll(
                '/',
                '_'
              )}-${allData?.[0]?.master_maker_lov?.name?.replaceAll('/', '_')}`}
              data={allData.map((v) => ({ ...v, month: PreData.monthSet[v.month - 1] }))}
              count={allData.length}
              hideAddButton
              hideRestoreIcon
              hidePagination
              accessTableOnly
              hideViewIcon
              hideTitle
              hideEditIcon
              hideImportButton={false}
              importConfig={{
                apiBody: { projectId, materialTypeId }
              }}
              importDep
              importCompeted={onImportDone}
              columns={Headers.dep}
              listType={listType}
              handleRowDelete={handleRowDelete}
              handleRowHistory={handleRowHistory}
              setListType={setListType}
              allData={allData.map((v) => ({ ...v, month: PreData.monthSet[v.month - 1] }))}
            />
          )}
        </Grid>
      </MainCard>
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
        }}
        scroll="paper"
        disableEscapeKeyDown
        maxWidth="lg"
      >
        <TableForm
          title="History"
          data={historyData.map((v) => ({ ...v, month: PreData.monthSet[v.month + 1] }))}
          count={historyCounts}
          hideAddButton
          hideActions
          hideViewIcon
          hideDeleteIcon
          hideHistoryIcon
          hideImportButton={false}
          columns={Headers.dep}
          listType={listType}
          setListType={setListType}
          allData={historyData.map((v) => ({ ...v, month: PreData.monthSet[v.month + 1] }))}
        />
      </Dialog>
    </>
  );
};

export default DailyExecutionPlan;
