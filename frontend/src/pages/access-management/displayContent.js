import { RightCircleFilled } from '@ant-design/icons';
import { Button, Grid, Switch, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import PropTypes from 'prop-types';
import { Fragment, useCallback, useEffect, useState } from 'react';
import toast from 'utils/ToastNotistack';
import request from 'utils/request';

const Toggle = ({ check, onCheck }) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(check);
  }, [check]);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    onCheck(event.target.checked);
  };

  return <Switch checked={checked} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />;
};

Toggle.propTypes = {
  check: PropTypes.bool,
  onCheck: PropTypes.func
};

const DisplayContent = ({ data, userId, roleId }) => {
  const [recvdata, setRecvData] = useState([]);
  const [recvPdata, setRecvPData] = useState([]);
  const [allDataObj, setAllDataObj] = useState({});
  const [allCheck, setAllCheck] = useState(false);

  const saveData = async () => {
    const menus = [];
    const menusObj = {};
    const allTrueData = recvdata.filter((val) => val.isAccess === true);
    allTrueData &&
      allTrueData.length > 0 &&
      allTrueData.map((val) => {
        if (!menusObj[val.id]) menusObj[val.id] = { masterId: val.id, masterRoute: val.masterRoute };
        if (val.parentId !== null && !menusObj[val.parentId])
          menusObj[val.parentId] = { masterId: val.parentId, masterRoute: allDataObj[val.parentId].masterRoute };
        if (val.grandParentId !== null && !menusObj[val.grandParentId])
          menusObj[val.grandParentId] = { masterId: val.grandParentId, masterRoute: allDataObj[val.grandParentId].masterRoute };
        if (val.greatGrandParentId !== null && !menusObj[val.greatGrandParentId])
          menusObj[val.greatGrandParentId] = {
            masterId: val.greatGrandParentId,
            masterRoute: allDataObj[val.greatGrandParentId].masterRoute
          };
      });
    Object.keys(menusObj).map((vl) => {
      menus.push(menusObj[vl]);
    });
    const payload = {
      userId: userId,
      roleId: roleId,
      menuArray: menus
    };
    const response = await request('/govern-user-menus', { method: 'POST', body: payload });
    if (response.success) {
      const successMessage = 'Rights updated successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const arrToObj = useCallback((arr, obj) => {
    arr &&
      arr.length > 0 &&
      arr.map((val) => {
        if (!obj[val.id]) obj[val.id] = val;
        if (val.child && val.child.length > 0) arrToObj(val.child, obj);
        if (val.subChild && val.subChild.length > 0) arrToObj(val.subChild, obj);
      });
    setAllDataObj(obj);
  }, []);

  const flattenData = useCallback((arr, list) => {
    arr &&
      arr.length > 0 &&
      arr.map((val) => {
        if (val.child && val.child.length > 0) {
          let newList = flattenData(val.child, list);
          list = newList;
        } else if (val.subChild && val.subChild.length > 0) {
          let newList = flattenData(val.subChild, list);
          list = newList;
        } else {
          let nval = { ...val };
          list = [...list, { ...nval }];
        }
      });
    return list;
  }, []);

  const getNameById = (id) => {
    return allDataObj[id]?.visibleName;
  };

  const checkAllTrue = (arr) => {
    let falseFound = false;
    if (arr && arr.length > 0) {
      let falseData = arr.filter((val) => val.isAccess === false);
      if (falseData && falseData.length > 0) falseFound = true;
      setAllCheck(!falseFound);
    }
  };

  const onAllChecked = (bl, recData) => {
    setRecvData([]);
    recData && recData.length > 0 && recData.map((vl) => (vl.isAccess = bl));
    setRecvData(recData);
    setAllCheck(bl);
  };

  const addGreatGrandParent = useCallback(
    (arr) => {
      let nArr = [];
      arr &&
        arr.length > 0 &&
        arr.map((vl) => {
          nArr.push({
            ...vl,
            greatGrandParentId: vl.grandParentId && vl.grandParentId !== null ? allDataObj[vl.grandParentId].parentId : null
          });
        });
      return nArr;
    },
    [allDataObj]
  );

  useEffect(() => {
    setRecvData([]);
    setRecvPData([]);
    arrToObj(data, {});
    let linearObj = flattenData(data, []);
    let filteredLinearObj = linearObj?.filter((item) => item?.name !== 'roles');
    checkAllTrue(filteredLinearObj);
    setRecvPData(filteredLinearObj);
  }, [data, flattenData, arrToObj]);

  useEffect(() => {
    if (recvPdata && recvPdata.length > 0) {
      let lineardata = addGreatGrandParent(recvPdata);
      let filteredLinearData = lineardata?.filter((item) => item?.name !== 'roles');
      setRecvData(filteredLinearData);
    }
  }, [recvPdata, addGreatGrandParent]);

  return (
    <>
      {recvdata && recvdata.length > 0 && (
        <Grid container spacing={1} mb={3}>
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            {recvdata && recvdata.length > 0 && (
              <Button variant="contained" onClick={saveData}>
                Save
              </Button>
            )}
          </Grid>
        </Grid>
      )}
      {recvdata && recvdata.length > 0 && (
        <div style={{ maxHeight: '550px', overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rights For</TableCell>
                <TableCell>
                  <Toggle
                    check={allCheck}
                    onCheck={(e) => {
                      onAllChecked(e, recvdata);
                    }}
                    sx={{ margin: 'auto' }}
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recvdata &&
                recvdata.length > 0 &&
                recvdata.map((val, ind) => (
                  <TableRow key={val.id}>
                    <TableCell>
                      <TableRow>
                        {val && val.greatGrandParentId && val.greatGrandParentId !== null && (
                          <>
                            <TableCell sx={{ pt: 1 }}>{getNameById(val.greatGrandParentId)}</TableCell>
                            <TableCell sx={{ pt: 1 }}>
                              <RightCircleFilled style={{ fontSize: 20, color: '#1890ff' }} />
                            </TableCell>{' '}
                          </>
                        )}
                        {val && val.grandParentId && val.grandParentId !== null && (
                          <>
                            <TableCell sx={{ pt: 1 }}>{getNameById(val.grandParentId)}</TableCell>
                            <TableCell sx={{ pt: 1 }}>
                              <RightCircleFilled style={{ fontSize: 20, color: '#1890ff' }} />
                            </TableCell>{' '}
                          </>
                        )}
                        {val && val.parentId && val.parentId !== null && (
                          <>
                            <TableCell sx={{ pt: 1 }}>{getNameById(val.parentId)}</TableCell>
                            <TableCell sx={{ pt: 1 }}>
                              <RightCircleFilled style={{ fontSize: 20, color: '#1890ff' }} />
                            </TableCell>{' '}
                          </>
                        )}
                        <TableCell sx={{ pt: 1 }}>{val.visibleName}</TableCell>
                      </TableRow>
                    </TableCell>
                    <TableCell>
                      <Toggle
                        check={val.isAccess}
                        onCheck={(bl) => {
                          val.isAccess = bl;
                          let newRecvData = structuredClone(recvdata);
                          newRecvData[ind] = val;
                          setRecvData(newRecvData);
                          checkAllTrue(newRecvData);
                        }}
                        sx={{ margin: 'auto' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

DisplayContent.propTypes = {
  data: PropTypes.any,
  userId: PropTypes.string,
  roleId: PropTypes.string
};

export default DisplayContent;
