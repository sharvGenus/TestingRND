import { Box, Grid, Tab, Tabs } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import FilterData from './filterData';
import DisplayContent from './displayContent';
import DisplayMasters from './displayMasters';
import DisplayGaaNetworks from './displayGaaNetwork';
import MainCard from 'components/MainCard';
import { getRightsFor } from 'store/actions';
import { useDefaultFormAttributes } from 'pages/form-configurator/useDefaultAttributes';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number,
  index: PropTypes.number
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const AccessManagement = () => {
  const dispatch = useDispatch();
  const [showData, setShowData] = useState([]);
  const [showContents, setShowContents] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Menu');
  const [selUser, setSelUser] = useState(null);
  const [selRole, setSelRole] = useState(null);
  const [selMaster, setSelMaster] = useState(null);
  const [selStoreOrgId, selSelStoreOrgId] = useState(null);
  const [forGAA, setForGAA] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0 && selectedTab !== 'Menu') {
      setSelectedTab('Menu');
      setAllData([]);
      setShowContents(false);
    } else if (newValue === 1 && selectedTab !== 'Masters') {
      setSelectedTab('Masters');
      setAllData([]);
      setShowContents(false);
    }
  };

  useEffect(() => {
    dispatch(getRightsFor());
    setShowContents(false);
  }, [dispatch]);

  const { allRights } = useDefaultFormAttributes();
  const { rightsData } = useMemo(
    () => ({
      rightsData: allRights?.allRightsObject || []
    }),
    [allRights]
  );

  const setAllData = (values) => {
    setTimeout(() => {
      setShowData(values.data);
      setSelUser(values.userId);
      setSelRole(values.roleId);
      if (values.masterId) setSelMaster(values.masterId);
      if (values.storesOrgType) selSelStoreOrgId(values.storesOrgType);
      setShowContents(true);
      if (values && values.forGAA) {
        setShowData(values.data);
        setSelectedProject(values.projectId);
        setForGAA(true);
      } else {
        setSelectedProject(null);
        setForGAA(false);
      }
    }, 200);
  };

  const filterSection = (
    <>
      <MainCard title={''}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            {selectedTab !== '' && (
              <FilterData
                rightsFor={selectedTab}
                rightsData={rightsData?.filter(
                  (item) => item?.id !== 'd4dc5b2c-8c9c-4bd9-93e3-f9f3d42f5cc7' && item?.name !== 'GAA & Network'
                )}
                setAllData={setAllData}
                resetTable={setShowData}
              />
            )}
          </Grid>
        </Grid>
      </MainCard>
    </>
  );

  const tabsData = (
    <MainCard title={''}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          {showContents && selectedTab === 'Menu' ? (
            <DisplayContent data={showData || []} userId={selUser} roleId={selRole} />
          ) : showContents && selectedTab === 'Masters' && !forGAA ? (
            <DisplayMasters data={showData || []} userId={selUser} masterId={selMaster} roleId={selRole} storeOrgId={selStoreOrgId} />
          ) : showContents && selectedTab === 'Masters' && forGAA ? (
            <DisplayGaaNetworks data={showData || []} userId={selUser} masterId={selMaster} projectId={selectedProject} roleId={selRole} />
          ) : (
            // <></>
            <></>
          )}
        </Grid>
      </Grid>
    </MainCard>
  );

  return (
    <Grid container spacing={1}>
      {/* <Grid item xs={12}>
        <Typography variant="h4">Access Management</Typography>
      </Grid> */}
      <Grid item xs={12}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Menu" {...a11yProps(0)} />
              <Tab label="Masters" {...a11yProps(1)} />
            </Tabs>
          </Box>
          {filterSection}
          <TabPanel value={value} index={0}>
            {tabsData}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {tabsData}
          </TabPanel>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AccessManagement;
