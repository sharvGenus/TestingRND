import React, { useState } from 'react';
import { Box } from '@mui/material';
import CreateNewCancelSTR from './create-new-cancel-str';
import MainCard from 'components/MainCard';
import CancelTransactionRequestDropdownSection from 'components/sections/CancelTransactionRequestNumber';

const CancelSTR = () => {
  const [reqData, setReqData] = useState([]);
  const [fromOrganizationId, setFromOrganizationId] = useState();
  const [fromStoreId, setFromStoreId] = useState();

  return (
    <MainCard title={'Cancel STR (Stock Transfer Request)'} sx={{ mb: 2 }}>
      <CancelTransactionRequestDropdownSection
        type="request"
        transactionType="STR"
        fromStoreType="COMPANY"
        toStoreType="COMPANY"
        disableAll={!!reqData?.length}
        setReqData={setReqData}
        setFromStoreId={setFromStoreId}
        fromStoreLabel="From Company Store"
        setFromOrganizationId={setFromOrganizationId}
        toStoreLabel="To Company Store"
        showToStoreDropdown={true}
        getFilteredStore={true}
      />

      {reqData && reqData.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <CreateNewCancelSTR reqData={reqData} fromOrganizationId={fromOrganizationId} fromStoreId={fromStoreId} setReqData={setReqData} />
        </Box>
      )}
    </MainCard>
  );
};

export default CancelSTR;
