import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Grid,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useTable } from 'react-table';
import { useReports } from '../delivery-challan-report/useReport';
import { createClearFieldSubscription } from '../validation-status-report';
import ExpandingSubTable from './ExpandingSubTable';
import { FormProvider, RHFSelectTags, RHFSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import {
  getAgingOfMaterialReports,
  getAgingOfMaterialSubData,
  getDropdownMaterial,
  getDropdownOrganization,
  getDropdownProjects,
  getMasterMakerLov,
  getOrganizationStores,
  getOrganizationsLocationByParent
} from 'store/actions';
import Validations from 'constants/yupValidations';
import { concateNameAndCode, convertIfDate, getFormFieldNames } from 'utils';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { useOrganizationStore } from 'pages/extra-pages/organization-store/useOrganizationStore';
import { useOrganizations } from 'pages/extra-pages/organization/useOrganizations';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import { useMaterial } from 'pages/extra-pages/material/useMaterial';

const parseValue = (value) => parseFloat(parseFloat(value).toFixed(2));

const ParsedCell = ({ value }) => {
  return parseValue(value);
};

const columns = [
  { Header: 'Store', accessor: 'Store' },
  { Header: 'Material', accessor: 'Material' },
  { Header: 'GRN', accessor: 'GRN', Cell: ParsedCell },
  {
    Header: 'Delivery Challan (MIN, STO, STC, PTP & STSRC)',
    accessor: 'Delivery Challan (MIN, STO, STC, PTP & STSRC)',
    Cell: ParsedCell
  },
  { Header: 'MRN', accessor: 'MRN', Cell: ParsedCell },
  { Header: 'Net Issue', accessor: 'Net Issue', Cell: ParsedCell },
  { Header: 'Consumption', accessor: 'Consumption', Cell: ParsedCell },
  { Header: 'Installed', accessor: 'Installed', Cell: ParsedCell },
  { Header: 'At Stores', accessor: 'At Stores', Cell: ParsedCell },
  {
    Header: 'Material With Contractor',
    accessor: 'Material With Contractor',
    Cell: ParsedCell
  }
];

const serialNumberColumns = [
  { Header: 'S. No.', accessor: 'serial_no', Cell: ({ row: { index } }) => `${index + 1}.` },
  { Header: 'Document No', accessor: 'Document No' },
  { Header: 'Date', accessor: 'Date', Cell: ({ value }) => convertIfDate(value) },
  { Header: 'Serial No', accessor: 'Serial No' }
];

const SerialNumberModal = ({ open, onClose, data }) => {
  const cols = React.useMemo(() => serialNumberColumns, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns: cols, data });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Serial Numbers</DialogTitle>
      <DialogContent dividers>
        <TableContainer component={Paper}>
          <Table {...getTableProps()} aria-label="Serial Number Table">
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <TableCell key={column.id} {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <TableRow key={row.id} {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <TableCell key={cell.id} {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SerialNumberModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      documentNo: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      serialNo: PropTypes.number.isRequired
    })
  ).isRequired
};

const allowedMasterMakerLovs = ['COMPANY', 'CONTRACTOR'];

const AgingOfMaterialReport = () => {
  const dispatch = useDispatch();

  const { organizationsLocByParent } = useOrganizations();

  const { organizationBranchData } = useMemo(
    () => ({
      organizationBranchData: organizationsLocByParent?.organizationObject?.rows || [],
      isLoading: organizationsLocByParent.loading || false
    }),
    [organizationsLocByParent]
  );

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        organizationType: Validations.organizationType,
        organizationId: Validations.organizationId
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const [showTable, setShowTable] = useState();
  const [serialNumberData, setSerialNumberData] = useState([]);
  const [isSerialNumberModalOpen, setIsSerialNumberModalOpen] = useState(false);

  const { handleSubmit, watch, resetField } = methods;

  const [projectId, organizationType, organizationId, storeId, branchId, materialId] = watch([
    'projectId',
    'organizationType',
    'organizationId',
    'storeId',
    'branchId',
    'materialId'
  ]);

  const projectsData = useProjects()?.projectsDropdown?.projectsDropdownObject;
  const masterMakerLovsData = useMasterMakerLov()?.masterMakerLovs?.masterMakerLovsObject?.rows;
  const organizationStoresData = useOrganizationStore()?.organizationStores?.organizationStoreObject?.rows;
  const organizationData = useOrganizations()?.organizationsDropdown?.organizationDropdownObject;
  const reportData = useReports()?.agingOfMaterialReports?.agingOfMaterialReportsObject?.rows;
  const subData = useReports()?.agingOfMaterialReportsSubData?.agingOfMaterialSubDataObject?.rows;
  const subDataLoading = useReports()?.agingOfMaterialReportsSubData?.loading;
  const materialData = useMaterial()?.materialDropdown?.materialDropdownObject;

  const loadSerialNumbers = useCallback(
    async (columnValue, columnName, rowValues) => {
      if (parseInt(columnValue) === 0) {
        return;
      }

      const response = await request('/aging-material-serial-numbers-list', {
        method: 'GET',
        query: { projectId, materialId: rowValues?.['Material ID'], storeId: rowValues?.['Store ID'], header: columnName }
      });

      if (!response?.success) {
        toast('Something went wrong while fetching serial numbers', { variant: 'error' });
        return;
      }

      setSerialNumberData(response?.data?.data?.rows);
      setIsSerialNumberModalOpen(true);
    },
    [projectId]
  );

  const LinkCell = useCallback(
    ({ value, row, column }) => {
      return (
        <Typography
          onClick={row.original['Is Serial Number'] ? () => loadSerialNumbers(value, column.id, row.original) : null}
          style={row.original['Is Serial Number'] ? { cursor: 'pointer', color: '#1890ff' } : {}}
        >
          {parseValue(value)}
        </Typography>
      );
    },
    [loadSerialNumbers]
  );

  LinkCell.propTypes = {
    value: PropTypes.number.isRequired,
    row: PropTypes.object.isRequired,
    column: PropTypes.object.isRequired
  };

  const subColumns = useMemo(
    () => [
      {
        Header: 'Material Name',
        accessor: 'Material Name'
      },
      {
        Header: 'UOM',
        accessor: 'UOM'
      },
      {
        Header: 'MIV',
        accessor: 'MIV',
        Cell: ParsedCell
      },
      {
        Header: 'MRN',
        accessor: 'MRN',
        Cell: ParsedCell
      },
      {
        Header: 'Consumption',
        accessor: 'CONSUMPTION',
        Cell: ParsedCell
      },
      {
        Header: 'QTY( >= 0 <30)',
        accessor: 'Qty( >= 0 <30)',
        Cell: LinkCell
      },
      {
        Header: 'QTY(>= 30 < 60)',
        accessor: 'Qty(>= 30 < 60)',
        Cell: LinkCell
      },
      {
        Header: 'QTY(>= 60 < 90)',
        accessor: 'Qty(>= 60 < 90)',
        Cell: LinkCell
      },
      {
        Header: 'QTY(>= 90)',
        accessor: 'Qty(>= 90)',
        Cell: LinkCell
      },
      {
        Header: 'Value(>= 0 < 30)',
        accessor: 'Value(>= 0 < 30)',
        Cell: ParsedCell
      },
      {
        Header: 'Value(>= 30 < 60)',
        accessor: 'Value(>= 30 < 60)',
        Cell: ParsedCell
      },
      {
        Header: 'Value(>= 60 < 90)',
        accessor: 'Value(>= 60 < 90)',
        Cell: ParsedCell
      },
      {
        Header: 'Value(>= 90)',
        accessor: 'Value(>= 90)',
        Cell: ParsedCell
      }
    ],
    [LinkCell]
  );

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getMasterMakerLov());
    dispatch(getDropdownMaterial());
  }, [dispatch]);

  useEffect(() => {
    if (!organizationType) return;
    dispatch(getDropdownOrganization(organizationType));
  }, [dispatch, masterMakerLovsData, organizationType]);

  useEffect(() => {
    if (!organizationType || !organizationId) return;
    dispatch(getOrganizationStores({ organizationType }));
  }, [dispatch, organizationId, organizationType]);

  const loadData = useCallback(() => {
    dispatch(
      getAgingOfMaterialReports({
        projectId: projectId,
        organizationId: organizationId,
        storeId: storeId,
        materialId: materialId,
        branchId: branchId
      })
    );

    setShowTable(true);
  }, [dispatch, projectId, organizationId, branchId, materialId, storeId]);

  const onFormSubmit = async () => {
    loadData();
  };

  const handleOnChange = (name, e) => {
    if (name === 'organizationId') {
      const dat = e?.target?.row;
      dispatch(getOrganizationsLocationByParent({ params: dat?.organization_type?.id + '/' + dat?.id }));
    }
    setShowTable(false);
  };

  const handleExpand = ({ isExpanding, values }) => {
    if (!isExpanding) {
      return;
    }

    dispatch(
      getAgingOfMaterialSubData({
        projectId,
        materialId: values?.['Material ID'],
        storeId: values?.['Store ID']
      })
    );
  };

  useEffect(() => {
    const fieldNames = getFormFieldNames(methods);
    const subscription = createClearFieldSubscription({ watch, allFields: fieldNames, setShowTable, resetField });
    return () => subscription.unsubscribe();
  }, [methods, resetField, watch]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
      <MainCard title="Aging Of Material Report" sx={{ mb: 2 }}>
        <Grid container spacing={3} mb={3}>
          <Grid item md={3} xl={3}>
            <RHFSelectbox
              name="projectId"
              label="Project"
              menus={projectsData}
              onChange={handleOnChange.bind(this, 'projectId')}
              allowClear
              required
            />
          </Grid>
          <Grid item md={3} xl={3}>
            <RHFSelectbox
              name="organizationType"
              label="Organization Type"
              menus={masterMakerLovsData?.filter((item) => allowedMasterMakerLovs.includes(item.name))}
              onChange={handleOnChange.bind(this, 'organizationType')}
              allowClear
              required
            />
          </Grid>
          <Grid item md={3} xl={3}>
            <RHFSelectbox
              name="organizationId"
              label="Organization"
              menus={concateNameAndCode(organizationData || [])}
              onChange={handleOnChange.bind(this, 'organizationId')}
              allowClear
              required
            />
          </Grid>
          <Grid item md={3} xl={3}>
            <RHFSelectbox
              name="branchId"
              label="Branch"
              menus={concateNameAndCode(organizationBranchData || [])}
              onChange={handleOnChange.bind(this, 'branchId')}
              allowClear
            />
          </Grid>
          <Grid item md={3} xl={3}>
            <RHFSelectTags
              name="storeId"
              label="Store"
              menus={(organizationStoresData || []).filter((item) =>
                branchId ? item.organizationId === branchId : item.organizationId === organizationId
              )}
              onChange={handleOnChange.bind(this, 'storeId')}
            />
          </Grid>
          <Grid item md={3} xl={3}>
            <RHFSelectTags name="materialId" label="Material" menus={materialData} onChange={handleOnChange.bind(this, 'materialId')} />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
            <Button type="submit" size="small" variant="contained" color="primary">
              Proceed
            </Button>
          </Grid>
        </Grid>

        {showTable && (
          <ExpandingSubTable
            columns={columns}
            data={reportData || []}
            subData={subData || []}
            subDataLoading={subDataLoading}
            subColumns={subColumns}
            onExpand={handleExpand}
          />
        )}
        <SerialNumberModal open={isSerialNumberModalOpen} onClose={() => setIsSerialNumberModalOpen(false)} data={serialNumberData} />
      </MainCard>
    </FormProvider>
  );
};

export default AgingOfMaterialReport;
