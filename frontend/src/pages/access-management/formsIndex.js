import { Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import FormsHierarchy from './formsHierarchy';
import FormsTable from './formsTable';
import { getFormProjectWise, getFormWithRoles } from 'store/actions';
import { useFormResponses } from 'pages/form-configurator/responses/useFormResponses';
import CircularLoader from 'components/CircularLoader';

const FormsIndex = () => {
  const dispatch = useDispatch();
  const [showDetails, setShowDetails] = useState([]);
  const [formName, setFormName] = useState('');
  const [pending, setPending] = useState(false);
  const [check, setCheck] = useState(false);
  const [formId, setFormId] = useState(null);
  const { pathname } = useLocation();
  useEffect(() => {
    setShowDetails([]);
    setFormName('');
    setFormId(null);
    setCheck(false);
  }, [pathname]);

  const { formProjectWise } = useFormResponses();

  const { formsData } = useMemo(
    () => ({
      formsData: formProjectWise.formsObject || [],
      count: formProjectWise.formsObject?.count || 0,
      isLoading: formProjectWise.loading || false
    }),
    [formProjectWise]
  );

  const { formWithRoles } = useFormResponses();

  const { formsRspData } = useMemo(
    () => ({
      formsRspData: formWithRoles.formsObject || [],
      count: formWithRoles.formsObject?.count || 0,
      isLoading: formWithRoles.loading || false
    }),
    [formWithRoles]
  );

  const onGetDetails = (id, name) => {
    setShowDetails([]);
    setPending(true);
    setCheck(true);
    dispatch(getFormWithRoles(id));
    setFormName(name);
    setFormId(id);
  };

  useEffect(() => {
    if (formsRspData) {
      setShowDetails(formsRspData);
      setPending(false);
    }
  }, [formsRspData]);

  useEffect(() => {
    dispatch(getFormProjectWise());
  }, [dispatch]);

  return (
    <Grid container spacing={1}>
      {pending && <CircularLoader />}
      <Grid item xs={12} md={3}>
        <FormsHierarchy data={formsData} showFormDetails={onGetDetails} />
      </Grid>
      <Grid item xs={12} md={9}>
        <FormsTable details={check ? showDetails : []} name={formName} id={formId} />
      </Grid>
    </Grid>
  );
};

export default FormsIndex;
