import { Grid, Button, Divider, Card, Typography, TextField, Modal, Table, TableRow, TableCell, TableHead, TableBody } from '@mui/material';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import CardContent from '@mui/material/CardContent';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { CloseCircleOutlined, RightCircleFilled } from '@ant-design/icons';
import { useApprovers } from '../approver/useApprover';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import MainCard from 'components/MainCard';
import { FormProvider, RHFTextField } from 'hook-form';
import { getApprovers, getApproversList, getTransactionsQty, getTransactionsSecondQty } from 'store/actions';
import { formatDate, getCompStore, getStore, isDecimalUom } from 'utils';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import useAuth from 'hooks/useAuth';

const MaterialApprove = ({
  val,
  overAllData,
  saveValue,
  contractorQuantity,
  trxnName,
  projectQuantity,
  approverDetails,
  view,
  reqApproversData,
  showRemarks
}) => {
  const [value, setValuel] = useState(val);
  const [approveQuantity, setApproveQuantity] = useState('');
  const [showError, setShowError] = useState(false);

  const methods = useForm({
    resolver: yupResolver(Yup.object().shape({})),
    defaultValues: {},
    mode: 'all'
  });

  const { setValue } = methods;

  const saveData = (aprQty) => {
    if (typeof aprQty === 'string' && value) {
      let allValues = { ...value };
      allValues.approvedQuantity = aprQty;
      // console.log('allValues   46 :', allValues);
      setValuel(allValues);
      saveValue(allValues);
    }
  };

  useEffect(() => {
    const savePreData = (aprQty) => {
      if (typeof aprQty === 'string' && val) {
        let allValues = { ...val };
        allValues.approvedQuantity = aprQty;
        // console.log('allValues 58 :', allValues);
        setValuel(allValues);
        saveValue(allValues);
      }
    };
    if (reqApproversData && reqApproversData.id) {
      const getQty =
        reqApproversData && reqApproversData.approvedMaterials && reqApproversData.approvedMaterials.filter((req) => req.id === val.id);
      if (getQty && getQty[0]) {
        setApproveQuantity(getQty[0]?.approvedQuantity + '');
        savePreData(getQty[0]?.approvedQuantity + '');
      }
    } else if (overAllData && overAllData.length > 0) {
      const getQty = overAllData.filter((ovl) => ovl.id === val.id);
      if (getQty[0]?.approvedQuantity && getQty[0]?.approvedQuantity !== 'undefined') {
        setApproveQuantity(getQty[0]?.approvedQuantity + '');
        savePreData(getQty[0]?.approvedQuantity + '');
      } else {
        setApproveQuantity(val?.requestedQuantity + '');
        savePreData(val?.requestedQuantity + '');
      }
    } else if (val && val.requestedQuantity) {
      setApproveQuantity(val?.requestedQuantity + '');
      savePreData(val?.requestedQuantity + '');
    }
  }, [val, reqApproversData, saveValue, overAllData]);

  const getApprovedQuantity = () => {
    if (approverDetails && approverDetails.approvedMaterials && approverDetails.approvedMaterials.length > 0) {
      const allData = approverDetails.approvedMaterials.filter((appr) => appr.id === value.id);
      return allData[0].approvedQuantity;
    } else return 0;
  };

  const getApprovedRemarks = () => {
    if (approverDetails && approverDetails.approvedMaterials && approverDetails.approvedMaterials.length > 0) {
      const allData = approverDetails.approvedMaterials.filter((appr) => appr.id === value.id);
      return allData[0].remarks;
    } else return 'N/A';
  };

  const onQuantitySelected = (e) => {
    let { value: inputValue } = e?.target || {};
    const uom = value?.uom;
    const isDecimal = isDecimalUom(uom);
    let approvedValue = getTrimmed(inputValue);
    const regex = isDecimal ? /^\d+((\.\d{1,3})|\.)?$/ : /^[0-9\b]+$/;
    if (inputValue === '' || regex.test(inputValue)) {
      if (inputValue) {
        let allValues = { ...value };
        if (approvedValue > allValues.requestedQuantity) setShowError(true);
        else setShowError(false);
        setApproveQuantity(inputValue);
        saveData(approvedValue);
      } else {
        setApproveQuantity('');
        saveData('');
      }
    }
  };

  const onRemarksSelected = (e) => {
    if (e?.target?.value) {
      setValue('remarks', e?.target?.value);
      let aprValue = e?.target?.value;
      let allValues = { ...value };
      allValues.remarks = aprValue;
      setValuel(allValues);
      saveValue(allValues);
    }
  };

  return (
    <FormProvider methods={methods}>
      <Table sx={{ maxWidth: 1400, marginBottom: 1 }}>
        <TableBody>
          <TableRow>
            <TableCell sx={{ minWidth: 150, maxWidth: 150 }}>
              <Typography>{value?.name}</Typography>
            </TableCell>
            <TableCell sx={{ minWidth: 150, maxWidth: 150 }}>
              <Typography> {value?.code}</Typography>
            </TableCell>
            <TableCell sx={{ minWidth: 100, maxWidth: 100 }}>
              <Typography>{value?.uom}</Typography>
            </TableCell>
            <TableCell sx={{ minWidth: 150, maxWidth: 150 }}>
              <Typography>{contractorQuantity ? contractorQuantity : 0}</Typography>
            </TableCell>
            <TableCell sx={{ minWidth: 150, maxWidth: 150 }}>
              <Typography>{value?.requestedQuantity}</Typography>
            </TableCell>
            {view ? (
              <TableCell sx={{ minWidth: 150, maxWidth: 150 }}>
                <Typography>{getApprovedQuantity()}</Typography>
              </TableCell>
            ) : (
              <TableCell sx={{ minWidth: 150, maxWidth: 150 }}>
                <TextField type="text" value={approveQuantity} onChange={onQuantitySelected} />
                {showError && (
                  <Typography color={'error'} sx={{ fontSize: 10 }}>
                    Approved Quantity should not be greater than Requested Quantity
                  </Typography>
                )}
              </TableCell>
            )}
            <TableCell sx={{ minWidth: 150, maxWidth: 150 }}>
              {trxnName !== 'CONSUMPTIONREQUEST' && <Typography>{projectQuantity ? projectQuantity : 0}</Typography>}
            </TableCell>
            {view && (
              <TableCell sx={{ minWidth: 150, maxWidth: 150 }}>
                <Typography>{getApprovedRemarks()}</Typography>
              </TableCell>
            )}
          </TableRow>
        </TableBody>
      </Table>
      {!view && showRemarks && (
        <RHFTextField sx={{ width: 300 }} name={'remarks'} handleChange={onRemarksSelected} label={'Remarks'} type={'text'} />
      )}
    </FormProvider>
  );
};

MaterialApprove.propTypes = {
  val: PropTypes.any,
  saveValue: PropTypes.func,
  contractorQuantity: PropTypes.string,
  projectQuantity: PropTypes.string,
  approverDetails: PropTypes.any,
  view: PropTypes.bool,
  reqApproversData: PropTypes.any,
  overAllData: PropTypes.any,
  trxnName: PropTypes.string,
  showRemarks: PropTypes.bool
};

const ApproverDashboard = ({ onBack, approveData }) => {
  // const [remarks, setRemarks] = useState('');
  const [heading1, setHeading1] = useState('');
  const [heading2, setHeading2] = useState('');
  const [trxnName, setTrxnName] = useState('');
  const { user } = useAuth();
  const methods = useForm({
    resolver: yupResolver(Yup.object().shape()),
    defaultValues: {},
    mode: 'all'
  });
  const dispatch = useDispatch();
  const scrollDownRef = useRef(null);
  const closeCss = { cursor: 'pointer', fontSize: 20 };
  const [openModal, setOpenModal] = useState(false);
  const [selectedApprover, setSelectedApprover] = useState(null);

  useEffect(() => {
    dispatch(
      getApprovers({
        projectId: approveData?.projectId,
        transactionTypeId: approveData?.transactionTypeId,
        storeId: getCompStore(approveData),
        all: true,
        sortBy: 'rank',
        sortOrder: 'ASC'
      })
    );
    dispatch(
      getApproversList({
        transactionTypeId: approveData.transactionTypeId,
        requestNumber: approveData.referenceDocumentNumber,
        storeId: getStore(approveData)
      })
    );
  }, [dispatch, approveData]);

  const {
    approvers: {
      approversObject: { rows: approversListData }
    },
    reqApproversList: {
      approversListObject: { rows: reqApproversData }
    }
  } = useApprovers();

  useEffect(() => {
    const fetchRequestHeadingAndParams = () => {
      let resp = {
        heading1: undefined,
        heading2: undefined,
        req1: undefined,
        req2: undefined
      };
      let txnName = approveData?.transaction_type?.name;
      setTrxnName(txnName);
      if (txnName) {
        if (txnName === 'MRF') {
          resp = {
            heading1: 'Contractor Store QTY',
            heading2: 'Company Store QTY',
            req1: 'to',
            req2: 'from',
            txnName: txnName
          };
        } else if (txnName === 'MRR') {
          resp = {
            heading1: 'Contractor Store QTY',
            heading2: 'Company Store QTY',
            req1: 'from',
            req2: 'to',
            txnName: txnName
          };
        } else if (txnName === 'STR') {
          resp = {
            heading1: 'From Store QTY',
            heading2: 'To Store QTY',
            req1: 'from',
            req2: 'to',
            txnName: txnName
          };
        } else if (txnName === 'CONSUMPTIONREQUEST') {
          resp = {
            heading1: undefined,
            heading2: 'Store QTY',
            req1: undefined,
            req2: 'from',
            txnName: txnName
          };
        } else if (txnName === 'PTPR') {
          resp = {
            heading1: 'From Project Store QTY',
            heading2: 'To Project Store QTY',
            req1: 'from',
            req2: 'to',
            txnName: txnName
          };
        }
      }
      return resp;
    };
    if (approveData) {
      const reqFetchedDetails = fetchRequestHeadingAndParams();
      if (reqFetchedDetails) {
        if (reqFetchedDetails.req1) {
          const trxn1 = {
            project: approveData?.projectId,
            store: reqFetchedDetails.req1 === 'from' ? approveData.fromStoreId : approveData.toStoreId,
            restricted: false
          };
          dispatch(getTransactionsQty(trxn1));
          setHeading1(reqFetchedDetails.heading1);
        }
        if (reqFetchedDetails.req2) {
          const trxn2 = {
            project: reqFetchedDetails.txnName === 'PTPR' ? approveData?.toProjectId : approveData?.projectId,
            store: reqFetchedDetails.req2 === 'to' ? approveData.toStoreId : approveData.fromStoreId,
            restricted: false
          };
          dispatch(getTransactionsSecondQty(trxn2));
          setHeading2(reqFetchedDetails.heading2);
        }
      }
    }
  }, [dispatch, approversListData, approveData]);

  const { transactionQty, transactionSecondQty } = useStockLedger();
  let { projectStoreData } = useMemo(
    () => ({
      projectStoreData: transactionQty?.stocksObject || [],
      isLoading: transactionQty.loading || false
    }),
    [transactionQty]
  );

  let { contractorStoreData } = useMemo(
    () => ({
      contractorStoreData: transactionSecondQty?.stocksObject || [],
      isLoading: transactionSecondQty.loading || false
    }),
    [transactionSecondQty]
  );

  const getQuantity = (arr, materialId, qtyField) => {
    if (arr && arr.length > 0) {
      const respArr = arr.filter((val) => val.materialId === materialId || val.id === materialId);
      return respArr && respArr[0] && respArr[0][qtyField];
    } else return '';
  };

  const checkStatus = (arr) => {
    const resp = {};
    reqApproversData &&
      reqApproversData.length > 0 &&
      reqApproversData.map((val) => {
        if (!resp[val.approverId])
          resp[val.approverId] = {
            status: val.status,
            approvedMaterials: val.approvedMaterials,
            createdAt: formatDate(val.createdAt),
            remarks: val.remarks
          };
      });
    const respData = [];
    arr &&
      arr.length > 0 &&
      arr.map((v) => {
        const arData = { ...v };
        if (resp[v.id] && resp[v.id].status && (resp[v.id].status === '1' || resp[v.id].status === '0')) {
          arData.aprStatus = resp[v.id].status;
          arData.approvedMaterials = resp[v.id].approvedMaterials;
          arData.approvedCreationDate = resp[v.id].createdAt;
          arData.remarks = resp[v.id].remarks;
        }
        respData.push(arData);
      });
    if (approveData && (approveData.approvalStatus === '1' || approveData.approvalStatus === '0'))
      return respData && respData.length && respData.filter((val) => val.aprStatus === '1' || val.aprStatus === '0');
    else return respData && respData.length > 0 ? respData : arr;
  };

  const saveValue = (aprData, ind) => {
    // console.log('aprData :', aprData);
    approveData.remarks = aprData.remarks;
    approveData.materialData[ind] = aprData;
    if (approveData.materialData[ind].approvedQuantity && approveData.materialData[ind].approvedQuantity !== '') {
      approveData.materialData[ind].value = parseFloat(
        approveData.materialData[ind].approvedQuantity * approveData.materialData[ind].rate
      ).toFixed(3);
    } else
      approveData.materialData[ind].value = parseFloat(
        approveData.materialData[ind].requestedQuantity * approveData.materialData[ind].rate
      ).toFixed(3);
    // console.log('approveData.materialData[ind]', approveData.materialData[ind], aprData);
  };

  const approveArr = (arr) => {
    if (arr && arr.length > 0) {
      return arr[arr.length - 1];
    } else {
      return {};
    }
  };

  const getNextApprover = (arr) => {
    if (reqApproversData && reqApproversData.length === 0) return arr ? arr[0] : {};
    else {
      if (arr && arr.length > 0) {
        let resp = null;
        let apr = -1;
        let rej = -1;
        arr &&
          arr.length &&
          arr.forEach((val, i) => {
            if (val.aprStatus === '0') rej = i;
          });
        if (rej === -1) {
          arr &&
            arr.length &&
            arr.forEach((val, i) => {
              if (val.aprStatus === '1') apr = i;
            });
          if (apr >= 0 && apr < arr.length - 1) {
            if (arr[apr]?.userId === user?.id) return arr[apr];
            else resp = arr[apr + 1];
          } else if (apr === arr.length - 1) resp = arr[apr];
        } else {
          if (rej > 0 && rej < arr.length) {
            if (arr[rej]?.userId === user?.id) return arr[rej];
            else resp = arr[rej - 1];
          } else if (rej === 0) resp = arr[rej];
        }
        return resp;
      } else return {};
    }
  };

  const approverDta = getNextApprover(checkStatus(approversListData));
  const getPayload = (approve) => {
    let respError = false;
    const approvedMaterials = () => {
      let respData = [];
      let errCount = 0;
      approveData.materialData.map((val) => {
        respData.push({
          id: val.id,
          approvedQuantity: approve ? val.approvedQuantity : 0,
          value: approve ? val.value : 0
        });
        if (!val.approvedQuantity || val.approvedQuantity > val.requestedQuantity) errCount = errCount + 1;
        // console.log(val);
        // else if (val.approvedQuantity > getQuantity(projectStoreData, val.id, 'quantity')) errCount = errCount + 1;
      });
      if (errCount > 0) respError = true;
      else respError = false;
      // console.log('respData :', approveData);
      return respData;
    };
    const approver = getNextApprover(checkStatus(approversListData));
    return {
      payload: {
        requestName: approveData?.transaction_type?.name,
        transactionTypeId: approveData?.transaction_type?.id,
        projectId: approveData?.project?.id,
        storeId: getStore(approveData),
        approverStoreId: getCompStore(approveData),
        requestNumber: approveData?.referenceDocumentNumber,
        referenceDocumentNumber: approveData?.referenceDocumentNumber,
        approverId: approver?.id,
        rank: approver?.rank,
        status: approve ? '1' : '0',
        remarks: approveData?.remarks,
        name: approver?.user?.name,
        email: approver?.email,
        approverStatus: approve ? 'Approved' : 'Rejected',
        approvedMaterials: approvedMaterials(),
        employeeEmail: approveData?.contractor_employee?.email,
        employeeName: approveData?.contractor_employee?.name
      },
      error: respError
    };
  };

  const onApproveData = async () => {
    const { payload, error } = getPayload(true);
    if (error === false) {
      const val = await request('/approve-reject-request-create', { method: 'POST', body: payload });
      if (!val?.success) {
        toast(val?.error?.message || 'Something wrong happened!', { variant: 'error' });
      } else {
        toast('Approved successfully!', { variant: 'success' });
        onBack();
      }
    } else {
      toast('Invalid approval quantity', { variant: 'error' });
    }
  };
  const onRejectData = async () => {
    const { payload } = getPayload(false);
    const val = await request('/approve-reject-request-create', { method: 'POST', body: payload });
    if (!val?.success) {
      toast(val?.error?.message || 'Something wrong happened!', { variant: 'error' });
    } else {
      toast('Rejected Successfully', { variant: 'success' });
      onBack();
    }
  };

  // const getApprovedQuantity = () => {
  //   if (approveData && approveData.approvalStatus === '2') {
  //     return approveData?.requestedQuantity;
  //   } else {
  //     return approveData?.approvedQuantity;
  //   }
  // };

  const materialsSection = (heading, viewOnly) => {
    return (
      <>
        <Typography gutterBottom component="div" sx={{ mt: '10px' }} variant="h4">
          {heading}
        </Typography>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <Table sx={{ maxWidth: 1400 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 150, maxWidth: 150 }}>
                  <Typography variant="h5" sx={{ fontSize: 14 }}>
                    Name
                  </Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 150, maxWidth: 150 }}>
                  <Typography variant="h5" sx={{ fontSize: 14 }}>
                    Code
                  </Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 100, maxWidth: 100 }}>
                  <Typography variant="h5" sx={{ fontSize: 14 }}>
                    UOM
                  </Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 150, maxWidth: 150 }}>
                  <Typography variant="h5" sx={{ fontSize: 14 }}>
                    {heading2}
                  </Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 150, maxWidth: 150 }}>
                  <Typography variant="h5" sx={{ fontSize: 14 }}>
                    Requested Qty
                  </Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 150, maxWidth: 150 }}>
                  <Typography variant="h5" sx={{ fontSize: 14 }}>
                    Approved Qty
                  </Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 150, maxWidth: 150 }}>
                  <Typography variant="h5" sx={{ fontSize: 14 }}>
                    {heading1}
                  </Typography>
                </TableCell>
                {/* <Grid item md={1} xl={1.5}>
            <Typography variant="h5" sx={{ fontSize: 14 }}>
              Remarks
            </Typography>
          </Grid> */}
              </TableRow>
            </TableHead>
          </Table>
          {approveData?.materialData.map((val, ind) => (
            <MaterialApprove
              key={val.id}
              val={val}
              trxnName={trxnName}
              overAllData={approveData?.materialData}
              saveValue={(v) => {
                // console.log(v);
                saveValue(v, ind);
              }}
              contractorQuantity={getQuantity(contractorStoreData, val.id, 'quantity')}
              projectQuantity={getQuantity(projectStoreData, val.id, 'quantity')}
              reqApproversData={approveArr(reqApproversData)}
              {...(viewOnly && { approverDetails: selectedApprover, view: true })}
              {...(ind === approveData?.materialData?.length - 1 && { showRemarks: true })}
              // qtyApproved={getApprovedQuantity()}
            />
          ))}
          <div>&nbsp;</div>
        </div>
      </>
    );
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const getHeader = (id, type) => {
    let respName = type === 'sender' ? 'From' : 'To';
    if (!['671306a0-48c5-4e0c-a604-d86624f35d6d', 'b938c0b7-8ee0-491e-af4b-ae7f3cbd9821'].includes(id)) {
      respName = type === 'sender' ? 'To' : 'From';
    }
    return respName;
  };

  return (
    <>
      <FormProvider methods={methods}>
        <MainCard title="Approver Dashboard" ref={scrollDownRef}>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <Grid display={'flex'} overflowX={'auto'} spacing={4} padding={1}>
              {approversListData &&
                approversListData.length > 0 &&
                checkStatus(approversListData).map((approvar, ind) => (
                  <Fragment key={approvar.id}>
                    {ind > 0 && ind < approversListData.length && (
                      <Grid item sx={{ width: 50, padding: 1 }} mt={3} textAlign={'center'}>
                        <RightCircleFilled style={{ fontSize: 30, color: '#1890ff' }} />
                      </Grid>
                    )}
                    <Grid item sx={{ minWidth: 190, maxWidth: 190 }} md={3} xl={3}>
                      <Card
                        elevation={3}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (approvar.aprStatus === '1' || approvar.aprStatus === '0') {
                            setOpenModal(true);
                            setSelectedApprover(approvar);
                          }
                        }}
                      >
                        <CardContent sx={{ padding: '17px', textAlign: 'center' }}>
                          <Typography variant="h5" sx={{ fontSize: 12 }} component="div">
                            {approvar?.user?.name}
                          </Typography>
                          {approvar.aprStatus === '1' ? (
                            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'green' }}>Approved</Typography>
                          ) : approvar.aprStatus === '0' ? (
                            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'red' }}>Reject</Typography>
                          ) : (
                            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'orange' }}>Pending</Typography>
                          )}
                          <Typography variant="body" sx={{ fontSize: 10 }} component="div">
                            {approvar?.approvedCreationDate ? 'Approved Date: ' + approvar?.approvedCreationDate : '-'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Fragment>
                ))}
            </Grid>
          </div>
          <Grid container sx={{ mt: 3, mb: 3 }}>
            <Grid item md={12} xl={12}>
              <Divider />
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item md={9} xl={10}>
              <Typography gutterBottom component="div" sx={{ mt: '10px' }} variant="h4">
                Transaction Details
              </Typography>
            </Grid>
            <Grid item md={3} xl={2}>
              <Typography gutterBottom component="div" sx={{ mt: '14px' }} variant="h5">
                Document Number: {approveData.referenceDocumentNumber}
              </Typography>
            </Grid>
            <Grid item md={4} xl={3}>
              <Typography gutterBottom>
                <strong>Project:</strong> {approveData.project.name}
              </Typography>
              <Typography gutterBottom>
                <strong>Transaction Type:</strong> {approveData.transaction_type.name}
              </Typography>
            </Grid>
            <Grid item md={4} xl={3}>
              <Typography gutterBottom>
                <strong>{getHeader(approveData?.transactionTypeId, 'sender')} Organization:</strong>{' '}
                {approveData?.from_store?.organization?.parentId !== null
                  ? approveData?.from_store?.organization?.parent?.name
                  : approveData?.from_store?.organization?.name}
              </Typography>
              <Typography gutterBottom>
                <strong>{getHeader(approveData?.transactionTypeId, 'receiver')} Organization:</strong>{' '}
                {approveData?.to_store?.organization?.parentId !== null
                  ? approveData?.to_store?.organization?.parent?.name
                  : approveData?.to_store?.organization?.name}
              </Typography>
            </Grid>
            <Grid item md={4} xl={3}>
              <Typography gutterBottom>
                <strong>{getHeader(approveData?.transactionTypeId, 'sender')} Store:</strong> {approveData.from_store.name}
              </Typography>
              <Typography gutterBottom>
                <strong>{getHeader(approveData?.transactionTypeId, 'receiver')} Store:</strong> {approveData.to_store.name}
              </Typography>
            </Grid>
            {/* <Grid item md={4} xl={3}></Grid> */}
            <Grid item md={4} xl={3}>
              <Typography gutterBottom>
                <strong>Created Date:</strong> {formatDate(approveData.createdAt)}
              </Typography>
              <Typography gutterBottom>
                <strong>Updated Date:</strong> {formatDate(approveData.updatedAt)}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 3, mb: 3 }}>
            <Grid item md={12} xl={12}>
              <Divider />
            </Grid>
          </Grid>
          {materialsSection('Material Details', false)}
          <Grid container spacing={4} mt={1}>
            <Grid item xs={6}></Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={4} mt={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', height: 65 }}>
              <Button size="small" variant="outlined" onClick={onBack} color="primary">
                Back
              </Button>
              {approverDta?.userId === user?.id ? (
                <>
                  <Button
                    disabled={approveData.approvalStatus === '2' && approveData.status === '1' ? false : true}
                    size="small"
                    variant="contained"
                    onClick={onApproveData}
                    color="primary"
                  >
                    Approve
                  </Button>
                  <Button
                    disabled={approveData.approvalStatus === '2' && approveData.status === '1' ? false : true}
                    size="small"
                    variant="contained"
                    onClick={onRejectData}
                    color="primary"
                  >
                    Reject
                  </Button>
                </>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
      <Modal open={openModal} onClose={closeModal} aria-labelledby="modal-modal-title">
        <MainCard sx={{ width: '95%' }} modal darkTitle content={false}>
          <Grid container spacing={2} alignItems={'center'} sx={{ mt: 0 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
              <CloseCircleOutlined onClick={closeModal} style={closeCss} />
            </Grid>
          </Grid>
          <Grid m={4} mt={-4}>
            {materialsSection('Material Approve/Reject Details', true)}
          </Grid>
          <Grid container spacing={4} m={0}>
            <Grid item md={6} mt={-3} mb={2}>
              <Typography variant="h5" sx={{ fontSize: 14 }}>
                Remarks
              </Typography>
              <br />
              <Typography>{selectedApprover?.remarks ? selectedApprover?.remarks : 'N/A'}</Typography>
            </Grid>
          </Grid>
        </MainCard>
      </Modal>
    </>
  );
};

ApproverDashboard.propTypes = {
  approveData: PropTypes.any,
  onBack: PropTypes.func
};

export default ApproverDashboard;
function getTrimmed(inputValue) {
  let approvedValue = '';
  if (inputValue.endsWith('.')) {
    approvedValue = inputValue.substring(0, inputValue.length - 1);
  } else {
    approvedValue = inputValue;
  }
  return approvedValue;
}
