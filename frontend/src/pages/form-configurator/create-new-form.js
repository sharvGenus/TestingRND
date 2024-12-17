import React, { useEffect, useMemo, useState } from 'react';
import { Grid, Card, Typography, Divider, Button, Stack, Dialog } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { yupResolver } from '@hookform/resolvers/yup';
import DefaultAttributeList from './default-attribute-list';
import { useDefaultFormAttributes } from './useDefaultAttributes';
import {
  TextColumn,
  PhoneColumn,
  EmailColumn,
  ImageColumn,
  DocumentColumn,
  SignatureColumn,
  SequenceColumn,
  LocationColumn,
  NetworkColumn,
  NumberColumn,
  ChipColumn,
  CheckboxColumn,
  DateTimeColumn,
  DropdownColumn,
  QRCodeColumn,
  SectionSepColumn,
  OCRColumn,
  RefColumn
} from './modals';
import DragDropTable from './drag-and-drop-table';
import AddInventoryMapping from './add-inventory-data-mapping';
import AddDataMapping from './add-new-data-mapping';
import { FormProvider, RHFTextField, RHFSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import { getFormAttributes, getFormDetail } from 'store/actions/formMasterAction';
import { getDropdownProjects, getLovsForMasterName } from 'store/actions';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import request from 'utils/request';
import { formAttributesSlice, formDetailSlice } from 'store/reducers/formMasterSlice';
import toast from 'utils/ToastNotistack';
import ConfirmModal from 'components/modal/ConfirmModal';
import Validations from 'constants/yupValidations';
import TableForm from 'tables/table';
import { APPROVAL_LEVEL_COLUMNS, RESURVEY_COLUMNS } from 'constants/constants';

// ============================|| CREATE NEW FORM ||============================ //

const CreateNewForm = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const { formId, mode } = useParams();
  const [screen, setScreen] = useState({
    default: 1,
    dataMapping: 0,
    inventoryMapping: 0
  });
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState();
  const [attributesArray, setAttributesArray] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openPublishModal, setOpenPublishModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [submitState, setSubmitState] = useState(false);

  useEffect(() => {
    if (formId && screen.default) {
      dispatch(getFormAttributes({ formId, sortBy: 'rank', sortOrder: 'ASC', listType: 2 }));
      dispatch(getFormDetail(formId));
    }
  }, [dispatch, formId, screen]);

  useEffect(() => {
    if (screen.default) {
      dispatch(getDropdownProjects());
      dispatch(getLovsForMasterName('FORM_TYPES'));
      return () => {
        dispatch(formAttributesSlice.actions.reset());
        dispatch(formDetailSlice.actions.reset());
      };
    }
  }, [dispatch, screen]);

  const { masterMakerOrgType } = useMasterMakerLov();
  const formTypeData = masterMakerOrgType?.masterObject;

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;

  const { formAttributes, formDetail } = useDefaultFormAttributes();
  const formEntries = useMemo(() => formAttributes?.formAttributesObject?.rows || [], [formAttributes]);

  const filteredObjects = formEntries.filter((obj) => obj.mappingColumnId !== null);
  const mappingArrayData = filteredObjects.map((obj) => ({
    formAttributeId: obj.id,
    mappingColumnId: obj.mappingColumnId
  }));

  useEffect(() => {
    setAttributesArray([...formEntries]);
  }, [formEntries]);

  const formHeaderData = useMemo(() => formDetail?.formDetailObject || [], [formDetail]);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.formTitle,
        formTypeId: Validations.other,
        projectId: Validations.other
      })
    ),
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    setValue('name', formHeaderData?.name);
    setValue('projectId', formHeaderData?.projectId);
    setValue('formTypeId', formHeaderData?.formTypeId);
  }, [formHeaderData, setValue]);

  const modalHandler = (val) => {
    formId
      ? (setModalType(val), setOpen(true))
      : toast('Please save the form before adding attributes.', { variant: 'warning', autoHideDuration: 5000 });
  };

  const publishableFormData = {
    formId: formHeaderData?.id
  };

  const onFormPublish = async () => {
    const response = await request('/form-publish', { method: 'POST', body: publishableFormData });
    if (response.success) {
      navigate('/form-configurator');
      toast(response.data.message, { variant: 'success', autoHideDuration: 10000 });
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const onFormSubmit = async (values) => {
    setSubmitState(true);
    attributesArray.forEach((obj, index) => {
      obj.rank = index + 1;
    });
    values.attributesArray = attributesArray;
    const response = await request('/form-create', { method: 'POST', body: values });
    if (response.success) {
      navigate('/form-configurator');
      toast(response.data.message, { variant: 'success', autoHideDuration: 10000 });
      setSubmitState(false);
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
      setSubmitState(false);
    }
  };

  const onFormUpdate = async (values) => {
    setSubmitState(true);
    values.formId = formId;
    const newArray = attributesArray.map((obj, index) => {
      return { ...obj, rank: index + 1 };
    });
    values.attributesArray = newArray;
    const response = await request('/form-update', { method: 'PUT', body: values });
    if (response.success) {
      navigate('/form-configurator');
      toast(response.data.message, { variant: 'success', autoHideDuration: 10000 });
      setSubmitState(false);
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
      setSubmitState(false);
    }
  };

  const confirmDelete = () => {
    setAttributesArray(
      attributesArray.map((obj) => {
        return { ...obj, isActive: obj?.id === deleteInfo || obj?.name === deleteInfo ? 0 : obj.isActive };
      })
    );
    setOpenDeleteModal(false);
  };

  const handleDeleteField = async (row) => {
    setDeleteInfo(row);
    setOpenDeleteModal(true);
  };

  const handleEditField = (val) => {
    setModalType(val);
    setOpen(true);
  };

  const selectBox = (name, label, menus, req, placeholder) => {
    return (
      <Stack>
        <RHFSelectbox
          name={name}
          disable={formHeaderData?.isPublished}
          placeholder={placeholder}
          label={label}
          InputLabelProps={{ shrink: true }}
          menus={menus}
          {...(req && { required: true })}
        />
      </Stack>
    );
  };

  const txtBox = (name, label, type, req, placeholder = false, shrink = true) => {
    return (
      <Stack spacing={1}>
        <RHFTextField
          name={name}
          type={type}
          label={label}
          disabled={formHeaderData?.isPublished}
          placeholder={placeholder}
          InputLabelProps={{ shrink: shrink }}
          {...(req && { required: true })}
        />
      </Stack>
    );
  };

  const OtherColumn = () => <></>;

  const modalProps = {
    modalId: modalType?.defaultAttributeId,
    mode: modalType?.mode,
    item: modalType,
    isPublished: formHeaderData?.isPublished,
    setOpen,
    attributesArray,
    setAttributesArray
  };

  const GetRenderModal = () => {
    switch (modalType?.type || modalType?.default_attribute?.name || modalType?.default) {
      case 'Text':
        return <TextColumn {...modalProps} />;
      case 'Email':
        return <EmailColumn {...modalProps} />;
      case 'Phone':
        return <PhoneColumn {...modalProps} />;
      case 'Image':
        return <ImageColumn {...modalProps} />;
      case 'Document':
        return <DocumentColumn {...modalProps} />;
      case 'Signature':
        return <SignatureColumn {...modalProps} />;
      case 'Key Generator':
        return <SequenceColumn {...modalProps} columnData={formEntries?.filter((x) => x.isActive === '1')} />;
      case 'GEO Location':
        return <LocationColumn {...modalProps} />;
      case 'Network Strength':
        return <NetworkColumn {...modalProps} />;
      case 'Number':
        return <NumberColumn {...modalProps} />;
      case 'Chip Select':
        return <ChipColumn {...modalProps} />;
      case 'Checkbox':
        return <CheckboxColumn {...modalProps} />;
      case 'Date Time':
        return <DateTimeColumn {...modalProps} />;
      case 'Dropdown':
        return (
          <DropdownColumn
            {...modalProps}
            columnData={formEntries?.filter((x) => x.isActive === '1')}
            projectId={formHeaderData?.projectId || methods.watch('projectId')}
            formId={formId}
          />
        );
      case 'QR/Bar Code':
        return <QRCodeColumn {...modalProps} columnData={formEntries?.filter((x) => x.isActive === '1')} />;
      case 'Section Seperator':
        return <SectionSepColumn {...modalProps} />;
      case 'OCR':
        return <OCRColumn {...modalProps} />;
      case 'Reference Code':
        return <RefColumn {...modalProps} />;
      default:
        return <OtherColumn />;
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Display Name',
        accessor: 'name'
      },
      {
        Header: 'DB Column',
        accessor: 'columnName'
      },
      {
        Header: 'Field Type',
        accessor: (data) => data.type || data.default_attribute.name
      }
    ],
    []
  );

  const allColumns = useMemo(
    () => [
      {
        Header: 'Display Name',
        accessor: 'name'
      },
      {
        Header: 'DB Column',
        accessor: 'columnName'
      },
      {
        Header: 'Field Type',
        accessor: (data) => data.type || data.default_attribute.name
      },
      {
        Header: 'Req',
        accessor: (data) =>
          !['Key Generator', 'Reference Code', 'Section Seperator'].includes(data.default_attribute?.name || data.type) ? (
            <input type="radio" checked={data.isRequired === true} readOnly />
          ) : (
            <input type="radio" disabled />
          ),
        minWidth: 10
      },
      {
        Header: 'Uni',
        accessor: (data) =>
          ['Text', 'Number', 'Email', 'Phone', 'Key Generator', 'QR/Bar Code'].includes(data.default_attribute?.name || data.type) ? (
            <input type="radio" checked={data.isUnique === true} readOnly />
          ) : (
            <input type="radio" disabled />
          ),
        minWidth: 10
      },
      {
        Header: 'Edit',
        accessor: (data) =>
          ['Text', 'Number', 'Email', 'Phone', 'Dropdown', 'Date Time', 'GEO Location', 'OCR', 'QR/Bar Code'].includes(
            data.default_attribute?.name || data.type
          ) ? (
            <input type="radio" checked={data.properties?.editable !== false} readOnly />
          ) : (
            <input type="radio" disabled />
          ),
        minWidth: 10
      },
      {
        Header: 'Hide',
        accessor: (data) =>
          ['Text', 'Date Time', 'Key Generator', 'Chip Select', 'Dropdown'].includes(data.default_attribute?.name || data.type) ? (
            <input type="radio" checked={data.properties?.defaultHide === true} readOnly />
          ) : (
            <input type="radio" disabled />
          ),
        minWidth: 10
      }
    ],
    []
  );

  const submitFunction = formId ? onFormUpdate : onFormSubmit;

  // function to get next letter and next count for naming convention of approval level columns
  const getNextAvailableLetter = () => {
    // appoval level column & resurvey column name change impact
    const usedLetters = attributesArray?.filter((attr) => attr.columnName.startsWith('l_')).map((attr) => attr.columnName.charAt(2));
    if (usedLetters && usedLetters.length > 0) {
      const distinctLetters = [...new Set(usedLetters)];
      let maxLetter = null;
      let maxAscii = -1;
      distinctLetters.forEach((letter) => {
        const ascii = letter.charCodeAt(0);
        if (ascii > maxAscii) {
          maxAscii = ascii;
          maxLetter = letter;
        }
      });
      let nextCount = 1;
      if (maxLetter !== 'z') {
        nextCount = maxLetter.charCodeAt(0) - 'a'.charCodeAt(0) + 2;
      }
      let nextLetter = 'a';
      if (nextCount <= 26) {
        nextLetter = String.fromCharCode('a'.charCodeAt(0) + nextCount - 1);
      }
      return { nextLetter, nextCount };
    }
    return { nextLetter: 'a', nextCount: 1 };
  };

  // function to append approval level columns on every click of add approval level - also append resurvey columns one time
  const handleApprovalLevels = () => {
    const { nextLetter, nextCount } = getNextAvailableLetter();
    // appoval level column & resurvey column name change impact
    const hasResurveyColumn = attributesArray?.some((attrName) => ['is_resurvey', 'resurvey_by'].includes(attrName.columnName));
    const newColumns = APPROVAL_LEVEL_COLUMNS.map((attr) => ({
      ...attr,
      columnName: attr.columnName.replace('*', nextLetter),
      name: attr.name.replace('*', nextCount)
    }));
    if (nextLetter) {
      if (!hasResurveyColumn) {
        setAttributesArray([...attributesArray, ...newColumns, ...RESURVEY_COLUMNS]);
      } else {
        setAttributesArray([...attributesArray, ...newColumns]);
      }
    } else {
      alert('All letters from a to z are used for l_* columns.');
    }
    setOpenConfirmModal(false);
  };

  return (
    <>
      {screen.default ? (
        <>
          <FormProvider methods={methods} onSubmit={handleSubmit(submitFunction)}>
            <Card
              sx={{
                padding: '16px 0px 0px 16px',
                position: 'relative',
                border: '1px solid',
                borderRadius: 1,
                borderColor: theme.palette.grey.A800,
                boxShadow: 'inherit'
              }}
            >
              <Grid container>
                <Grid item md={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Grid>
                    <Typography variant="h4">
                      {!formId ? 'Create New Form' : 'Edit Form'}
                      {formId &&
                        publishableFormData?.formId &&
                        mode !== 'edit' &&
                        attributesArray.filter((x) => !['0', 0].includes(x.isActive))?.length !== 0 &&
                        (!formHeaderData?.isPublished ? (
                          <Button size="small" variant="contained" color="primary" onClick={() => setOpenPublishModal(true)} sx={{ ml: 2 }}>
                            Publish
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => toast('Form is already published.', { variant: 'warning', autoHideDuration: 10000 })}
                            sx={{ ml: 2 }}
                          >
                            Published
                          </Button>
                        ))}
                    </Typography>
                  </Grid>
                  <Grid item sx={{ display: 'flex', gap: 2, mr: 2 }}>
                    <Button component={Link} to="/form-configurator" size="small" variant="outlined" color="primary">
                      Back
                    </Button>
                    {formId &&
                    attributesArray?.length &&
                    mode === 'edit' &&
                    !attributesArray?.filter((x) => x.columnName.startsWith('l_b'))?.length ? (
                      <Button onClick={() => setOpenConfirmModal(true)} size="small" variant="outlined" color="primary">
                        Add Approval Level
                      </Button>
                    ) : (
                      <></>
                    )}
                    {formId && mode !== 'edit' && (
                      <>
                        <Button
                          onClick={() => setScreen({ ...screen, default: 0, inventoryMapping: 1 })}
                          size="small"
                          variant="outlined"
                          color="primary"
                        >
                          Inventory Mapping
                        </Button>
                        <Button
                          onClick={() => setScreen({ ...screen, default: 0, dataMapping: 1 })}
                          size="small"
                          variant="outlined"
                          color="primary"
                        >
                          Data Mapping
                        </Button>
                        <Button component={Link} to={'/form-integration-rules/' + formId} size="small" variant="outlined" color="primary">
                          API Integration
                        </Button>
                        <Button component={Link} to={'/form-validation-rules/' + formId} size="small" variant="outlined" color="primary">
                          Validation
                        </Button>
                        <Button component={Link} to={'/form-visibility-rules/' + formId} size="small" variant="outlined" color="primary">
                          Visibility
                        </Button>
                      </>
                    )}
                    {!formId ? (
                      <Button size="small" type="submit" variant="contained" color="primary" disabled={submitState}>
                        Save
                      </Button>
                    ) : (
                      <Button size="small" type="submit" variant="contained" color="primary" disabled={submitState}>
                        Update
                      </Button>
                    )}
                  </Grid>
                </Grid>
                <Grid item md={12}>
                  <Divider sx={{ margin: '16px -20px 0px' }} />
                </Grid>
                <Grid container sx={{ height: '77vh' }}>
                  <Grid container item md={9.5} sx={{ height: '100%', overflowY: 'auto' }}>
                    <Grid item md={12} sx={{ mb: 4 }}>
                      <MainCard sx={{ mr: 2, mt: 4, minHeight: '120px' }}>
                        <Grid container spacing={4} alignItems="center">
                          <Grid item md={5.5}>
                            {txtBox('name', 'Form Name', 'text', true, 'Enter Form Name')}
                          </Grid>
                          <Grid item md={3.25}>
                            {selectBox('projectId', 'Project', projectData, false, 'Select Project')}
                          </Grid>
                          <Grid item md={3.25}>
                            {selectBox('formTypeId', 'Type', formTypeData, false, 'Select Type')}
                          </Grid>
                        </Grid>
                      </MainCard>
                      <DndProvider backend={HTML5Backend}>
                        <Grid item md={12} sx={{ mr: 2, mt: 4 }}>
                          {!mode || mode === 'edit' ? (
                            <TableForm
                              hidePagination
                              hideHistoryIcon
                              hideViewIcon
                              hideEmptyTable
                              hideHeader
                              fcAction
                              data={attributesArray.filter((item) => item?.isActive != 0)}
                              columns={allColumns}
                              count={attributesArray.filter((item) => item?.isActive != 0).length}
                              handleRowDelete={handleDeleteField}
                              handleRowUpdate={handleEditField}
                            />
                          ) : (
                            <DragDropTable
                              data={attributesArray}
                              columns={columns}
                              hideInactiveRows
                              handleRowDelete={handleDeleteField}
                              handleRowUpdate={handleEditField}
                              setAttributesArray={setAttributesArray}
                            />
                          )}
                        </Grid>
                      </DndProvider>
                    </Grid>
                  </Grid>
                  <Grid item md={2.5} sx={{ height: '100%', overflowY: 'auto' }}>
                    <DefaultAttributeList onCallbackMethod={modalHandler} mode={mode} />
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </FormProvider>
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            scroll="paper"
            PaperProps={{
              sx: {
                maxWidth:
                  modalType?.default === 'Dropdown' ||
                  modalType?.default === 'Key Generator' ||
                  modalType?.type === 'Dropdown' ||
                  modalType?.type === 'Key Generator' ||
                  modalType?.default_attribute?.name === 'Dropdown' ||
                  modalType?.default_attribute?.name === 'Key Generator'
                    ? '850px'
                    : '625px'
              }
            }}
            disableEscapeKeyDown
          >
            {GetRenderModal()}
          </Dialog>
          <ConfirmModal
            open={openDeleteModal}
            handleClose={() => setOpenDeleteModal(false)}
            handleConfirm={confirmDelete}
            title="Delete Field"
            message="Are you sure you want to delete?"
            confirmBtnTitle="Delete"
          />
          <ConfirmModal
            open={openPublishModal}
            handleClose={() => setOpenPublishModal(false)}
            handleConfirm={onFormPublish}
            title="Confirm Publish"
            message="Please update changes if any, before publish."
            confirmBtnTitle="Publish"
          />
          <ConfirmModal
            open={openConfirmModal}
            handleClose={() => setOpenConfirmModal(false)}
            handleConfirm={handleApprovalLevels}
            title="Confirm Add Level"
            message="Are you sure you want to add approval level?"
            confirmBtnTitle="Add"
          />
        </>
      ) : screen.inventoryMapping ? (
        <AddInventoryMapping
          formId={formId}
          screen={screen}
          setScreen={setScreen}
          formHeaderData={formHeaderData}
          columnData={formEntries}
        />
      ) : screen.dataMapping ? (
        <AddDataMapping
          formId={formId}
          screen={screen}
          setScreen={setScreen}
          formHeaderData={formHeaderData}
          mappingArrayData={mappingArrayData}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default CreateNewForm;
