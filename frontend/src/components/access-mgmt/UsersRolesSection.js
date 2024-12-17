import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { FormControl, Grid, MenuItem, Modal, Select, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { Headers } from './headers';
import { FormProvider } from 'hook-form';
import MainCard from 'components/MainCard';
import { useUsers } from 'pages/extra-pages/users/useUsers';
import { getUsersSecond } from 'store/actions';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';

const SelectBox = ({ label, value, menus, onChange }) => {
  const [val, setVal] = useState('');
  useEffect(() => {
    setVal(value);
  }, [value]);

  const onSelectedValue = (e) => {
    setVal(e?.target?.value);
    onChange(e?.target?.value);
  };

  return (
    <FormControl sx={{ m: 1 }} fullWidth>
      <Typography mb={2}>{label}</Typography>
      <Select value={val} onChange={onSelectedValue} inputProps={{ 'aria-label': 'Without label' }}>
        {menus &&
          menus.length > 0 &&
          menus.map((v) => (
            <MenuItem key={v.id} value={v.id}>
              {v.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

SelectBox.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  menus: PropTypes.array,
  onChange: PropTypes.func
};

const UsersRolesSection = ({ userData, roleData }) => {
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();
  const [userId, setUserId] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [userModal, setUserModal] = useState(false);
  const [selectedRecord, setSelectedRecords] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(Yup.object().shape({})),
    defaultValues: {},
    mode: 'all'
  });

  const { usersSecond } = useUsers();
  const { userDataByRole, count } = useMemo(
    () => ({
      userDataByRole: usersSecond.usersObject?.rows || [],
      count: usersSecond.usersObject?.count || 0,
      isLoading: usersSecond.loading || false
    }),
    [usersSecond]
  );

  const closeCss = { cursor: 'pointer', fontSize: 20 };

  const onUserSelected = (id) => {
    setUserId(id);
    setRoleId(null);
  };

  const onRoleSelected = (id) => {
    setUserId(null);
    setRoleId(id);
    dispatch(getUsersSecond({ roleId: id, all: true }));
  };

  const checkUser = () => {
    setUserModal(true);
  };

  const handleClose = () => {
    setUserModal(false);
  };

  return (
    <>
      <FormProvider methods={methods}>
        <Grid container spacing={4} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <SelectBox label="Select User" value={userId} menus={userData} onChange={onUserSelected} />
          </Grid>
          <Grid item xs={4}>
            <SelectBox label="Select Role" value={roleId} menus={roleData} onChange={onRoleSelected} />
          </Grid>
          {roleId && (
            <Grid item xs={4} mt={6}>
              <Typography onClick={checkUser} sx={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline', fontSize: '12' }}>
                Check Users
              </Typography>
            </Grid>
          )}
        </Grid>
      </FormProvider>
      <Modal open={userModal} onClose={handleClose} aria-labelledby="modal-modal-title">
        <MainCard sx={{ width: 1150 }} modal darkTitle content={false}>
          <Grid container spacing={2} alignItems={'center'} sx={{ mt: 0 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
              <CloseCircleOutlined onClick={handleClose} style={closeCss} />
            </Grid>
          </Grid>
          <TableForm
            title="Users"
            data={userDataByRole}
            columns={Headers}
            count={count}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            pageSize={pageSize}
            hideActions
            hideExportButton
            hideAddButton
            showCheckbox
            selectedRecord={selectedRecord}
            setSelectedRecords={setSelectedRecords}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
          />
        </MainCard>
      </Modal>
    </>
  );
};

UsersRolesSection.propTypes = {
  userData: PropTypes.array,
  roleData: PropTypes.array
};

export default UsersRolesSection;
