import { Grid, Typography } from '@mui/material';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FormProvider } from 'hook-form';

const MaterialApprove = ({ val }) => {
  //   const [value, setValue] = useState(val);
  //   const [approveQuantity, setApproveQuantity] = useState('');
  //   const [showError, setShowError] = useState(false);

  const methods = useForm({
    resolver: yupResolver(Yup.object().shape({})),
    defaultValues: {},
    mode: 'all'
  });

  //   const saveData = (aprQty) => {
  //     if (typeof aprQty === 'string' && value) {
  //       let allValues = JSON.parse(JSON.stringify(value));
  //       allValues.approvedQuantity = aprQty;
  //       setValue(allValues);
  //       //   saveValue(allValues);
  //     }
  //   };

  //   useEffect(() => {
  //     const savePreData = (aprQty) => {
  //       if (typeof aprQty === 'string' && val) {
  //         let allValues = JSON.parse(JSON.stringify(val));
  //         allValues.approvedQuantity = aprQty;
  //         setValue(allValues);
  //         // saveValue(allValues);
  //       }
  //     };
  //     if (reqApproversData && reqApproversData.id) {
  //       const getQty =
  //         reqApproversData && reqApproversData.approvedMaterials && reqApproversData.approvedMaterials.filter((req) => req.id === val.id);
  //       if (getQty && getQty[0]) {
  //         setApproveQuantity(getQty[0]?.approvedQuantity + '');
  //         savePreData(getQty[0]?.approvedQuantity + '');
  //       }
  //     } else if (overAllData && overAllData.length > 0) {
  //       const getQty = overAllData.filter((ovl) => ovl.id === val.id);
  //       if (getQty[0]?.approvedQuantity && getQty[0]?.approvedQuantity !== 'undefined') {
  //         setApproveQuantity(getQty[0]?.approvedQuantity + '');
  //         savePreData(getQty[0]?.approvedQuantity + '');
  //       } else {
  //         setApproveQuantity(val?.requestedQuantity + '');
  //         savePreData(val?.requestedQuantity + '');
  //       }
  //     } else if (val && val.requestedQuantity) {
  //       setApproveQuantity(val?.requestedQuantity + '');
  //       savePreData(val?.requestedQuantity + '');
  //     }
  //   }, [val, reqApproversData, saveValue, overAllData]);

  //   const getApprovedQuantity = () => {
  //     if (approverDetails && approverDetails.approvedMaterials && approverDetails.approvedMaterials.length > 0) {
  //       const allData = approverDetails.approvedMaterials.filter((appr) => appr.id === value.id);
  //       return allData[0].approvedQuantity;
  //     } else return 0;
  //   };

  //   const getApprovedRemarks = () => {
  //     if (approverDetails && approverDetails.approvedMaterials && approverDetails.approvedMaterials.length > 0) {
  //       const allData = approverDetails.approvedMaterials.filter((appr) => appr.id === value.id);
  //       return allData[0].remarks;
  //     } else return 'N/A';
  //   };

  //   const onQuantitySelected = (e) => {
  //     const re = /^[0-9\b]+$/;
  //     if (e.target.value === '' || re.test(e.target.value)) {
  //       if (e?.target?.value) {
  //         let aprValue = e?.target?.value;
  //         let allValues = JSON.parse(JSON.stringify(value));
  //         if (aprValue > allValues.requestedQuantity) setShowError(true);
  //         else setShowError(false);
  //         setApproveQuantity(aprValue);
  //         saveData(aprValue);
  //       } else {
  //         setApproveQuantity('');
  //         saveData('');
  //       }
  //     }
  //   };

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={4}>
        <Grid item md={2} xl={2} mt={1.5} mb={2}>
          <Typography>{val?.particulars}</Typography>
        </Grid>
        <Grid item md={2} xl={2} mt={1.5} mb={2}>
          <Typography> {val?.master_maker_lov?.name}</Typography>
        </Grid>
        <Grid item md={1.5} xl={1.5} mt={1.5} mb={2}>
          <Typography>{val?.quantity}</Typography>
        </Grid>
        <Grid item md={1.5} xl={1.5} mt={1.5} mb={2}>
          <Typography>{val?.rate}</Typography>
        </Grid>
        <Grid item md={1.5} xl={1.5} mt={1.5} mb={2}>
          <Typography>{val?.tax}</Typography>
        </Grid>
        <Grid item md={1.5} xl={1.5} mt={1.5} mb={2}>
          <Typography>{val?.amount}</Typography>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

MaterialApprove.propTypes = {
  val: PropTypes.any,
  view: PropTypes.bool
};

export default MaterialApprove;
