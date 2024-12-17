import { Grid, Table, TableBody, TableCell, TableHead } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMaterial } from '../material/useMaterial';
import MainCard from 'components/MainCard';
import { formatDate } from 'utils';
import { getMaterialByIntegrationId } from 'store/actions';

const ViewContent = ({ viewData }) => {
  const formatSchedule = (str) => {
    if (str && str.includes('[{')) {
      const arr = JSON.parse(str);
      let returnStr = [];
      arr.map((val) => {
        returnStr.push(val.quantity + ' / ' + val.date);
      });
      return returnStr;
    } else return [str];
  };

  return (
    <MainCard>
      <Grid container spacing={4}>
        <Grid item xs={3}>
          PO No.: {viewData.poNumber}
        </Grid>
        <Grid item xs={3}>
          PO Date: {formatDate(viewData.poDate)}
        </Grid>
        <Grid item xs={3}>
          Rev. Ref: {viewData.revisionReference}
        </Grid>
        <Grid item xs={3}>
          Rev. Date: {formatDate(viewData.revisionDate)}
        </Grid>
        <Grid item xs={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              To:
            </Grid>
            <Grid item xs={12} mt={-3} mb={2}>
              {viewData?.organization?.name} <br />
              {viewData?.organization?.address},{viewData?.organization?.cities?.name}, {viewData?.organization?.cities?.state?.name},{' '}
              {viewData?.organization?.cities?.state?.country?.name}, {viewData?.organization?.pincode}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              Billing Address:
            </Grid>
            <Grid item xs={12} mt={-3}>
              {viewData.billingAddress}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              Delivery Address:
            </Grid>
            <Grid item xs={12} mt={-3}>
              {viewData.deliveryAddress}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container sx={{ margin: 'auto' }}>
        <Table>
          <TableHead>
            <TableCell sx={{ textAlign: 'center' }}>S.No.</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Item Code Description</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>UOM</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Qty</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Unit Price</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Price Unit</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Total Price</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              Delivery Schedule <br /> Qty. / Date
            </TableCell>
          </TableHead>
          {viewData &&
            viewData.materials &&
            viewData.materials.length > 0 &&
            viewData.materials.map((val, ind) => (
              <TableBody key={val}>
                <TableCell sx={{ textAlign: 'center' }}>{ind + 1}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {val?.matData?.code}
                  <br />
                  {val?.matData?.name}
                  <br />
                  {viewData?.organization?.incoterms?.name}
                  <br />
                  {val?.longDescription}
                  <br />
                  {val?.matData?.hsnCode}
                  <br />
                  <br />
                  <br />
                  IGST @ &nbsp;&nbsp;{val?.tax}%
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{val?.matData?.material_uom?.name}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{val?.quantity}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{val?.unitPrice}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{val?.priceUnit}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{val?.totalPrice}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {formatSchedule(val?.deliverySchedule).map((formatedData) => (
                    <>
                      {formatedData}
                      <br />
                    </>
                  ))}
                </TableCell>
              </TableBody>
            ))}
        </Table>
      </Grid>
      <Grid container sx={{ margin: 'auto' }}></Grid>
    </MainCard>
  );
};

ViewContent.propTypes = {
  viewData: PropTypes.any
};

const ViewPurchaseOrder = ({ data }) => {
  const dispatch = useDispatch();
  const [viewData, setViewData] = useState(JSON.parse(JSON.stringify(data)));
  const [editMaterial, setEditMaterial] = useState(null);
  const [count, setCount] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (viewData?.materials && viewData?.materials[count])
      dispatch(getMaterialByIntegrationId(viewData?.materials[count].materialIntegrationId));
    else {
      setTimeout(() => {
        setShowContent(true);
      }, 300);
    }
  }, [dispatch, viewData, count]);

  const { materialContent } = useMaterial();
  const { matData } = useMemo(
    () => ({
      matData: materialContent?.materialObject || null,
      isLoading: materialContent?.loading || false
    }),
    [materialContent]
  );

  useEffect(() => {
    if (editMaterial && editMaterial.id && viewData && viewData.materials && viewData.materials[count]) {
      setViewData([]);
      let list = JSON.parse(JSON.stringify(viewData));
      const prevData = list.materials[count];
      prevData['matData'] = editMaterial;
      list.materials[count] = { ...prevData };
      setTimeout(() => {
        setViewData(list);
        setEditMaterial(null);
        setCount(count + 1);
      }, 50);
    }
  }, [editMaterial, viewData, count]);

  useEffect(() => {
    setEditMaterial(matData);
  }, [matData]);

  return <>{showContent && <ViewContent viewData={viewData} />}</>;
};

ViewPurchaseOrder.propTypes = {
  data: PropTypes.any
};

export default ViewPurchaseOrder;
