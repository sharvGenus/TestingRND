import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Grid,
  Typography,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Box,
  TextField,
  styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import MainCard from 'components/MainCard';
import { parentOrganizationFetchers } from 'utils';

const HeaderCell = styled('th')({
  backgroundColor: 'rgb(250, 250, 251)',
  color: 'black',
  fontFamily: '"Public Sans", sans-serif',
  fontSize: '12px',
  maxWidth: '14rem',
  wordWrap: 'anywhere',
  position: 'sticky',
  top: 0,
  zIndex: '999',
  padding: 8,
  textAlign: 'left',
  fontWeight: 700,
  textTransform: 'uppercase'
});

export const BodyRow = styled('tr')(({ index }) => ({
  backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgb(245, 245, 245)'
  }
}));

const BodyCell = styled('td')(({ fontWeight }) => ({
  color: 'black',
  fontSize: '14px',
  ...(fontWeight && { fontWeight }),
  maxWidth: '14rem',
  wordWrap: 'anywhere',
  padding: 8
}));

const { getTopmostOrganization, getBranchOrganization } = parentOrganizationFetchers;

const UserSelectorSection = ({ userData, onUpdateClickHandler, initialFormData = {} }) => {
  const { roleId, organizationTypeId, organizationId } = initialFormData;
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleToggle = (user) => {
    if (selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleDeselect = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
  };

  const handleSelectAll = () => {
    if (selectedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(allUsers);
    }
  };

  const [searchedData, setSearchedData] = useState(null);

  const searchUsers = (event) => {
    const value = event?.target?.value;

    if (!value) {
      setSearchedData(null);
      return;
    }

    const searchTerm = value.toLowerCase().trim();

    setSearchedData(
      allUsers.filter((item) =>
        [item.name, item.code, item.email, item.mobileNumber, item.topmostOrganizationName, item.branchOrganziationName].some((v) =>
          (v || '').toLowerCase().includes(searchTerm)
        )
      )
    );
  };

  const onFormSubmit = () => {
    const payload = { roleId, organizationTypeId, organizationId, userId: selectedUsers.map((u) => u.id) };
    onUpdateClickHandler(payload);
  };

  const displayedUsers = Array.isArray(searchedData) ? searchedData : allUsers;

  useEffect(() => {
    if (!userData) return;

    setAllUsers(
      userData.map((u) => ({
        ...u,
        topmostOrganizationName: getTopmostOrganization(u)?.name,
        branchOrganziationName: getBranchOrganization(u)?.name
      }))
    );
  }, [userData]);

  useEffect(() => {
    setSelectedUsers(allUsers.filter((u) => u.roleId === roleId));
  }, [allUsers, roleId]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={9}>
          <MainCard>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h5" gutterBottom>
                All Users
              </Typography>
              <TextField
                disabled={!allUsers.length}
                name="search"
                placeholder="Search..."
                onChange={searchUsers}
                onBlur={(e) => (e.target.value = e.target.value.trim())}
              />
            </Box>
            <Box height={500} sx={{ overflowY: 'auto', overflowX: 'auto' }}>
              <table cellSpacing="0" style={{ minWidth: '125%' }}>
                <thead>
                  <tr>
                    <HeaderCell>
                      <Checkbox
                        disabled={!allUsers.length || Array.isArray(searchedData)}
                        checked={selectedUsers.length && selectedUsers.length === allUsers.length}
                        indeterminate={selectedUsers.length && selectedUsers.length !== allUsers.length}
                        onChange={handleSelectAll}
                        disableRipple
                      />
                    </HeaderCell>
                    <HeaderCell>Organization Name</HeaderCell>
                    <HeaderCell>Organization Branch Name</HeaderCell>
                    <HeaderCell>Name</HeaderCell>
                    <HeaderCell>Role</HeaderCell>
                    <HeaderCell>Mobile Number</HeaderCell>
                    <HeaderCell>Email</HeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {displayedUsers.length > 0 ? (
                    displayedUsers.map((user, index) => (
                      <BodyRow index={index} key={user.id}>
                        <BodyCell>
                          <Checkbox
                            checked={!!selectedUsers.find((u) => u.id === user.id)}
                            onChange={() => handleToggle(user)}
                            disableRipple
                          />
                        </BodyCell>
                        <BodyCell>{user.topmostOrganizationName}</BodyCell>
                        <BodyCell>{user.branchOrganziationName || '-'}</BodyCell>
                        <BodyCell>{user.name}</BodyCell>
                        <BodyCell fontWeight={700}>{user.role?.name}</BodyCell>
                        <BodyCell>{user.mobileNumber}</BodyCell>
                        <BodyCell>{user.email || '-'}</BodyCell>
                      </BodyRow>
                    ))
                  ) : (
                    <BodyRow></BodyRow>
                  )}
                </tbody>
              </table>
            </Box>
          </MainCard>
        </Grid>

        <Grid item xs={12} sm={12} md={3}>
          <MainCard>
            <Typography variant="h5" gutterBottom mb={2}>
              Selected Users
            </Typography>
            <Box height={515} overflow="auto">
              <List>
                {selectedUsers.length > 0 ? (
                  selectedUsers.map((user) => (
                    <ListItem key={user.id} role={undefined} dense>
                      <ListItemText primary={`${user.name} - ${user.code}`} primaryTypographyProps={{ style: { fontSize: '0.85rem' } }} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => handleDeselect(user)}>
                          <CloseIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                ) : (
                  <ListItem role={undefined} dense>
                    <Typography variant="h6" gutterBottom>
                      No Selected Users
                    </Typography>
                  </ListItem>
                )}
              </List>
            </Box>
          </MainCard>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2} alignItems={'end'} sx={{ mb: 2 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
              <Button disabled={!allUsers.length} onClick={onFormSubmit} size="small" variant="contained" color="primary">
                Update
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

UserSelectorSection.propTypes = {
  userLoading: PropTypes.bool,
  userData: PropTypes.array,
  onUpdateClickHandler: PropTypes.func,
  initialFormData: PropTypes.object
};

export default UserSelectorSection;
