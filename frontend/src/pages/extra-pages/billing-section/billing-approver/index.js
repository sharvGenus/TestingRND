import { PAGINATION_CONST } from 'constants';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PropTypes from 'prop-types';
import { useProjects } from '../../project/useProjects';
import { useBillSubmissions } from '../useBillSubmissions';
import ApproverDashboard from './billing-approver-dashboard';
import { FormProvider, RHFSelectbox } from 'hook-form';
import { getBillSubmissions, getDropdownProjects } from 'store/actions';
import Validations from 'constants/yupValidations';
import MainCard from 'components/MainCard';
import TableForm from 'tables/table';

const Actions = ({ value, onView }) => {
  return (
    <div>
      <Tooltip title="View" placement="bottom">
        <IconButton color="secondary" onClick={() => onView(value)}>
          <VisibilityOutlinedIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

Actions.propTypes = {
  value: PropTypes.any,
  onView: PropTypes.func
};

const BillingDashboardListing = () => {
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const [contentToShow, setContentToShow] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [projectId, setProjectId] = useState(null);

  const headers = [
    {
      Header: 'Actions',
      accessor: 'actions'
    },
    {
      Header: 'Bill Number',
      accessor: 'billNumber'
    },
    {
      Header: 'Approval Status',
      accessor: 'approveStatus'
    },
    {
      Header: 'Total Amount',
      accessor: 'totalAmount'
    },
    {
      Header: 'Created On',
      accessor: 'createdAt'
    },
    {
      Header: 'Updated On',
      accessor: 'updatedAt'
    }
  ];

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const selectBox = (name, label, menus, req, onChange) => {
    return (
      <RHFSelectbox
        name={name}
        onChange={onChange}
        label={label}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        {...(req && { required: true })}
      />
    );
  };

  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  const { projectsDropdown } = useProjects();
  const {
    billSubmissions: {
      billSubmissionsObject: { rows: billData = [] }
    }
  } = useBillSubmissions();
  const projectData = projectsDropdown?.projectsDropdownObject;

  const onFormSubmit = (values) => {
    const { projectId: selectedProject } = values;
    setProjectId(selectedProject);
    dispatch(getBillSubmissions({ projectId: selectedProject }));
  };

  const { handleSubmit } = methods;

  //   const filteredData = (dataArray) => {
  //     const respArr = [];
  //     const jsn = {};
  //     JSON.parse(JSON.stringify(dataArray)).map((val) => {
  //       const pushedData = {
  //         id: val.materialId,
  //         name: val.material.name,
  //         code: val.material.code,
  //         uom: val.uom.name,
  //         requestedQuantity: val.requestedQuantity,
  //         store: val.transaction_type && val.transaction_type.name === 'MRR' ? val.from_store : val.to_store,
  //         value: val.value,
  //         rate: val.rate,
  //         remarks: val.remarks
  //       };
  //       if (
  //         jsn[val.referenceDocumentNumber + val.transactionTypeId + getStore(val)] &&
  //         jsn[val.referenceDocumentNumber + val.transactionTypeId + getStore(val)]['materialData']
  //       )
  //         jsn[val.referenceDocumentNumber + val.transactionTypeId + getStore(val)]['materialData'].push(pushedData);
  //       else {
  //         val['materialData'] = [];
  //         val['materialData'] = [pushedData];
  //         jsn[val.referenceDocumentNumber + val.transactionTypeId + getStore(val)] = val;
  //       }
  //     });
  //     Object.keys(jsn).forEach((key) => {
  //       respArr.push(jsn[key]);
  //     });
  //     return respArr;
  //   };

  const onView = (val) => {
    setContentToShow(val);
    setShowDetails(true);
  };

  const addView = (arr) => {
    const list = arr.map((val) => ({
      ...val,
      actions: <Actions value={val} onView={onView} />,
      // approveStatus: val.approvalStatus === '2' ? 'Pending' : val.approvalStatus === '1' ? 'Approved' : 'Rejected'
      approveStatus: 'Pending'
    }));
    return list;
  };

  const onBack = () => {
    dispatch(getBillSubmissions({ projectId }));
    setShowDetails(false);
  };
  return (
    <>
      {showDetails ? (
        <ApproverDashboard onBack={onBack} approveData={contentToShow} />
      ) : (
        <>
          <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
            <MainCard title={'Billing Approver Dashboard'}>
              <Grid container spacing={4}>
                <Grid item xs={3}>
                  {selectBox('projectId', 'Project', projectData, true)}
                </Grid>
              </Grid>
              <Grid container spacing={2} alignItems={'center'} sx={{ mt: 2 }}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                  <Button size="small" type="submit" variant="contained" color="primary">
                    Proceed
                  </Button>
                </Grid>
              </Grid>
            </MainCard>
          </FormProvider>
          {projectId && (
            <TableForm
              title={''}
              hideHeader
              data={addView(billData)}
              count={billData.length}
              columns={headers}
              hideActions={true}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              pageIndex={pageIndex}
              pageSize={pageSize}
            />
          )}
        </>
      )}
    </>
  );
};

export default BillingDashboardListing;
