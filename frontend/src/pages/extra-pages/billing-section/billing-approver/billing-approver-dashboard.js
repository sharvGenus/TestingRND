import { Grid, Button, Divider, Typography } from '@mui/material';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
// import { useApprovers } from '../../approver/useApprover';
import { useBillSubmissions } from '../useBillSubmissions';
import MaterialsSection from './material-section';
import MainCard from 'components/MainCard';
import { FormProvider, RHFTextField } from 'hook-form';
// import { getApprovers, getApproversList } from 'store/actions';
import { formatDate } from 'utils';
import { getMaterialDetails } from 'store/actions';
// import request from 'utils/request';
// import toast from 'utils/ToastNotistack';
// import useAuth from 'hooks/useAuth';

const ApproverDashboard = ({ onBack, approveData }) => {
  //   const [remarks, setRemarks] = useState('');
  //   const { user } = useAuth();
  const methods = useForm({
    resolver: yupResolver(Yup.object().shape()),
    defaultValues: {},
    mode: 'all'
  });
  const dispatch = useDispatch();
  useEffect(() => {
    if (approveData) {
      dispatch(getMaterialDetails({ billingBasicDetailId: approveData?.id }));
    }
  }, [approveData, dispatch]);

  const {
    billMaterialSubmissions: {
      billMaterialSubmissionsObject: { rows: materialData = [] }
    }
  } = useBillSubmissions();
  //   const closeCss = { cursor: 'pointer', fontSize: 20 };
  //   const [openModal, setOpenModal] = useState(false);
  //   const [selectedApprover, setSelectedApprover] = useState(null);

  // const {
  //   approvers: {
  //     approversObject: { rows: approversListData }
  //   },
  //   reqApproversList: {
  //     approversListObject: { rows: reqApproversData }
  //   }
  // } = useApprovers();
  // console.log('reqApproversData :', reqApproversData);
  // console.log('approversListData :', approversListData);

  //   const checkStatus = (arr) => {
  //     const resp = {};
  //     reqApproversData &&
  //       reqApproversData.length > 0 &&
  //       reqApproversData.map((val) => {
  //         if (!resp[val.approverId])
  //           resp[val.approverId] = {
  //             status: val.status,
  //             approvedMaterials: val.approvedMaterials,
  //             createdAt: formatDate(val.createdAt),
  //             remarks: val.remarks
  //           };
  //       });
  //     const respData = [];
  //     arr &&
  //       arr.map((v) => {
  //         const arData = { ...v };
  //         if (resp[v.id] && resp[v.id].status && (resp[v.id].status === '1' || resp[v.id].status === '0')) {
  //           arData.aprStatus = resp[v.id].status;
  //           arData.approvedMaterials = resp[v.id].approvedMaterials;
  //           arData.approvedCreationDate = resp[v.id].createdAt;
  //           arData.remarks = resp[v.id].remarks;
  //         }
  //         respData.push(arData);
  //       });
  //     if (approveData && (approveData.approvalStatus === '1' || approveData.approvalStatus === '0'))
  //       return respData && respData.length && respData.filter((val) => val.aprStatus === '1' || val.aprStatus === '0');
  //     else return respData && respData.length > 0 ? respData : arr;
  //   };

  //   const getNextApprover = (arr) => {
  //     if (reqApproversData && reqApproversData.length === 0) return arr ? arr[0] : {};
  //     else {
  //       let resp = null;
  //       arr &&
  //         arr.length &&
  //         arr.forEach((val, i) => {
  //           if (val.aprStatus === '1' && i < arr.length - 1) {
  //             resp = arr[i + 1];
  //           }
  //         });
  //       return resp;
  //     }
  //   };

  //   const approverDta = getNextApprover(checkStatus(approversListData));
  //   const getPayload = (approve) => {
  //     let respError = false;
  //     const approvedMaterials = () => {
  //       let respData = [];
  //       let errCount = 0;
  //       approveData.materialData.map((val) => {
  //         respData.push({
  //           id: val.id,
  //           approvedQuantity: approve ? val.approvedQuantity : 0,
  //           value: approve ? val.value : 0
  //         });
  //         if (!val.approvedQuantity || val.approvedQuantity > val.requestedQuantity) errCount = errCount + 1;
  //         // else if (val.approvedQuantity > getQuantity(projectStoreData, val.id, 'quantity')) errCount = errCount + 1;
  //       });
  //       if (errCount > 0) respError = true;
  //       else respError = false;
  //       return respData;
  //     };
  //     // const approver = getNextApprover(checkStatus(approversListData));
  //     return {
  //       payload: {
  //         projectId: approveData?.project?.id,
  //         billNumber: approveData?.billNumber,
  //         // rank: approver?.rank,
  //         status: approve ? '1' : '0',
  //         remarks: remarks,
  //         // name: approver?.user?.name,
  //         // email: approver?.email,
  //         approverStatus: approve ? 'Approved' : 'Rejected',
  //         approvedMaterials: approvedMaterials()
  //       },
  //       error: respError
  //     };
  //   };

  //   const onApproveData = async () => {
  //     const { payload, error } = getPayload(true);
  //     if (error === false) {
  //       const val = await request('/approve-reject-request-create', { method: 'POST', body: payload });
  //       if (!val?.success) {
  //         toast(val?.error?.message || 'Something wrong happened!', { variant: 'error' });
  //       } else {
  //         toast('Approved successfully!', { variant: 'success' });
  //         onBack();
  //       }
  //     } else {
  //       toast('Invalid approval quantity', { variant: 'error' });
  //     }
  //   };
  //   const onRejectData = async () => {
  //     const { payload } = getPayload(false);
  //     const val = await request('/approve-reject-request-create', { method: 'POST', body: payload });
  //     if (!val?.success) {
  //       toast(val?.error?.message || 'Something wrong happened!', { variant: 'error' });
  //     } else {
  //       toast('Rejected Successfully', { variant: 'success' });
  //       onBack();
  //     }
  //   };

  //   const closeModal = () => {
  //     setOpenModal(false);
  //   };

  return (
    <>
      <FormProvider methods={methods}>
        <MainCard title="Approver Dashboard">
          {/* <Grid container spacing={4}>
            {approversListData &&
              approversListData.length > 0 &&
              checkStatus(approversListData).map((approvar, ind) => (
                <Fragment key={approvar.id}>
                  {ind > 0 && ind < approversListData.length && (
                    <Grid item md={1} xl={1} mt={3} textAlign={'center'}>
                      <RightCircleFilled style={{ fontSize: 30, color: '#1890ff' }} />
                    </Grid>
                  )}
                  <Grid item md={2} xl={2}>
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
          </Grid> */}
          <Grid container spacing={4}>
            <Grid item md={9} xl={9}>
              <Typography gutterBottom component="div" sx={{ mt: '10px' }} variant="h4">
                Bill Details
              </Typography>
            </Grid>
            <Grid item md={3} xl={3}>
              <Typography gutterBottom component="div" sx={{ mt: '14px' }} variant="h5">
                Document Number: {approveData.billNumber}
              </Typography>
            </Grid>
            <Grid item md={3} xl={2}>
              <Typography gutterBottom>
                <strong>Project:</strong> {approveData.project.name}
              </Typography>
            </Grid>
            <Grid item md={3} xl={2}>
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
          <MaterialsSection heading="Material Details" viewOnly={false} materialData={materialData} />
          <Grid container spacing={4} mt={1}>
            <Grid item md={6}>
              {/* remove quote when page is ready from handleChange */}
              <RHFTextField name={'remarks'} handleChange={'onRemarksSelected'} label={'Remarks'} type={'text'} />
            </Grid>
            <Grid item md={2}></Grid>
            <Grid item md={4} mt={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', height: 65 }}>
              <Button size="small" variant="outlined" onClick={onBack} color="primary">
                Back
              </Button>
              {/* {approverDta?.userId === user?.id ? (
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
              )} */}
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
      {/* <Modal open={openModal} onClose={closeModal} aria-labelledby="modal-modal-title">
        <MainCard sx={{ width: '95%' }} modal darkTitle content={false}>
          <Grid container spacing={2} alignItems={'center'} sx={{ mt: 0 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
              <CloseCircleOutlined onClick={closeModal} style={closeCss} />
            </Grid>
          </Grid>
          <Grid m={4} mt={-4}>
            <MaterialsSection heading="Material Approve/Reject Details" viewOnly={true} materialData={materialData} />
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
      </Modal> */}
    </>
  );
};

ApproverDashboard.propTypes = {
  approveData: PropTypes.any,
  onBack: PropTypes.func
};

export default ApproverDashboard;
