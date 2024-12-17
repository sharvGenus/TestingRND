import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { TextField, Table, TableBody, TableRow, TableCell, TableHead, Skeleton, styled, Divider, Grid } from '@mui/material';

import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import GroupedItems from './GroupedItems';
import request from 'utils/request';

const RoundedSkeleton = styled(Skeleton)({
  borderRadius: '5px'
});

const AddTransactionSection = ({ setTransactions, selectedTransactions, organization, store }) => {
  const [transactionsForDisplay, setTransactionsForDisplay] = useState();
  let count = 0;
  const [previousRangeData, setPreviousRangeData] = useState([]);
  const [groupIDS, setGroupIDS] = useState([]);
  const { masterMakerOrgType } = useMasterMakerLov();

  const masterData = useMemo(() => masterMakerOrgType?.masterObject || [], [masterMakerOrgType?.masterObject]);

  const handleChange = (value, item, index, key) => {
    let prevValues = transactionsForDisplay;
    item[key] = parseInt(value);
    item.touched = true;
    if (!item.transactionTypeIds) item.transactionTypeIds = [item.id];
    prevValues[index] = item;
    setTransactionsForDisplay(prevValues);
    setTransactions(prevValues);
  };

  const [currentDate] = new Date().toISOString().split('T');

  function handleKeyPress(event) {
    const isNumber = /[0-9]/.test(event.key);
    const isValidCombination = ['Tab', 'Delete', 'Backspace'].includes(event.key) || event.ctrlKey;
    if (!isNumber && !isValidCombination) {
      event.preventDefault();
    }
  }

  useEffect(() => {
    if (!store || !organization) return;

    const fetchPrefix = async () => {
      const respData = await request('/all-transaction-type-range-list', {
        method: 'GET',
        query: {
          storeId: store,
          organizationId: organization
        }
      });

      const rows = respData?.data?.data?.rows;
      const newRows = rows?.filter((vl) => vl.endDate === null);
      if (newRows && newRows.length > 0) {
        setPreviousRangeData(newRows.reverse());
      } else {
        setPreviousRangeData('none');
      }
    };

    fetchPrefix();
  }, [organization, store]);

  const handleNoPreviousRangeData = useCallback(
    (data) => {
      const transactions = data.map((item) => ({
        name: item.name,
        transactionTypeIds: [item.id],
        effectiveDate: currentDate
      }));
      updateList(transactions);
      setTransactionsForDisplay(transactions);
      setTransactions(transactions);
    },
    [currentDate, setTransactions]
  );

  const handlePreviousRangeData = useCallback(
    (data, previousRange) => {
      const modifiedMasterData = data.map((item) => {
        const foundData = previousRange?.find((item1) => item1.transactionTypeIds?.includes(item.id));
        return {
          ...item,
          name: foundData?.name || item?.name,
          transactionTypeId: item.id,
          endRange: foundData?.endRange,
          startRange: foundData?.startRange,
          isActive: foundData?.isActive,
          effectiveDate: foundData?.effectiveDate?.split('T')[0] || currentDate,
          transactionTypeIds: foundData?.transactionTypeIds
        };
      });
      updateList(modifiedMasterData);
      setTransactionsForDisplay(modifiedMasterData);
      setTransactions(modifiedMasterData);
    },
    [currentDate, setTransactions]
  );

  const updateList = (arr) => {
    let groupedIds = [];
    arr &&
      arr.length > 0 &&
      arr.map((val) => {
        if (val.transactionTypeIds && val.transactionTypeIds.length > 1 && val.isActive !== '0') {
          groupedIds = [...groupedIds, ...val.transactionTypeIds];
        }
      });
    setGroupIDS(groupedIds);
  };

  useEffect(() => {
    if (masterData && masterData.length > 0 && previousRangeData === 'none') {
      handleNoPreviousRangeData(masterData);
      return;
    }

    if (masterData && masterData.length > 0 && previousRangeData && previousRangeData.length > 0) {
      handlePreviousRangeData(masterData, previousRangeData);
    }
  }, [handleNoPreviousRangeData, handlePreviousRangeData, masterData, previousRangeData]);

  const inMaster = (name) => {
    let rsp = false;
    masterData.map((val) => {
      if (val.name === name && !groupIDS.includes(val.id)) rsp = true;
    });
    return rsp;
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>S. No.</TableCell>
            <TableCell>Transaction</TableCell>
            <TableCell>Start Range</TableCell>
            <TableCell>End Range</TableCell>
            <TableCell>Effective Date</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {transactionsForDisplay && transactionsForDisplay.length > 0
            ? transactionsForDisplay.map((item, index) => (
                <Fragment key={item.id}>
                  {!groupIDS.includes(item.id) && item.name && inMaster(item.name) && (
                    <TableRow>
                      <TableCell>{`${++count}`}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          type="text"
                          placeholder="Start Range"
                          {...(item?.startRange && { defaultValue: item?.startRange })}
                          onKeyDown={handleKeyPress}
                          key={item.id}
                          onChange={(event) => handleChange(event?.target?.value, item, index, 'startRange')}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          type="text"
                          placeholder="End Range"
                          {...(item?.endRange && { defaultValue: item?.endRange })}
                          onKeyDown={handleKeyPress}
                          key={item.id}
                          onChange={(event) => handleChange(event?.target?.value, item, index, 'endRange')}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          type="date"
                          {...(item?.effectiveDate ? { defaultValue: item?.effectiveDate } : { defaultValue: currentDate })}
                          key={item.id}
                          onChange={(event) => handleChange(event?.target?.value, item, index, 'effectiveDate')}
                        />
                      </TableCell>
                      <TableCell>{(typeof item.isActive !== 'string' && '-') || (item.isActive === '1' ? 'Active' : 'Inactive')}</TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            : Array.from({ length: 10 }, (_, i) => i + 1).map((_) => (
                <TableRow key={_}>
                  {Array.from({ length: 6 }, (__, j) => j + 1).map((v) => (
                    <TableCell key={v}>
                      <RoundedSkeleton variant="rectangular" animation="wave" height={30} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
      <GroupedItems
        data={transactionsForDisplay}
        masterData={masterData}
        selectedTransactions={selectedTransactions}
        setTransactions={(arr) => {
          setGroupIDS([]);
          setTransactions(arr);
          count = 0;
          updateList(arr);
        }}
      />
    </>
  );
};

AddTransactionSection.propTypes = {
  masterData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  transactions: PropTypes.array,
  view: PropTypes.bool,
  update: PropTypes.bool,
  setTransactions: PropTypes.func,
  selectedTransactions: PropTypes.array,
  onBack: PropTypes.func,
  store: PropTypes.string,
  organization: PropTypes.string
};

export default AddTransactionSection;
