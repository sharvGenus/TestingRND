import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, styled } from '@mui/material';
import PropTypes from 'prop-types';
import { useApprovers } from 'pages/extra-pages/approver/useApprover';
import { getApprovers, getApproversList } from 'store/actions';
import { getCompStore, getDateTimeBoth, getStore } from 'utils';

const StyledDiv = styled('div')(() => ({
  height: '100px',
  overflowY: 'auto',
  border: '1px solid #d9d9d9',
  borderRadius: '4px'
}));

const ApproverRemarks = ({ data }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (data && data.length > 0) {
      dispatch(
        getApproversList({
          transactionTypeId: data[0]?.transactionTypeId,
          requestNumber: data[0]?.referenceDocumentNumber,
          storeId: getStore(data[0])
        })
      );
      // TODO add StoreId
      dispatch(
        getApprovers({
          projectId: data[0]?.projectId,
          transactionTypeId: data[0]?.transactionTypeId,
          storeId: getCompStore(data[0]),
          all: true,
          sortBy: 'rank',
          sortOrder: 'ASC'
        })
      );
    }
  }, [dispatch, data]);

  const {
    approvers: {
      approversObject: { rows: approversListData }
    },
    reqApproversList: {
      approversListObject: { rows: reqApproversData }
    }
  } = useApprovers();

  const checkStatus = (arr) => {
    if (!reqApproversData?.length) {
      return [];
    }
    const resp = {};
    reqApproversData &&
      reqApproversData.length > 0 &&
      reqApproversData.map((val) => {
        if (!resp[val.approverId])
          resp[val.approverId] = {
            status: val.status,
            approvedMaterials: val.approvedMaterials,
            createdAt: getDateTimeBoth(val.createdAt, '24hour'),
            remarks: val.remarks
          };
      });
    const respData =
      arr &&
      arr.map((v) => {
        const arData = { ...v };
        if (resp[v.id] && resp[v.id].status && (resp[v.id].status === '1' || resp[v.id].status === '0')) {
          arData.aprStatus = resp[v.id].status;
          arData.approvedMaterials = resp[v.id].approvedMaterials;
          arData.approvedCreationDate = resp[v.id].createdAt;
          arData.remarks = resp[v.id].remarks;
        }
        return arData;
      });
    return respData;
  };

  return (
    <>
      <Typography sx={{ mb: 1 }}>Approver remarks</Typography>
      <StyledDiv>
        {approversListData &&
          approversListData.length > 0 &&
          checkStatus(approversListData).map((approvar) => (
            <>
              <Typography variant="h5" key={approvar} sx={{ ml: 1, mt: 1 }}>
                {approvar?.user?.name}
                &nbsp;&nbsp;&nbsp;
                {approvar?.approvedCreationDate}
              </Typography>
              <Typography gutterBottom variant="body1" key={approvar?.user?.name} sx={{ ml: 3 }}>
                {approvar?.remarks}
              </Typography>
            </>
          ))}
      </StyledDiv>
    </>
  );
};

ApproverRemarks.propTypes = {
  data: PropTypes.array
};

export default ApproverRemarks;
