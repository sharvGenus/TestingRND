import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Grid, Modal, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import AddGroupedItems from './AddGroupedItems';
import MainCard from 'components/MainCard';

const GroupedItems = ({ data, masterData, selectedTransactions, setTransactions }) => {
  const [displaycontent, setDisplayContent] = useState([]);
  const [updatecontent, setUpdateContent] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  let count = 0;
  // const timeoutIds = useRef({});
  const [currentDate] = new Date().toISOString().split('T');
  const closeCss = { cursor: 'pointer', fontSize: 20 };

  function handleKeyPress(event) {
    const isNumber = /[0-9]/.test(event.key);
    const isValidCombination = ['Tab', 'Delete', 'Backspace'].includes(event.key) || event.ctrlKey;
    if (!isNumber && !isValidCombination) {
      event.preventDefault();
    }
  }

  useEffect(() => {
    updatecontent && updatecontent.length > 0 && setDisplayContent(updatecontent);
  }, [updatecontent]);

  useEffect(() => {
    if (data && data.length > 0) setDisplayContent(data);
  }, [data]);

  const handleChange = (value, item, index, key) => {
    let prevValues = displaycontent;
    item[key] = value;
    item.touched = true;
    prevValues[index] = parseInt(item);
    setDisplayContent(prevValues);
    setTransactions(prevValues);
  };

  const fetchTransactions = (arr) => {
    const str = [];
    arr &&
      arr.length > 0 &&
      arr.map((id) => {
        const foundData = masterData?.find((item1) => item1.id === id);
        if (foundData) str.push(foundData.name);
      });
    return str?.join(', ');
  };

  const openCreateGroup = () => {
    setOpenModal(true);
  };

  const filterContents = (arr) => {
    let newObj = {};
    let respArr = [];
    arr &&
      arr.length > 0 &&
      arr.map((val) => {
        let ky = val?.transactionTypeIds?.toString();
        if (ky && ky !== null && !newObj[ky]) newObj[ky] = val;
      });
    Object.keys(newObj).map((ky) => {
      respArr.push(newObj[ky]);
    });
    return respArr;
  };

  return (
    <>
      <Grid container spacing={2} sx={{ mt: 5, mb: 5 }}>
        <Grid item xs={12}>
          <Typography variant="h4">Groups</Typography>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
          <Button onClick={openCreateGroup} size="small" variant="contained" color="primary">
            Create Group&nbsp;
            <PlusOutlined />
          </Button>
        </Grid>
      </Grid>
      {displaycontent && displaycontent.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No.</TableCell>
              <TableCell>Group Name</TableCell>
              <TableCell>Transactions</TableCell>
              <TableCell>Start Range</TableCell>
              <TableCell>End Range</TableCell>
              <TableCell>Effective Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {displaycontent && displaycontent.length > 0 ? (
              filterContents(displaycontent).map((item, index) => (
                <Fragment key={count}>
                  {item.transactionTypeIds && item.transactionTypeIds.length > 1 && (
                    <TableRow>
                      <TableCell>{`${++count}`}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{fetchTransactions(item?.transactionTypeIds)}</TableCell>
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
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      )}
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        aria-labelledby="modal-modal-title"
      >
        <MainCard sx={{ width: '80%', p: 2 }} modal darkTitle content={false}>
          <Grid container spacing={2} alignItems={'center'} sx={{ mt: 0 }}>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start', padding: '20px' }}>
              <Typography variant="h4">Add Group</Typography>
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
              <Typography
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                <CloseCircleOutlined style={closeCss} />
              </Typography>
            </Grid>
          </Grid>
          <AddGroupedItems
            masterData={masterData}
            selectedTraxns={selectedTransactions}
            onClose={() => {
              setOpenModal(false);
            }}
            setTransactions={(arr) => {
              count = 0;
              setTransactions(arr);
              setUpdateContent(arr);
            }}
          />
        </MainCard>
      </Modal>
    </>
  );
};

GroupedItems.propTypes = {
  data: PropTypes.array,
  masterData: PropTypes.array,
  selectedTransactions: PropTypes.array,
  setTransactions: PropTypes.func
};

export default GroupedItems;
