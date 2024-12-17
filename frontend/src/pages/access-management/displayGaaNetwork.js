import { DownOutlined, RightOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { Button, Grid, Switch, Typography, styled } from '@mui/material';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';

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

const StyleAction = styled('div')(() => ({
  marginLeft: -10,
  paddingLeft: 10,
  paddingTop: 5,
  paddingBottom: 5,
  cursor: 'pointer',
  ':hover': {
    background: 'rgba(0, 0, 0, 0.06)',
    borderRadius: 5
  }
}));

const Actions = ({ setShowHide, level, val }) => {
  const [show, setShow] = useState(false);

  const handleShow = (bl) => {
    setShow(bl);
    setShowHide(bl);
  };
  return (
    <StyleAction
      style={{ marginTop: 5 }}
      onClick={() => {
        handleShow(!show);
      }}
    >
      <Grid container spacing={1} pl={0.1} pt={0.3} pb={0.3}>
        {level > 0 && (
          <Grid item xs={0.2 * level}>
            &nbsp;&nbsp;
          </Grid>
        )}
        <Grid item xs={0.2}>
          {val && val.child && val.child.length > 0 && <>{show ? <DownOutlined /> : <RightOutlined />}</>}
        </Grid>
        <Grid item>
          <Typography>{val.name}</Typography>
        </Grid>
      </Grid>
    </StyleAction>
  );
};

Actions.propTypes = {
  setShowHide: PropTypes.func,
  val: PropTypes.any,
  level: PropTypes.number
};

const DisplayGaaNetworks = ({ data, userId, roleId, projectId, masterId }) => {
  const [linearArray, setLinearArray] = useState([]);
  const [parentId, setParentId] = useState([null]);

  const fetchActive = () => {
    let arr = linearArray.filter((v) => v.isAccess === true);
    let respArr = [];
    arr &&
      arr.length &&
      arr.map((val) => {
        respArr.push({
          id: val.id,
          isAccess: val.isAccess,
          ...(val.isAll && { isAll: val.isAll })
        });
      });
    return respArr;
  };

  const saveData = async () => {
    const payload = {
      userId: userId,
      roleId: roleId,
      projectId: projectId,
      masterId: masterId
    };
    payload['lovArray'] = fetchActive();
    const response = await request('/govern-user-rows', { method: 'POST', body: payload });
    if (response.success) {
      const successMessage = 'Rights updated successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const makeLinearArray = useCallback((arr, lvl, parent, larr) => {
    arr &&
      arr.length > 0 &&
      arr.map((val) => {
        larr.push({ ...val, level: lvl, parentId: parent });
        setLinearArray(larr);
        if (val.child && val.child.length > 0) makeLinearArray(val.child, lvl + 1, val.id, larr);
      });
    return larr;
  }, []);

  const getChildIds = (val, resp) => {
    let allResp = resp;
    val.child &&
      val.child.length > 0 &&
      val.child.map((vl) => {
        allResp.push(vl.id);
        getChildIds(vl, allResp);
      });
    return allResp;
  };

  const getParentIds = (val, resp, access) => {
    let allResp = resp;
    // let allChildOfParents = linearArray.filter((vl) => vl?.parentId === val?.parentId && vl.id !== val.id);
    // let activeChilds = allChildOfParents.filter((vl) => vl.isAccess === true);
    if (access) {
      allResp.push(val?.parentId);
      let parentDetails = linearArray.filter((vl) => vl?.id === val?.parentId);
      parentDetails && parentDetails.length > 0 && getParentIds(parentDetails[0], allResp, true);
    }
    return allResp.filter((vl) => vl !== null);
  };

  const checkParentAndChild = (val) => {
    let allChildIds = getChildIds(val, []);
    let allParentIds = getParentIds(val, [], val.isAccess);
    let nLinearArray = [...linearArray];
    nLinearArray.map((vl) => {
      if (allChildIds.includes(vl.id)) vl.isAccess = val.isAccess;
      if (allParentIds.includes(vl.id) && val.isAccess) {
        vl.isAccess = val.isAccess;
        vl.isAll = val.isAccess;
      }
    });
    setLinearArray(nLinearArray);
  };

  useEffect(() => {
    let lrr = makeLinearArray(data, 0, null, []);
    setLinearArray(lrr);
  }, [data, makeLinearArray]);

  return (
    <>
      {linearArray && linearArray.length > 0 && (
        <Grid container spacing={1} mb={3}>
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            {linearArray && linearArray.length > 0 && (
              <Button variant="contained" onClick={saveData}>
                Save
              </Button>
            )}
          </Grid>
        </Grid>
      )}
      {linearArray &&
        linearArray.length > 0 &&
        linearArray.map((val) => (
          <>
            {parentId.includes(val.parentId) && (
              <Grid container spacing={1}>
                <Grid item xs={11}>
                  <Actions
                    val={val}
                    level={val.level}
                    setShowHide={(bl) => {
                      let allChilds = getChildIds(val, []);
                      if (bl) {
                        setParentId(parentId.concat(val.id));
                      } else {
                        let newParentId = parentId.filter((lvl) => lvl !== val.id && !allChilds.includes(lvl));
                        setParentId(newParentId);
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={1}>
                  <Toggle
                    check={val.isAccess}
                    onCheck={(bl) => {
                      val.isAccess = bl;
                      checkParentAndChild(val);
                    }}
                  />
                </Grid>
              </Grid>
            )}
          </>
        ))}
    </>
  );
};

DisplayGaaNetworks.propTypes = {
  data: PropTypes.any,
  userId: PropTypes.string,
  roleId: PropTypes.string,
  masterId: PropTypes.string,
  projectId: PropTypes.string
};

export default DisplayGaaNetworks;
