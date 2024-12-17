import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PropTypes from 'prop-types';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  getCompanyStoreLocations,
  getDropdownProjects,
  getFirmStoreLocations,
  getLovsForMasterNameSecond,
  getMasterMakerLov,
  getSerialNumbers
} from '../../../store/actions';
import { PAGINATION_CONST } from '../../../constants';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import MaterialInputs from './material-input';
import CreateNewConsumption from './create-new-consumption';
import { FormProvider } from 'hook-form';
import Validations from 'constants/yupValidations';
import TableForm from 'tables/table';
import toast from 'utils/ToastNotistack';
import { fetchTransactionType } from 'utils';
import request from 'utils/request';
import Loader from 'components/Loader';
import MaterialSerialNumberModal from 'components/modal/MaterialSerialNumberModal/MaterialSerialNumberModal';
import { refData } from 'store/reducers/stocksSlice';

const Actions = ({ values, onEdit, index, onView }) => {
  return (
    <>
      <Tooltip title="Edit" placement="bottom">
        <IconButton color="secondary" onClick={() => onEdit(values, index)}>
          <EditOutlinedIcon />
        </IconButton>
      </Tooltip>
      {values?.material?.isSerialNumber && (
        <Tooltip title="View Serial Number" placement="bottom">
          <IconButton color="secondary" onClick={() => onView(values)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

Actions.propTypes = {
  values: PropTypes.any,
  onEdit: PropTypes.func,
  index: PropTypes.number,
  onView: PropTypes.func
};

const subColumns = [
  {
    Header: 'Actions',
    accessor: 'actions'
  },
  {
    Header: 'Name',
    accessor: 'material.name'
  },
  {
    Header: 'Code',
    accessor: 'material.code'
  },
  {
    Header: 'Quantity',
    accessor: 'approvedQuantity'
  },
  {
    Header: 'UOM',
    accessor: 'uom.name'
  },
  {
    Header: 'Store Location',
    accessor: 'from_store_location.name'
  },
  {
    Header: 'Consumption',
    accessor: 'consumption'
  }
];

const CreateConsumption = () => {
  const [reqConsumptionData, setReqConsumptionData] = useState([]);
  const [reqConsumptionData2, setReqConsumptionData2] = useState([]);
  const [maxQuantity, setMaxQuantity] = useState(null);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const [showData, setShowData] = useState(false);
  const [pending, setPending] = useState(false);
  const [serialNumber, setSerialNumber] = useState(null);
  const [openSerialNumber, setOpenSerialNumber] = useState(false);
  const [rowData, setRowData] = useState(null);

  const navigate = useNavigate();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { setValue } = methods;

  const dispatch = useDispatch();

  const {
    masterMakerLovs: {
      masterMakerLovsObject: { rows: transactionTypeData }
    }
  } = useMasterMakerLov();

  const companyId = fetchTransactionType(transactionTypeData, 'COMPANY');
  const contractorId = fetchTransactionType(transactionTypeData, 'CONTRACTOR');

  useEffect(() => {
    if (companyId) {
      dispatch(getCompanyStoreLocations({ organizationType: companyId }));
    }
  }, [dispatch, companyId]);

  useEffect(() => {
    if (contractorId) {
      dispatch(getFirmStoreLocations({ organizationType: contractorId }));
    }
  }, [dispatch, contractorId]);

  const { serialNumbers } = useStockLedger();
  const { serialNumbersData } = useMemo(
    () => ({
      serialNumbersData: serialNumbers?.data || {},
      countSN: serialNumbers?.data?.count || 0
    }),
    [serialNumbers]
  );
  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };

    reqConsumptionData && handleSetValues(reqConsumptionData);
  }, [reqConsumptionData, setValue]);

  const onBack = () => {
    setShowAdd(!showAdd);
    setView(false);
    setUpdate(false);
    setReqConsumptionData([]);
    setReqConsumptionData2([]);
    navigate('/consumption');
  };

  const handleRowUpdate = (row, ind) => {
    setView(false);
    setUpdate(true);
    const nrow = {
      ...row,
      material_serial_numbers: row?.material_serial_numbers
    };
    setShowData(nrow);
    setMaxQuantity(reqConsumptionData2[ind].approvedQuantity);
  };

  const handleRowView = (row) => {
    setRowData(row);
    setOpenSerialNumber(true);
    if (!row?.material_serial_numbers) {
      setSerialNumber([]);
    }
  };

  useEffect(() => {
    if (rowData?.material_serial_numbers) {
      setSerialNumber(rowData?.material_serial_numbers);
    }
  }, [rowData]);

  const transactionTypeId = fetchTransactionType(transactionTypeData, 'CONSUMPTION');
  const installedTransactionTypeId = 'f3848838-6e7c-4240-a4e2-27e084164a17';

  const makeRequest = () => {
    const stockLedgerArray = [];
    const rFData = reqConsumptionData.map((obj) => ({
      ...obj
    }));
    let checkConsumptionExists = rFData.filter((vl) => vl.consumption === 'Installed' || vl.consumption === 'Consumption');
    if (checkConsumptionExists && checkConsumptionExists.length > 0) {
      let checkInstalled = rFData.filter((vl) => vl?.consumption === 'Installed');
      rFData.map((stockData) => {
        if (parseFloat(stockData.approvedQuantity) > 0) {
          stockLedgerArray.push({
            transactionTypeId: stockData.consumption === 'Installed' ? installedTransactionTypeId : transactionTypeId,
            projectId: stockData?.projectId,
            organizationId:
              stockData?.from_store?.organization?.parentId !== null
                ? stockData?.from_store?.organization?.parent?.id
                : stockData?.from_store?.organization?.id,
            storeId: stockData?.fromStoreId,
            storeLocationId: stockData?.fromStoreLocationId,
            materialId: stockData?.materialId,
            uomId: stockData?.uomId,
            quantity: Number(stockData?.approvedQuantity),
            rate: Number(stockData?.rate),
            value: Number(stockData?.value),
            tax: Number(stockData?.tax),
            serialNumber: stockData?.material_serial_numbers
          });
        }
      });
      const stockLedgerDetails = {
        transactionTypeId: transactionTypeId,
        requestNumber: rFData?.[0]?.referenceDocumentNumber,
        ...(checkInstalled && checkInstalled.length > 0 && { toTransactionTypeId: installedTransactionTypeId }),
        ...(checkInstalled &&
          checkInstalled.length > 0 && {
            toOrganizationId:
              checkInstalled?.[0]?.to_store?.organization?.parentId !== null
                ? checkInstalled?.[0]?.to_store?.organization?.parent?.id
                : checkInstalled?.[0]?.to_store?.organization?.id
          }),
        ...(checkInstalled &&
          checkInstalled.length > 0 && {
            toStoreId: checkInstalled?.[0]?.toStoreId
          }),
        toStoreLocationId: checkInstalled?.[0]?.toStoreLocationId,
        stock_ledgers: stockLedgerArray
      };
      return stockLedgerDetails;
    } else {
      toast('Consumption field is required!', { variant: 'error' });
      return false;
    }
  };

  const getMaterials = (value) => {
    const reqData = [];
    reqConsumptionData.map((val) => {
      if (value.id === val.id) {
        let uomData = val.uom;
        val = value;
        val.uom = uomData;
      }
      reqData.push(val);
    });
    setUpdate(false);
    setReqConsumptionData(reqData);
  };

  const onFormSubmit = async () => {
    const req = makeRequest();

    if (req) {
      setPending(true);
      const resp = await request('/consumption-transaction-create', { method: 'POST', body: req, timeoutOverride: 120000 });

      if (!resp.success) {
        toast(resp?.error?.message || 'Operation failed. Please try again!', { variant: 'error' });
        setPending(false);
        return;
      }

      const referenceDocumentNumber = refData.referenceDocumentNumber || refData[0]?.referenceDocumentNumber;
      const referenceDocNo = resp?.data?.referenceDocNo;

      toast(
        referenceDocumentNumber
          ? `Transaction created with reference number: ${referenceDocumentNumber}`
          : (referenceDocNo &&
              `Transaction created with reference number ${referenceDocNo?.CONSUMPTION?.join(', ')}, ${referenceDocNo?.INSTALLED?.join(
                ', '
              )}`) ||
              'Transaction created successfully!',
        {
          variant: 'success',
          autoHideDuration: 10000
        }
      );

      setPending(false);
      navigate('/consumption-receipt');
    }
  };

  const addActionField = (tableData) => {
    const nResp = tableData.map((val) => {
      const prevSno = JSON.parse(val.serialNumbers);
      const filteredArray = prevSno.filter(
        (vl) => val?.materialId && serialNumbersData[val?.materialId] && serialNumbersData[val?.materialId]?.includes(vl)
      );
      return {
        ...val,
        serialNumbers: JSON.stringify(filteredArray)
      };
    });
    const tbl = nResp.map((obj, index) => ({
      ...obj,
      actions: <Actions values={obj} index={index} onEdit={handleRowUpdate} onView={handleRowView} />
    }));
    return tbl;
  };

  useEffect(() => {
    dispatch(getMasterMakerLov());
    dispatch(getDropdownProjects());
    dispatch(getLovsForMasterNameSecond('ORGANIZATION TYPE'));
  }, [dispatch]);

  //  new Code
  const saveData = (values) => {
    let allMaterials = [];
    values?.materials &&
      values?.materials?.length > 0 &&
      values?.materials?.map((v) => {
        allMaterials.push({
          ...v,
          qtyInStk: v.approvedQuantity
        });
      });
    setReqConsumptionData(allMaterials);
    setReqConsumptionData2(allMaterials);
    dispatch(getSerialNumbers({ project: allMaterials?.[0]?.projectId, store: allMaterials?.[0]?.fromStoreId }));
  };
  const [disableAll, setDisableAll] = useState(false);

  return (
    <>
      {pending && <Loader />}
      <FormProvider methods={methods}>
        <CreateNewConsumption onClick={onBack} saveData={saveData} disableAll={disableAll} setDisableAll={setDisableAll} />
        {reqConsumptionData && reqConsumptionData.length > 0 && (
          <>
            {(view || update) && (
              <MaterialInputs
                onMaterailsInput={getMaterials}
                maxQuantity={maxQuantity}
                view={view}
                update={update}
                showData={showData}
                lovData={transactionTypeData}
              />
            )}
            <TableForm
              title={'Consumption'}
              hideHeader
              hidePagination
              data={addActionField(reqConsumptionData)}
              count={reqConsumptionData.length}
              columns={subColumns}
              hideActions={true}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              pageIndex={pageIndex}
              pageSize={pageSize}
            />

            {openSerialNumber && rowData && serialNumber && (
              <MaterialSerialNumberModal
                open={openSerialNumber}
                onClose={() => {
                  setOpenSerialNumber(false);
                }}
                serialNumberData={serialNumber}
              />
            )}
            <Grid item md={12} xl={2} sx={{ mt: 4 }}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                <Button onClick={onBack} size="small" variant="outlined" color="primary">
                  Back
                </Button>
                <Button disabled={update || pending} size="small" variant="contained" color="primary" onClick={onFormSubmit}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </FormProvider>
    </>
  );
};

export default CreateConsumption;
