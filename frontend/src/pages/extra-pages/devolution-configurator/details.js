import { Button, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDevolution } from '../devolution/useDevolution';
import DevolutionEntry from './devolution-entry';
import AdditionalDetails from './additional-details';
import { FormProvider, RHFSelectbox } from 'hook-form';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { getDevolutionMapping, getDropdownProjects, getFormData, getLovsForMasterName } from 'store/actions';
import { useDefaultFormAttributes } from 'pages/form-configurator/useDefaultAttributes';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import TableForm from 'tables/table';
import ConfirmModal from 'components/modal/ConfirmModal';
import usePagination from 'hooks/usePagination';

const Details = ({ selectedData, onBack }) => {
  const [initialValues, setInitialValues] = useState({});
  const [allValues, setAllValues] = useState({});
  const [data, setData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [showEntrySection, setShowEntrySection] = useState(false);
  const [showMoreEntry, setShowMoreEntry] = useState(false);
  const [showList, setShowList] = useState(false);
  const dispatch = useDispatch();
  const firstRender = useRef(true);
  const { masterMakerOrgType } = useMasterMakerLov();
  const formTypeData = masterMakerOrgType?.masterObject;
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteValue, setDeleteValue] = useState(null);

  const { forms } = useDefaultFormAttributes();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.nother,
        formTypeId: Validations.nother,
        formId: Validations.nother,
        searchFields: Validations.otherArray,
        displayFields: Validations.otherArray,
        mobileFields: Validations.otherArray
      })
    ),
    mode: 'all'
  });

  const { handleSubmit, setValue, watch } = methods;

  const { formsList } = useMemo(
    () => ({
      formsList: forms?.formDataObject?.rows || []
    }),
    [forms]
  );

  useEffect(() => {
    if (formsList && formsList.length > 0 && selectedData && selectedData?.id) setValue('formId', selectedData.form?.id);
  }, [formsList, setValue, selectedData]);

  const {
    paginations: { pageSize, pageIndex },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();

  const columns = [
    {
      Header: 'Froms Column',
      accessor: 'formAttributeName'
    },
    {
      Header: 'User-Defined Column',
      accessor: 'newName'
    }
  ];

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;

  useEffect(() => {
    dispatch(getLovsForMasterName('FORM_TYPES'));
    dispatch(getDropdownProjects());
  }, [dispatch]);

  const onDBack = () => {
    setShowMoreEntry(false);
    setShowEntrySection(false);
  };

  const onDVBack = () => {
    onBack();
  };

  const onUpdateRow = (e) => {
    setEditRow(e);
    setShowEntrySection(true);
  };

  const onGetFormDataHandler = useCallback(
    (projectId, typeId) => {
      if (!firstRender.current) {
        setValue('formId', '');
      }
      firstRender.current = false;
      dispatch(getFormData({ projectId, typeId }));
    },
    [dispatch, setValue]
  );

  const projectId = watch('projectId');
  const typeId = watch('formTypeId');
  const formId = watch('formId');

  const { devolutionMappingList } = useDevolution();

  const { mappingList } = useMemo(
    () => ({
      mappingList: devolutionMappingList?.stocksObject?.rows || []
    }),
    [devolutionMappingList]
  );

  const updateList = (list) => {
    return (
      list &&
      list.length > 0 &&
      list.map((vl) => {
        return {
          formAttributeName: vl.form_attribute?.name,
          newName: vl.newName,
          formAttributeId: vl?.form_attribute?.id,
          id: vl?.id
        };
      })
    );
  };

  useEffect(() => {
    if (mappingList) {
      let mapList = updateList(mappingList);
      setData(mapList);
    }
  }, [mappingList]);

  useEffect(() => {
    onGetFormDataHandler(projectId, typeId);
  }, [projectId, typeId, onGetFormDataHandler]);

  const onSubmit = (values) => {
    setInitialValues(values);
    setShowMoreEntry(true);
    if (!selectedData?.id) setData([]);
  };

  const onNext = (values) => {
    setAllValues({ ...initialValues, ...values });
    setShowList(true);
    if (!selectedData?.id) setData([]);
  };

  const setAllData = () => {
    let newData = [];
    data.map((vl) => {
      if (vl.formAttributeId !== deleteValue.formAttributeId) newData.push(vl);
    });
    setData(newData);
    setShowEntrySection(false);
    setDeleteValue(null);
  };

  const handleRowDelete = (value) => {
    if (typeof value === 'string') {
      setDeleteId(value);
      setDeleteValue(data.filter((vl) => vl.id === value)[0]);
    } else {
      setDeleteId(null);
      setDeleteValue(value);
    }
    setOpenDeleteModal(true);
  };

  const onDelete = async () => {
    if (selectedData && selectedData?.id && deleteId && deleteId !== null) {
      const response = await request(`/devolution-mapping-delete`, { method: 'DELETE', params: deleteId });
      if (response.success) {
        setOpenDeleteModal(false);
        toast(`Devolution Mapping Deleted Successfully`, { variant: 'success' });
        dispatch(getDevolutionMapping({ devolutionConfigId: selectedData?.id, pageIndex, pageSize }));
      } else {
        toast(response?.error?.message, { variant: 'error' });
        setOpenDeleteModal(false);
      }
    } else {
      setAllData();
      setOpenDeleteModal(false);
    }
  };

  const onAdd = () => {
    setEditRow(null);
    setShowEntrySection(true);
  };

  useEffect(() => {}, [formId]);

  useEffect(() => {
    if (selectedData && selectedData?.id) {
      setValue('projectId', selectedData?.project?.id);
      setValue('formTypeId', selectedData?.form?.master_maker_lov?.id);
      setValue('formId', selectedData.form?.id);
      dispatch(getDevolutionMapping({ devolutionConfigId: selectedData?.id, pageIndex, pageSize }));
    }
  }, [selectedData, setValue, dispatch, pageIndex, pageSize, refreshPagination]);

  const onSaveData = async () => {
    let response = await request(`/devolution-config-create`, {
      method: 'POST',
      body: {
        ...allValues,
        devolution_mappings: data.map((vl) => {
          return { formAttributeId: vl.formAttributeId, newName: vl.newName };
        })
      }
    });
    if (response.success) {
      onBack();
      toast(`Devolution Config Added Successfully`, { variant: 'success' });
    } else toast(response?.error?.message);
  };

  const onSavedColumn = (vl) => {
    let newData = [...data];
    const index = data.findIndex((item) => item.formAttributeId === vl.formAttributeId);
    if (index > -1) newData[index] = { ...newData[index], ...vl };
    else newData.push(vl);
    setData(newData);
    setShowEntrySection(false);
    if (selectedData && selectedData?.id) dispatch(getDevolutionMapping({ devolutionConfigId: selectedData?.id, pageIndex, pageSize }));
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <MainCard title={'Devolution Configurator'} sx={{ mb: 2 }}>
          <Grid container rowSpacing={3} columnSpacing={2}>
            <Grid item md={4} xs={12}>
              <RHFSelectbox
                name={'projectId'}
                label={'Project'}
                InputLabelProps={{ shrink: true }}
                menus={projectData}
                allowClear
                required
                disable={selectedData && selectedData?.id}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <RHFSelectbox
                name={'formTypeId'}
                label={'Form Type'}
                InputLabelProps={{ shrink: true }}
                menus={watch('projectId') ? formTypeData : []}
                allowClear
                required
                disable={selectedData && selectedData?.id}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <RHFSelectbox
                name={'formId'}
                label={'Form'}
                InputLabelProps={{ shrink: true }}
                menus={watch('projectId') && watch('formTypeId') ? formsList : []}
                allowClear
                required
                disable={selectedData && selectedData?.id}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} textAlign={'right'} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1.25rem', marginTop: 3 }}>
            <Button variant="outlined" size="small" color="primary" onClick={onDVBack}>
              {'Back'}
            </Button>
            <Button variant="contained" size="small" color="primary" type="submit">
              {'Proceed'}
            </Button>
          </Grid>
        </MainCard>
      </FormProvider>
      {showMoreEntry && <AdditionalDetails selectedData={selectedData} formsList={formsList} formId={formId} onNext={onNext} />}
      {showEntrySection && (
        <DevolutionEntry
          onBack={onDBack}
          selectedDataId={selectedData?.id ? selectedData?.id : null}
          editRow={editRow}
          formsList={formsList}
          formId={formId}
          savedColumn={onSavedColumn}
        />
      )}
      <ConfirmModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleConfirm={onDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete?"
        confirmBtnTitle="Delete"
      />
      {showList && (
        <TableForm
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
          hideHistoryIcon
          hideViewIcon
          hideExportButton
          hidePagination
          accessTableOnly
          handleRowDelete={handleRowDelete}
          handleRowUpdate={onUpdateRow}
          onClick={onAdd}
          data={data || []}
          columns={columns}
          count={data.length || 0}
        />
      )}
      {!selectedData?.id && data && data.length > 0 && (
        <Grid item xs={12} textAlign={'right'} sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
          <Button variant="contained" size="small" color="primary" onClick={() => onSaveData()}>
            {'Save'}
          </Button>
        </Grid>
      )}
    </>
  );
};

Details.propTypes = {
  selectedData: PropTypes.any,
  onBack: PropTypes.func
};

export default Details;
