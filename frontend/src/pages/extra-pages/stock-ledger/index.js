import { Button, Grid } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation } from 'react-router';
import { useMaterial } from '../material/useMaterial';
import { useProjects } from '../project/useProjects';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import Headers from './headers';
import { useStockLedger } from './useStockLedger';
import ExpandingNewTable from './ExpandingNewTable';
import MainCard from 'components/MainCard';
import { FormProvider, RHFSelectbox } from 'hook-form';
import { getDropdownProjects, getMasterMakerLov, getMaterial, getOrganizationStores, getOrganizationStoresSecond } from 'store/actions';
import { getStockLedgerMaterialList } from 'store/actions/stocksAction';
import Validations from 'constants/yupValidations';
import request from 'utils/request';
import { concateNameAndCode } from 'utils';
import CircularLoader from 'components/CircularLoader';

const StockLedger = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [allStoresData, setAllStoreData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [allValues, setAllValues] = useState(null);
  const [storeDetails, setStoreDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const { pathname } = useLocation();
  useEffect(() => {
    setData([]);
  }, [pathname]);

  const typeData = [
    {
      id: 'Company',
      name: 'Company'
    },
    {
      id: 'Contractor',
      name: 'Contractor'
    }
  ];

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        project: Validations.project,
        storeType: Validations.requiredWithLabel('StoreType'),
        store: Validations.store
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    dispatch(getMasterMakerLov());
    dispatch(getMaterial());
    dispatch(getDropdownProjects());
  }, [dispatch]);

  const { masterMakerLovs } = useMasterMakerLov();
  const fetchTransactionType = (alldata, type) => {
    const res = alldata && alldata.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : null;
  };
  const orgTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  useEffect(() => {
    dispatch(getOrganizationStores({ organizationType: fetchTransactionType(orgTypeData, 'COMPANY') }));
    dispatch(getOrganizationStoresSecond({ organizationType: fetchTransactionType(orgTypeData, 'CONTRACTOR') }));
  }, [dispatch, orgTypeData]);

  const { stockLedgerMaterialList } = useStockLedger();

  const { projectsDropdown } = useProjects();
  const { organizationStores, organizationStoresSecond } = useOrganizationStore();
  const { material } = useMaterial();
  const selectBox = (name, label, menus, onChange, req) => {
    return (
      <RHFSelectbox
        name={name}
        {...(onChange && { onChange: onChange })}
        label={label}
        InputLabelProps={{ shrink: true }}
        menus={menus || []}
        {...(req && { required: true })}
      />
    );
  };
  const projectData = projectsDropdown?.projectsDropdownObject || [];
  const contractorStoreData = organizationStoresSecond.organizationStoreObject?.rows || [];
  const projectStoreData = organizationStores.organizationStoreObject?.rows || [];
  const materials = material?.materialObject?.rows;
  const { trxnData, isLoading } = useMemo(
    () => ({
      trxnData: stockLedgerMaterialList?.stocksObject || [],
      isLoading: stockLedgerMaterialList.loading || false
    }),
    [stockLedgerMaterialList]
  );

  useEffect(() => {
    if (!isLoading) {
      setLoading(isLoading);
      setData(trxnData);
    }
  }, [trxnData, isLoading]);

  const afterAddSerials = (arr) => {
    const newArr = arr && arr.length > 0 ? JSON.parse(JSON.stringify(arr)) : [];
    newArr.map((val) => {
      val['quantity'] = val.quantity === 0 ? '0' : val.quantity;

      // val['material_serial_numbers'] = val.transactions && val.transactions.length > 0 ? fetchAllSerials(val.transactions) : [];
    });
    return newArr;
  };

  const headers = Headers.stockHeaders;

  const fetchMaterial = (id) => {
    const res = materials && materials.filter((obj) => obj.id === id);
    return res[0].id;
  };

  const onFormSubmit = async (values) => {
    setLoading(true);
    setData([]);
    values['storeDetails'] = storeDetails;
    if (values && values.material) values.material = fetchMaterial(values.material);
    setAllValues(values);
    dispatch(getStockLedgerMaterialList(values));
    setShowTable(true);
  };

  // const fetchAllSerials = (arr) => {
  //   let respArr = [];
  //   arr &&
  //     arr.length > 0 &&
  //     arr.map((val) => {
  //       if (val.material_serial_numbers && val.material_serial_numbers.length > 0) {
  //         respArr = [...respArr, ...val.material_serial_numbers];
  //       }
  //     });
  //   return respArr;
  // };

  const resetContents = (stage) => {
    if (stage === 'project') {
      setValue('storeType', null);
      setValue('store', null);
      setValue('material', null);
    } else if (stage === 'storeType') {
      setValue('store', null);
      setValue('material', null);
    } else if (stage === 'store') {
      setValue('material', null);
    }
  };

  const handleStoreType = (e) => {
    if (e?.target?.value) {
      resetContents('storeType');
      let val = e?.target?.value;
      if (val === 'Company') setAllStoreData(projectStoreData);
      else if (val === 'Contractor') setAllStoreData(contractorStoreData);
      else setAllStoreData([]);
    }
  };

  const afterAddSerialsForLocations = (arr) => {
    return arr.map((val) => {
      val['quantity'] = val.quantity === 0 ? '0' : val.quantity;
      // val['material_serial_numbers'] = val.transactions && val.transactions.length > 0 ? fetchAllSerials(val.transactions) : [];
      return val;
    });
  };

  const fetchSubData = async (row) => {
    const response = await request('/stock-ledger-location-list', {
      method: 'GET',
      timeoutOverride: 20 * 60000,
      query: {
        projectId: allValues?.project,
        storeId: allValues?.store,
        materialId: row.materialId,
        sort: ['createdAt', 'DESC']
      }
    });
    if (response.success) {
      return afterAddSerialsForLocations(response?.data?.allStoreLocationTransactionData);
    }
  };

  const fetchInstallerData = async (row) => {
    const response = await request('/stock-ledger-installer-list', {
      method: 'GET',
      timeoutOverride: 20 * 60000,
      query: {
        projectId: allValues?.project,
        storeId: allValues?.store,
        storeLocationId: row?.storeLocation?.id,
        materialId: row.materialId,
        sort: ['createdAt', 'DESC']
      }
    });
    if (response.success) {
      return afterAddSerialsForLocations(response?.data?.installerStock);
    }
  };

  const onStoreSelected = (e) => {
    setStoreDetails(e?.target?.row);
    resetContents('store');
  };

  const onProjectSelected = () => {
    resetContents('project');
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Stock Ledger'}>
          <Grid container spacing={4}>
            <Grid item xs={3}>
              {selectBox('project', 'Project', projectData, onProjectSelected, true)}
            </Grid>
            <Grid item xs={3}>
              {selectBox('storeType', 'Organization Type', typeData, handleStoreType, true)}
            </Grid>
            <Grid item xs={3}>
              {selectBox('store', 'Store', allStoresData, onStoreSelected, true)}
            </Grid>
            <Grid item xs={3}>
              {selectBox('material', 'Material', concateNameAndCode(materials), () => {}, false)}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={'center'} sx={{ mt: 2 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
              <Button size="small" type="submit" variant="contained" color="primary">
                Proceed
              </Button>
            </Grid>
          </Grid>
        </MainCard>
        {loading && <CircularLoader />}
        {showTable && (
          <MainCard>
            <ExpandingNewTable
              data={afterAddSerials(data)}
              cols={headers}
              subCols={Headers.stockExpandedHeaders}
              superSubCols={Headers.installerHeaders}
              fetchSubData={(row, forInstaller = false) => {
                if (forInstaller) return fetchInstallerData(row);
                else return fetchSubData(row);
              }}
              allValues={allValues}
              setAllTableData={(rsp) => setData(rsp)}
            />
          </MainCard>
        )}
      </FormProvider>
    </>
  );
};

export default StockLedger;
