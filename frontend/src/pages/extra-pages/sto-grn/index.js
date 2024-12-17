import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import RequestDropdownSection from '../../../components/sections/RequestDropdownSection';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import CreateNewSTOGRN from './create-new-sto-grn';
import MaterialViewInputs from './material-view-inputs';
import MainCard from 'components/MainCard';
import { fetchTransactionType, isMissingStoreLocation, parentOrganizationFetchers } from 'utils';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import { getCompanyStoreLocations } from 'store/actions';
import Loader from 'components/Loader';

const STOGRN = () => {
  const [reqData, setReqData] = useState(null);
  const [updatedReqData, setUpdatedReqData] = useState([]);
  const [showMaterials, setShowMaterials] = useState(false);
  const [pending, setPending] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { masterMakerLovs } = useMasterMakerLov();
  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const transactionTypeId = fetchTransactionType(transactionTypeData, 'STOGRN');
  const organizationTypeId = fetchTransactionType(transactionTypeData, 'COMPANY');
  const strTransactionTypeId = fetchTransactionType(transactionTypeData, 'STR');
  const stoTransactionTypeId = fetchTransactionType(transactionTypeData, 'STO');

  const getSerials = (arr) => {
    let newArr = [];
    arr &&
      arr.length > 0 &&
      arr.map((val) => {
        newArr.push(val.serialNumber);
      });
    return newArr;
  };

  const getIds = (arr) => {
    let rspArr = [];
    arr &&
      arr.length > 0 &&
      arr.map((vl) => {
        rspArr.push(vl.id);
      });
    return rspArr;
  };

  const getStoreDetails = async (storeId) => {
    const storeData = await request('/organization-store-details', { params: storeId });
    if (storeData?.success) {
      return storeData?.data?.data;
    } else {
      toast('Something went wrong', { variant: 'error' });
      return false;
    }
  };

  const onFinalSubmit = async () => {
    setPending(true);

    const {
      referenceDocumentNumber: requestNumber,
      projectId,
      poNumber,
      poDate,
      lrNumber,
      transporterName,
      transporterContactNumber,
      vehicleNumber,
      invoiceDate,
      actualReceiptDate,
      remarks,
      toStoreId,
      storeId
    } = updatedReqData?.[0] || {};

    const storeDetails = await getStoreDetails(toStoreId);

    if (!storeDetails) return;

    const payload = {
      transactionTypeId: transactionTypeId,
      requestNumber: requestNumber,
      poNumber: poNumber,
      poDate: poDate,
      lrNumber: lrNumber,
      transporterName: transporterName,
      transporterContactNumber: transporterContactNumber,
      vehicleNumber: vehicleNumber,
      invoiceDate: invoiceDate,
      invoiceNumber: requestNumber,
      actualReceiptDate: actualReceiptDate,
      remarks: remarks,
      stoIds: getIds(reqData),
      fromStoreId: storeId,
      stock_ledgers:
        updatedReqData?.map((item) => {
          const { toStoreLocationId, materialId, uomId, quantity, rate, value, tax, storeLocationId } = item;
          return {
            organizationId: parentOrganizationFetchers.getTopmostOrganization(storeDetails)?.id,
            transactionTypeId: transactionTypeId,
            projectId: projectId,
            requestNumber: requestNumber,
            storeId: toStoreId,
            storeLocationId: toStoreLocationId,
            fromStoreLocationId: storeLocationId,
            materialId: materialId,
            uomId: uomId,
            quantity: Math.abs(quantity),
            rate: rate || 0,
            value: value,
            tax: tax,
            remarks: remarks,
            serialNumber: getSerials(item.serialNumber) || []
          };
        }) || []
    };

    if (isMissingStoreLocation(payload.stock_ledgers, 'storeLocationId')) {
      setPending(false);
      return;
    }

    const resp = await request('/sto-grn-transaction-create', { method: 'POST', body: payload, timeoutOverride: 120000 });

    if (!resp.success) {
      toast(resp?.error?.message || 'Operation failed. Please try again!', { variant: 'error' });
      setPending(false);
      return;
    }

    const data = resp.data?.data ?? {};
    const referenceDocumentNumber = data.referenceDocumentNumber || data[0]?.referenceDocumentNumber;

    toast(
      referenceDocumentNumber
        ? `Transaction created with reference number: ${referenceDocumentNumber}`
        : 'Transaction created successfully!',
      {
        variant: 'success',
        autoHideDuration: 10000
      }
    );

    setPending(false);
    navigate('/sto-grn-receipt');
  };

  useEffect(() => {
    dispatch(getCompanyStoreLocations({ organizationId: organizationTypeId }));
  }, [dispatch, organizationTypeId]);

  return (
    <>
      {pending && <Loader />}

      <MainCard title={'STOGRN (Stock Transfer Order GRN)'}>
        <RequestDropdownSection
          type="stockLedger"
          transactionType="STO"
          showFromStoreAddress={true}
          fromStoreLabel="Company Store"
          fromStoreType="COMPANY"
          disableAll={!!reqData}
          setReqData={(stoData) => {
            setReqData(stoData);
          }}
          showBranchAlso
          getFromOtherStore
        />

        <CreateNewSTOGRN
          reqData={reqData}
          setUpdatedReqData={(vl) => {
            setUpdatedReqData(vl);
          }}
          showMaterials={showMaterials}
          onNext={() => setShowMaterials(true)}
          onBack={() => {
            setReqData(null);
            setUpdatedReqData(null);
          }}
          strTransactionTypeId={strTransactionTypeId}
          stoTransactionTypeId={stoTransactionTypeId}
        />

        {showMaterials && (
          <MaterialViewInputs
            pending={pending}
            onSubmit={onFinalSubmit}
            updatedReqData={updatedReqData}
            setUpdatedReqData={setUpdatedReqData}
            getSerials={getSerials}
            onBack={() => setShowMaterials(false)}
          />
        )}
      </MainCard>
    </>
  );
};

STOGRN.propTypes = {
  reqData: PropTypes.array,
  setReqData: PropTypes.func
};

export default STOGRN;
