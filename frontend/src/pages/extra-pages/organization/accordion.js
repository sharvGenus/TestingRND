import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Divider, Grid, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { useCountries } from '../country/useCountries';
import { useCities } from '../city/useCities';
import { useStates } from '../state/useStates';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import {
  getCurrentDropdownCities,
  getCurrentDropdownStates,
  getDropdownCities,
  getDropdownCountries,
  getDropdownStates
} from 'store/actions';
import { transformDataWithFilePaths } from 'utils';

// ==============================|| ACCORDION - CUSTOMIZED ||============================== //

const CustomizedAccordion = (props) => {
  const { txtBox, selectBox, orgType, checkBox, view, fileFields, update, data, methods, handleCheck, sameAddress, setSameAddress } = props;
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCurrentCountry, setSelectedCurrentCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCurrentState, setSelectedCurrentState] = useState('');
  const theme = useTheme();
  const [expanded, setExpanded] = useState('panel1');
  const { setValue, getValues } = methods;
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDropdownCountries());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCountry) dispatch(getDropdownStates(selectedCountry));
  }, [dispatch, selectedCountry]);

  useEffect(() => {
    if (selectedCurrentCountry) dispatch(getCurrentDropdownStates(selectedCurrentCountry));
  }, [dispatch, selectedCurrentCountry]);

  useEffect(() => {
    if (selectedState) dispatch(getDropdownCities(selectedState));
  }, [dispatch, selectedState]);

  useEffect(() => {
    if (selectedCurrentState) dispatch(getCurrentDropdownCities(selectedCurrentState));
  }, [dispatch, selectedCurrentState]);
  const { masterMakerOrgType, masterMakerCurrency, masterMakerGstStatus, masterMakerIncoterms, masterMakerPaymentTerm, masterMakerTitle } =
    useMasterMakerLov();
  const typeData = masterMakerOrgType.masterObject.filter((x) => x.name === orgType.toUpperCase());
  const handleCountryId = (name, e) => {
    if (name === 'registeredOfficeCountryId') {
      setSelectedCountry(e?.target?.value);
    } else if (name === 'countryId') {
      setSelectedCurrentCountry(e?.target?.value);
    }
  };

  const handleStateId = (name, e) => {
    if (name === 'registeredOfficeStateId') {
      setSelectedState(e?.target?.value);
    } else if (name === 'stateId') {
      setSelectedCurrentState(e?.target?.value);
    }
  };
  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };
    if (view || update) {
      setSameAddress(true);
      setSelectedCountry(data.register_office_cities?.state.country.id);
      setSelectedCurrentCountry(data.current_office_cities?.state.country.id);
      setSelectedState(data.register_office_cities?.state.id);
      setSelectedCurrentState(data.current_office_cities?.state.id);
      setValue('check', data.check);
      setValue('registeredOfficeCountryId', data.register_office_cities?.state.country.id);
      setValue('registeredOfficeStateId', data.register_office_cities?.state.id);
      setValue('countryId', data.cities?.state.country.id);
      setValue('stateId', data.cities?.state.id);
      handleSetValues(transformDataWithFilePaths(data, fileFields));
    }
  }, [data, fileFields, setSameAddress, setValue, update, view]);

  useEffect(() => {
    setValue('organizationTypeId', typeData[0]?.id); // Set the default value for the "type" field
  }, [dispatch, setValue, typeData]);
  useEffect(() => {
    sameAddress
      ? (setValue('address', getValues('registeredOfficeAddress')),
        setValue('countryId', getValues('registeredOfficeCountryId')),
        setValue('stateId', getValues('registeredOfficeStateId')),
        setValue('cityId', getValues('registeredOfficeCityId')),
        setValue('pinCode', getValues('registeredOfficePinCode')))
      : (setValue('address', ''), setValue('countryId', ''), setValue('stateId', ''), setValue('cityId', ''), setValue('pinCode', ''));
    setSelectedCurrentCountry(getValues('countryId'));
    setSelectedCurrentState(getValues('stateId'));
  }, [setValue, sameAddress, getValues]);

  const { countriesDropdown } = useCountries();
  const { statesDropdown, currentStatesDropdown } = useStates();
  const { citiesDropdown, currentCitiesDropdown } = useCities();
  const gstStatusData = masterMakerGstStatus?.gstStatusObject || [];
  const countryData = countriesDropdown.countriesDropdownObject;
  const stateData = statesDropdown.statesDropdownObject;
  const currentStateData = currentStatesDropdown.currentStatesDropdownObject;
  const cityData = citiesDropdown.citiesDropdownObject;
  const currentCityData = currentCitiesDropdown.currentCitiesDropdownObject;
  const currnecyData = masterMakerCurrency?.currencyObject || [];
  const incotermsData = masterMakerIncoterms?.incotermsObject || [];
  const paymentData = masterMakerPaymentTerm?.paymentTermObject || [];
  const titleData = masterMakerTitle?.titleObject || [];
  return (
    <Box
      sx={{
        '& .MuiAccordion-root': {
          borderColor: theme.palette.divider,
          '& .MuiAccordionSummary-root': {
            bgcolor: 'transparent',
            flexDirection: 'row',
            '&:focus-visible': {
              bgcolor: 'primary.lighter'
            }
          },
          '& .MuiAccordionDetails-root': {
            borderColor: theme.palette.divider
          },
          '& .Mui-expanded': {
            color: theme.palette.primary.main
          }
        }
      }}
    >
      <Accordion defaultExpanded expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h5">Basic Details</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('organizationTypeId', 'Type', typeData, true, undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('title', 'Title', titleData, undefined, undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('name', 'Name', 'text', undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('code', 'Code', 'text', undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('integrationId', 'Integration ID', 'text', undefined, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('email', 'Email', 'text', undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('mobileNumber', 'Mobile Number', 'number', undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('gstNumber', 'GSTIN', 'text', undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('telephone', 'Telephone', 'text', undefined, false)}
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 3, mb: 3 }}>
            <Grid item md={12} xl={12}>
              <Divider />
            </Grid>
          </Grid>
          <Grid container spacing={4} alignItems="flex-end">
            <Grid item md={3} xl={2}>
              {txtBox('registeredOfficeAddress', 'Registered Address', 'text', undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'registeredOfficeCountryId',
                'Registered Country',
                countryData,
                undefined,
                handleCountryId.bind(this, 'registeredOfficeCountryId'),
                true
              )}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'registeredOfficeStateId',
                'Registered State',
                stateData,
                undefined,
                handleStateId.bind(this, 'registeredOfficeStateId'),
                true
              )}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('registeredOfficeCityId', 'Registered City', cityData, undefined, undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('registeredOfficePinCode', 'Registered Pincode', 'number', undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {checkBox('check', 'Same As Registered Address', handleCheck.bind(this, 'check'))}
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 3, mb: 3 }} />
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {txtBox('address', 'Address', 'text', sameAddress, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('countryId', 'Country', countryData, sameAddress, handleCountryId.bind(this, 'countryId'), true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('stateId', 'State', currentStateData, sameAddress, handleStateId.bind(this, 'stateId'), true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('cityId', 'City', currentCityData, sameAddress, undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('pinCode', 'Pincode', 'number', sameAddress, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('remarks', 'Remarks', 'text', undefined, false)}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h5">Other Details</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {txtBox('authorisedDistributor', 'Authorised Distributor / Dealer In', 'text', undefined, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('firmType', 'Firm Type', 'text', undefined, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('owner', 'MD/CEO/PROPRIETOR/PARTNER Name', 'text', undefined, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('categoryOfIndustry', 'Category Of Industry', 'text', undefined, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('gstStatusId', 'GST Application Status', gstStatusData, undefined, undefined, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('panNumber', 'PAN Number', 'text', undefined, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('PanReference', 'Name On PAN Card', 'text', undefined, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('dateOfBirth', 'Date of Birth', 'date', undefined, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('annualTurnoverOfFirstYear', 'Annual Turnover Of Year - I', 'text', undefined, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('annualTurnoverOfSecondYear', 'Annual Turnover Of Year - II', 'text', undefined, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('annualTurnoverOfThirdYear', 'Annual Turnover Of Year - III', 'text', undefined, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('bankName', 'Bank Name', 'text', undefined, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('branchName', 'Branch Name', 'text', undefined, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('accountNumber', 'Account Number', 'text', undefined, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('ifscCode', 'NEFT/IFSC/RTGS Code', 'text', undefined, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('paymentTermId', 'Payment Term', paymentData, undefined, undefined, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('currencyId', 'Currency', currnecyData, undefined, undefined, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('incotermsId', 'Incoterms', incotermsData, undefined, undefined, false)}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

CustomizedAccordion.propTypes = {
  txtBox: PropTypes.func,
  selectBox: PropTypes.func,
  checkBox: PropTypes.func,
  orgType: PropTypes.string,
  methods: PropTypes.object,
  fileFields: PropTypes.array,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  handleCheck: PropTypes.func,
  sameAddress: PropTypes.bool,
  setSameAddress: PropTypes.bool
};

export default CustomizedAccordion;
