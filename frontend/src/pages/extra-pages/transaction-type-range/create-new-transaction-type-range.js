import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Grid, Button, Box, Divider } from '@mui/material';
import AddTransactionSection from './AddTransactionSection';
import TopSection from './TopSection';
import EditTransactionSection from './EditTransactionSection';
import TransactionTypeRangeProvider from './TransactionTypeRangeContext';
import MainCard from 'components/MainCard';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';

const CreateNewTransactionType = ({ onClick: goBack, view, update, data, refreshPagination }) => {
  const [topSectionData, setTopSectionData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const onFinalSubmit = async (updateFormData) => {
    let response;

    let payload;

    if (!update) {
      const filteredTransactions = transactions.filter(
        (item) => item.touched && item.startRange && !isNaN(item.startRange) && item.endRange && !isNaN(item.endRange)
      );

      if (!filteredTransactions.length) {
        toast('Please have at least one field with both start range and end range', { variant: 'error' });
        return;
      }

      const txnWithInvalidRange = filteredTransactions.find((item) => parseInt(item.endRange) < parseInt(item.startRange));

      if (txnWithInvalidRange) {
        toast(`Ensure end ranges are greater than start ranges`, { variant: 'error' });
        return;
      }
      payload = {
        organizationId: topSectionData.organizationId,
        storeId: topSectionData.storeId,
        prefix: topSectionData.prefix?.toUpperCase(),
        ranges: filteredTransactions.map((item) => {
          return {
            name: item.name,
            transactionTypeIds: item.transactionTypeIds,
            startRange: parseInt(item.startRange),
            endRange: parseInt(item.endRange),
            effectiveDate: item.effectiveDate
          };
        })
      };
    } else {
      payload = {
        organizationId: topSectionData.organizationId,
        storeId: topSectionData.storeId,
        prefix: topSectionData.prefix?.toUpperCase(),
        name: updateFormData.name,
        transactionTypeIds: updateFormData.transactionTypeIds,
        startRange: parseInt(updateFormData.startRange),
        endRange: parseInt(updateFormData.endRange),
        effectiveDate: updateFormData.effectiveDate,
        endDate: updateFormData.endDate
      };
    }

    if (update) {
      response = await request('/transaction-type-range-update', { method: 'PUT', body: payload, params: data.id });
    } else {
      response = await request('/transaction-type-range-form', { method: 'POST', body: payload });
    }

    if (response.success) {
      const successMessage = update ? 'Transaction Type Range updated successfully!' : 'Transaction Type Range added successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      refreshPagination();
      goBack();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  useEffect(() => {
    if (!data) return;
    setTopSectionData(data);
  }, [data]);

  return (
    <TransactionTypeRangeProvider>
      <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'Transaction Type Range'}>
        <TopSection disableAll={!!topSectionData} data={data} onSubmit={(formValues) => setTopSectionData(formValues)} />

        {topSectionData && (
          <>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              {!data ? (
                <AddTransactionSection
                  onBack={() => {
                    setTopSectionData(null);
                    setTransactions([]);
                  }}
                  store={topSectionData?.storeId}
                  organization={topSectionData?.organizationId}
                  selectedTransactions={transactions}
                  setTransactions={setTransactions}
                />
              ) : (
                <EditTransactionSection view={view} data={data} onSubmit={onFinalSubmit} onBack={goBack} />
              )}
            </Box>
          </>
        )}

        {!data && (
          <Grid container spacing={2} alignItems={'center'} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
              <Button onClick={goBack} size="small" variant="outlined" color="primary">
                Back
              </Button>
              {!view && topSectionData && transactions?.length > 0 && (
                <Button size="small" onClick={onFinalSubmit} variant="contained" color="primary">
                  {update ? 'Update' : 'Save'}
                </Button>
              )}
            </Grid>
          </Grid>
        )}
      </MainCard>
    </TransactionTypeRangeProvider>
  );
};

CreateNewTransactionType.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func
};

export default CreateNewTransactionType;
