import React, { useEffect, useMemo, useState } from 'react';
import { Button, Grid, Modal, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useOrganizationStoreLocation } from '../organization-store-location/useOrganizationStoreLocation';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import TableForm from 'tables/table';
import Validations from 'constants/yupValidations';
import Actions from 'components/actions/Actions';
import { getAllSerialNumbers } from 'store/actions';
import MaterialSerialNumberModal from 'components/modal/MaterialSerialNumberModal/MaterialSerialNumberModal';
import ModalContent from 'components/modal/MaterialSerialNumberModal/serial-modal-content';

const columns = [
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
    accessor: 'quantity'
  },
  {
    Header: 'UOM',
    accessor: 'uom.name'
  },
  {
    Header: 'To Store Location',
    accessor: 'toStoreLocationName'
  }
];
const closeCss = { cursor: 'pointer', fontSize: 24 };

const MaterialViewInputs = ({ pending, updatedReqData, setUpdatedReqData, onBack, onSubmit: handleFinalSubmit }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [openSerials, setOpenSerials] = useState(false);
  const [serials, setSerials] = useState([]);
  const [uploadSerials, setUploadSerials] = useState(false);

  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        toStoreLocationId: Validations.toStoreLocationId
      })
    ),
    defaultValues: {},
    mode: 'all'
  });
  const { setValue, handleSubmit } = methods;

  const materialData = useMemo(
    () =>
      updatedReqData?.map((item, index) => ({
        ...item,
        quantity: Math.abs(item.quantity),
        actions: <Actions onEdit={() => setSelectedIndex(index)} />
      })) || [],
    [updatedReqData]
  );

  const selectedData = materialData?.[selectedIndex];
  const update = !isNaN(selectedIndex) && !!selectedData;

  useEffect(() => {
    if (!selectedData) return;

    const handleSetValues = (valuesToSet) => {
      Object.entries(valuesToSet).forEach(([key, value]) => {
        setValue(key, value);
      });
    };

    handleSetValues(selectedData);
  }, [selectedData, setValue]);

  const { companyStoreLocations } = useOrganizationStoreLocation();
  const companyStoreLocationsData = companyStoreLocations?.companyStoreLocationsObject?.rows || [];
  const filteredLocationsData = companyStoreLocationsData.filter((item) => item.organizationStoreId === updatedReqData?.[0]?.toStoreId);

  const { allSerialNumbers } = useStockLedger();
  const { serialNumbersData } = useMemo(
    () => ({
      serialNumbersData: allSerialNumbers?.data.rows || [],
      countSN: allSerialNumbers?.data?.count || 0
    }),
    [allSerialNumbers]
  );

  const handleCloseSerial = () => {
    setUploadSerials(false);
  };

  const getSerials = (arr) => {
    let newArr = [];
    arr &&
      arr.length > 0 &&
      arr.map((val) => {
        newArr.push(val.serialNumber);
      });
    setSerials(newArr);
    return newArr;
  };

  const onFormSubmit = (formData) => {
    const { toStoreLocationId } = formData;

    let updatedData = [...updatedReqData];
    updatedData[selectedIndex] = {
      ...updatedData[selectedIndex],
      toStoreLocationId: toStoreLocationId,
      serialNumber: serialNumbersData,
      toStoreLocationName: companyStoreLocationsData?.find((storeLocItem) => storeLocItem.id === toStoreLocationId)?.name
    };

    setUpdatedReqData(updatedData);

    setSelectedIndex(null);
  };

  useEffect(() => {
    if (selectedData) {
      const details = selectedData.stock_ledgers.filter((val) => val.materialId === selectedData?.materialId);
      dispatch(
        getAllSerialNumbers({
          project: details[0]?.projectId,
          store: details[0]?.storeId,
          storeLocation: details[0]?.storeLocationId,
          stockLedger: details[0]?.id,
          material: selectedData?.materialId
        })
      );
    }
  }, [selectedData, dispatch]);

  const keywordsToExclude = [
    'faulty',
    'scrap',
    'missing',
    'consumed',
    'billing',
    'installed',
    'installer',
    'old',
    'service-center',
    'service center',
    'defective',
    'damage',
    'non-repairable',
    'non repairable'
  ];

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
      {selectedData && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <RHFTextField name="material.code" type="text" label="Code" disabled required />
          </Grid>
          <Grid item xs={12} md={4}>
            <RHFTextField name="material.name" type="text" label="Material" disabled required />
          </Grid>
          <Grid item xs={12} md={4} xl={2}>
            <RHFSelectbox
              name="toStoreLocationId"
              label="To Store Location"
              menus={
                filteredLocationsData &&
                filteredLocationsData.filter((val) => keywordsToExclude.every((keyword) => !val.name.toLowerCase().includes(keyword)))
              }
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <RHFTextField name="quantity" type="number" label="Quantity" disabled required />
          </Grid>
          <Grid item xs={12} md={2}>
            <RHFTextField name="uom.name" type="text" label="UOM" disabled required />
          </Grid>
          <Grid item xs={12} md={1} style={{ display: 'none' }}>
            <RHFTextField name="uomId" type="text" label="UOMId" disabled required />
          </Grid>
          <Grid item md={2} sx={{ textAlign: 'center' }}>
            {selectedData?.material?.isSerialNumber && (
              <>
                <Typography mb={-1}>Serial No</Typography> <br />
                <Button
                  size="small"
                  onClick={() => {
                    getSerials(serialNumbersData);
                    setOpenSerials(true);
                  }}
                  variant="contained"
                  color="primary"
                >
                  View
                </Button>
              </>
            )}
          </Grid>
          <Grid item xs={12} md={6} mt={3.5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button size="small" type="submit" variant="contained" color="primary">
              Update
            </Button>
          </Grid>
        </Grid>
      )}

      <Modal open={uploadSerials} onClose={handleCloseSerial} aria-labelledby="modal-modal-title">
        <ModalContent
          handleCloseSerial={handleCloseSerial}
          closeCss={closeCss}
          quantity={updatedReqData.quantity < 0 ? Math.abs(updatedReqData.quantity) : updatedReqData.quantity}
          setSerialNumbers={getSerials}
        />
      </Modal>

      {openSerials && (
        <MaterialSerialNumberModal
          open={openSerials}
          onClose={() => {
            setOpenSerials(false);
          }}
          serialNumberData={serials.slice(0, updatedReqData.quantity < 0 ? Math.abs(updatedReqData.quantity) : updatedReqData.quantity)}
        />
      )}

      <TableForm title="MIN" hideHeader hideActions hidePagination data={materialData} columns={columns} count={materialData.length} />

      <Grid container spacing={2} alignItems={'center'} sx={{ mt: 2 }}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
          <Button onClick={onBack} size="small" variant="outlined" color="primary">
            Back
          </Button>
          <Button disabled={update || pending} size="small" type="submit" variant="contained" onClick={handleFinalSubmit} color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

MaterialViewInputs.propTypes = {
  updatedReqData: PropTypes.array,
  pending: PropTypes.bool,
  setUpdatedReqData: PropTypes.func,
  onSubmit: PropTypes.func,
  onBack: PropTypes.func,
  toStoreId: PropTypes.string
};

export default MaterialViewInputs;
