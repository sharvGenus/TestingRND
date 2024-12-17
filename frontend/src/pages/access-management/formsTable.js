import { Grid, IconButton, Modal, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import TableForm from 'tables/table';
import MainCard from 'components/MainCard';
import { getFormWithUsers } from 'store/actions';
import { useFormResponses } from 'pages/form-configurator/responses/useFormResponses';
import request from 'utils/request';
import CircularLoader from 'components/CircularLoader';
import toast from 'utils/ToastNotistack';

const Actions = ({ values, deleteAndAddAccess, obj, onAction }) => {
  const [actionVal, setActionVal] = useState(null);
  const [actionObj, setActionObj] = useState(null);
  useEffect(() => {
    setActionVal(values);
  }, [values]);
  useEffect(() => {
    setActionObj(obj);
  }, [obj]);

  return (
    <div>
      {/* {deleteAndAddAccess && (
        <Tooltip title="Add" placement="bottom">
          <IconButton color={values.add ? 'primary' : 'secondary'} sx={{ fontSize: 18 }} onClick={() => {}}>
            <PlusOutlined />
          </IconButton>
        </Tooltip>
      )} */}
      <Tooltip title="View" placement="bottom">
        {actionObj === 'l1all' || actionObj === 'l2all' ? (
          <IconButton
            color={actionVal?.view ? 'primary' : 'secondary'}
            onClick={() => {
              onAction('view');
            }}
          >
            <VisibilityIcon sx={{ fontSize: 18 }} />
          </IconButton>
        ) : (actionObj && actionObj.view) || actionObj === 'all' ? (
          <IconButton
            color={actionVal?.view ? 'primary' : 'secondary'}
            onClick={() => {
              onAction('view');
            }}
          >
            <VisibilityIcon sx={{ fontSize: 18 }} />
          </IconButton>
        ) : (
          <IconButton color={actionVal?.view ? 'primary' : 'secondary'}>
            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Tooltip>
      <Tooltip title="Edit" placement="bottom">
        {actionObj === 'l1all' || actionObj === 'l2all' ? (
          <IconButton
            color={actionVal?.update ? 'primary' : 'secondary'}
            onClick={() => {
              onAction('update');
            }}
          >
            <EditIcon sx={{ fontSize: 18 }} />
          </IconButton>
        ) : (actionObj && actionObj.update) || actionObj === 'all' ? (
          <IconButton
            color={actionVal?.update ? 'primary' : 'secondary'}
            onClick={() => {
              onAction('update');
            }}
          >
            <EditIcon sx={{ fontSize: 18 }} />
          </IconButton>
        ) : (
          <IconButton color={actionVal?.update ? 'primary' : 'secondary'}>
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Tooltip>
      {deleteAndAddAccess && (
        <Tooltip title="Delete" placement="bottom">
          {actionObj === 'l1all' || actionObj === 'l2all' ? (
            <IconButton
              color={actionVal?.deleteRecord ? 'primary' : 'secondary'}
              onClick={() => {
                onAction('deleteRecord');
              }}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          ) : (actionObj && actionObj.deleteRecord) || actionObj === 'all' ? (
            <IconButton
              color={actionVal?.deleteRecord ? 'primary' : 'secondary'}
              onClick={() => {
                onAction('deleteRecord');
              }}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          ) : (
            <IconButton color={actionVal?.deleteRecord ? 'primary' : 'secondary'}>
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Tooltip>
      )}
    </div>
  );
};

Actions.propTypes = {
  values: PropTypes.any,
  deleteAndAddAccess: PropTypes.bool,
  obj: PropTypes.any,
  onAction: PropTypes.func
};
const FormsTable = ({ details, name, id }) => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [checkUser, setCheckUser] = useState(false);
  const [userTableName, setUserTableName] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const [pending, setPending] = useState(false);
  const { pathname } = useLocation();
  const extraL1s = useCallback(() => ['is_resurvey', 'resurveyor_org_type', 'resurveyor_org_id', 'resurvey_by'], []);

  const makeRequest = async (stage, keyValue, formId, rId, userId, columnId, exIds, ids, isL1L2 = false) => {
    let rsp = {};
    if (stage === 'stage1')
      rsp = await request('/update-role-default-permissions', {
        method: 'PUT',
        body: { formId, roleId: rId, isL1L2, notColumnId: exIds, addColumnId: ids, ...keyValue }
      });
    else if (stage === 'stage2')
      rsp = await request('/update-role-column-permissions', {
        method: 'PUT',
        body: { formId, roleId: rId, columnId, ...keyValue }
      });
    else if (stage === 'stage3')
      rsp = await request('/update-user-default-permissions', {
        method: 'PUT',
        body: { formId, roleId: rId, userId, isL1L2, notColumnId: exIds, addColumnId: ids, ...keyValue }
      });
    else if (stage === 'stage4')
      rsp = await request('/update-user-column-permissions', {
        method: 'PUT',
        body: { formId, roleId: rId, userId, columnId, ...keyValue }
      });
    if (rsp) {
      if (rsp.success) return true;
      else return false;
    }
  };

  const approverObj = (arr) => {
    return {
      view: arr && arr.length > 0 && arr.some((v) => v?.view === true),
      update: arr && arr.length > 0 && arr.some((v) => v?.update === true)
    };
  };

  const onAction = (key, obj, userId, formId, rId, values, exIds, ids, colIds, onForm = true) => {
    let resp = false;
    let valKey = onForm ? !values[key] : !approverObj(values[obj === 'l1all' ? 'l1' : 'l2'])[key];
    if (obj !== 'all' && obj !== 'l1all' && obj !== 'l2all' && userId !== null)
      resp = makeRequest('stage4', { [key]: !values[key] }, formId, rId, userId, values?.form_attribute?.id, exIds, ids);
    else if (obj !== 'all' && obj !== 'l1all' && obj !== 'l2all' && userId === null)
      resp = makeRequest('stage2', { [key]: !values[key] }, formId, rId, userId, values?.form_attribute?.id, exIds, ids);
    else if ((obj === 'all' || obj === 'l1all' || obj === 'l2all') && userId !== null) {
      resp = makeRequest('stage3', { [key]: valKey }, formId, rId, userId, null, exIds, ids, obj === 'l1all' || obj === 'l2all');
    } else {
      if ((obj === 'l1all' || obj === 'l2all') && valKey && key === 'update')
        makeRequest(
          'stage1',
          { [key]: !valKey },
          formId,
          rId,
          userId,
          null,
          obj === 'l1all' ? [...colIds.formsCols, ...colIds.l1] : [...colIds.formsCols, ...colIds.l2],
          obj === 'l1all' ? colIds.l2 : colIds.l1,
          obj === 'l1all' || obj === 'l2all'
        );
      resp = makeRequest('stage1', { [key]: valKey }, formId, rId, userId, null, exIds, ids, obj === 'l1all' || obj === 'l2all');
    }
    if (resp) {
      let newVal = { ...values };
      if (onForm) newVal[key] = !values[key];
      return newVal;
    }
  };

  const getHeader = (detail, forField, showUsers) => {
    let L1Check = detail && detail.length > 0 && detail[0] && detail[0].l1 && detail[0].l1.length > 0;
    let L2Check = detail && detail.length > 0 && detail[0] && detail[0].l2 && detail[0].l2.length > 0;
    let Headers = showUsers
      ? [
          {
            Header: ' ',
            accessor: 'userIcon',
            className: 'userIcon'
          }
        ]
      : [];
    Headers = [
      ...Headers,
      {
        Header: forField,
        accessor: showUsers ? 'role.name' : 'user.name'
      }
    ];
    if (L1Check)
      Headers = [
        ...Headers,
        {
          Header: 'L1',
          accessor: 'l1Actions'
        }
      ];
    if (L2Check)
      Headers = [
        ...Headers,
        {
          Header: 'L2',
          accessor: 'l2Actions'
        }
      ];
    Headers = [
      ...Headers,
      {
        Header: 'Forms Columns',
        accessor: 'actions',
        className: 'cell-center'
      }
    ];
    if (detail && detail.length > 0) {
      let columnSet = detail[0].formsCols;
      columnSet &&
        columnSet.length > 0 &&
        columnSet.map((val, index) => {
          Headers = [
            ...Headers,
            {
              Header: val?.form_attribute?.name,
              accessor: `formsCols[${index}].actions`,
              className: 'cell-center'
            }
          ];
        });
      return Headers;
    } else return [];
  };

  const { formWithUsers } = useFormResponses();

  const { formsData } = useMemo(
    () => ({
      formsData: formWithUsers.formsObject || [],
      count: formWithUsers.formsObject?.count || 0,
      isLoading: formWithUsers.loading || false
    }),
    [formWithUsers]
  );

  const getUpdatedObj = useCallback(
    (obj, key) => {
      return obj.map((dt) => {
        return {
          ...dt,
          l1:
            dt[key] &&
            dt[key].length > 0 &&
            dt[key].filter(
              (vl) => vl?.form_attribute?.columnName?.startsWith('l_a') || extraL1s().includes(vl?.form_attribute?.columnName)
            ),
          l2: dt[key] && dt[key].length > 0 && dt[key].filter((vl) => vl?.form_attribute?.columnName?.startsWith('l_b')),
          formsCols:
            dt[key] &&
            dt[key].length > 0 &&
            dt[key].filter(
              (vl) =>
                !vl?.form_attribute?.columnName?.startsWith('l_a') &&
                !extraL1s().includes(vl?.form_attribute?.columnName) &&
                !vl?.form_attribute?.columnName?.startsWith('l_b')
            )
        };
      });
    },
    [extraL1s]
  );

  useEffect(() => {
    setPending(true);
    if (details && Array.isArray(details)) {
      setPending(false);
      let allData = getUpdatedObj(details, 'role_column_wise_permissions');
      setRolesData(allData);
    }
  }, [details, getUpdatedObj]);

  useEffect(() => {
    if (formsData && Array.isArray(formsData)) {
      setPending(false);
      let allData = getUpdatedObj(formsData, 'user_column_wise_permissions');
      setFormDetails(allData);
    }
  }, [formsData, getUpdatedObj]);

  useEffect(() => {
    if (formDetails && checkUser) {
      setOpenModal(true);
    }
  }, [formDetails, checkUser]);

  const getIdsArr = (arr) => {
    return arr && arr.length > 0 && arr.map((vl) => vl?.form_attribute?.id);
  };

  const updateValues = (vl, showUsers) => {
    let newData = [];
    if (showUsers) {
      [...rolesData].map((val) => {
        if (val.id === vl.id) val = { ...vl };
        newData.push(val);
      });
      setRolesData(newData);
    } else {
      [...formDetails].map((val) => {
        if (val.id === vl.id) val = { ...vl };
        newData.push(val);
      });
      setFormDetails(newData);
    }
  };

  const addColsActions = (arr, obj, key, showUsers, formId, role, user) => {
    const list =
      arr &&
      arr.length > 0 &&
      arr.map((val, index) => ({
        ...val,
        actions: (
          <Actions
            values={val}
            deleteAndAddAccess={false}
            obj={obj}
            onAction={(ky) => {
              let newObj = { ...obj };
              newObj[key][index] = onAction(ky, obj, user, formId, role, val, [], [], {});
              updateValues(newObj, showUsers);
            }}
          />
        )
      }));
    return list;
  };

  const updateAllChilds = (obj, field, key, forLA = false) => {
    let objArr = obj?.[field];
    return {
      ...obj,
      [field]:
        objArr &&
        objArr.length > 0 &&
        objArr.map((v) => {
          return {
            ...v,
            [key]: forLA ? !v?.[key] : obj?.[key]
          };
        })
    };
  };

  const addActions = (type, showUsers) => {
    let newArr = type === 'rolesData' ? rolesData : formDetails;
    const list =
      newArr &&
      newArr.length > 0 &&
      newArr.map((val) => ({
        ...val,
        userIcon: (
          <Tooltip title="Users" placement="bottom">
            <IconButton
              color={'secondary'}
              sx={{ fontSize: 20, marginLeft: -1, cursor: 'pointer' }}
              onClick={() => {
                if (showUsers) {
                  setPending(true);
                  dispatch(getFormWithUsers({ formId: id, roleId: val?.role?.id }));
                  setUserTableName(val?.role?.name);
                  setRoleId(val?.role?.id);
                  setCheckUser(true);
                  //   setUserTableId(val.id);
                }
              }}
            >
              <UserOutlined />
            </IconButton>
          </Tooltip>
        ),
        l1Actions: (
          <Actions
            values={approverObj(val?.l1)}
            deleteAndAddAccess={false}
            obj={'l1all'} // need to update
            onAction={(ky) => {
              if (approverObj(val?.l2)[ky] && !approverObj(val?.l1)[ky] && ky === 'update') {
                toast('Only one level of approver (either L1 or L2) can be enabled at a time.', { variant: 'error' });
              } else {
                let updatedValues = onAction(
                  ky,
                  'l1all',
                  showUsers ? null : val?.user?.id,
                  id,
                  showUsers ? val?.role?.id : roleId,
                  val,
                  getIdsArr([...val.formsCols, ...val.l2]),
                  getIdsArr([...val.l1]),
                  { formsCols: getIdsArr([...val.formsCols]), l1: getIdsArr([...val.l1]), l2: getIdsArr([...val.l2]) },
                  false
                );
                updateValues(updateAllChilds({ ...updatedValues }, 'l1', ky, true), showUsers);
              }
            }}
          />
        ),
        l2Actions: (
          <Actions
            values={approverObj(val?.l2)}
            deleteAndAddAccess={false}
            obj={'l2all'} // need to update
            onAction={(ky) => {
              if (approverObj(val?.l1)[ky] && !approverObj(val?.l2)[ky] && ky === 'update') {
                toast('Only one level of approver (either L1 or L2) can be enabled at a time.', { variant: 'error' });
              } else {
                let updatedValues = onAction(
                  ky,
                  'l2all',
                  showUsers ? null : val?.user?.id,
                  id,
                  showUsers ? val?.role?.id : roleId,
                  val,
                  getIdsArr([...val.l1, ...val.formsCols]),
                  getIdsArr([...val.l2]),
                  { formsCols: getIdsArr([...val.formsCols]), l1: getIdsArr([...val.l1]), l2: getIdsArr([...val.l2]) },
                  false
                );
                updateValues(updateAllChilds({ ...updatedValues }, 'l2', ky, true), showUsers);
              }
            }}
          />
        ),
        actions: (
          <Actions
            values={val}
            deleteAndAddAccess={true}
            obj={'all'}
            onAction={(ky) => {
              let updatedValues = onAction(
                ky,
                'all',
                showUsers ? null : val?.user?.id,
                id,
                showUsers ? val?.role?.id : roleId,
                val,
                getIdsArr([...val.l1, ...val.l2]),
                getIdsArr([...val.formsCols]),
                {}
              );
              updateValues(updateAllChilds({ ...updatedValues }, 'formsCols', ky), showUsers);
            }}
          />
        ),
        formsCols: addColsActions(
          val.formsCols,
          val,
          'formsCols',
          showUsers,
          id,
          showUsers ? val?.role?.id : roleId,
          showUsers ? null : val?.user?.id
        )
      }));
    return list;
  };

  const onClose = () => {
    setOpenModal(false);
    setFormDetails([]);
    setCheckUser(false);
  };

  const closeCss = { cursor: 'pointer', fontSize: 20 };

  useEffect(() => {
    setRolesData([]);
    setFormDetails([]);
  }, [pathname]);

  return (
    <>
      {pending && <CircularLoader />}
      {rolesData && (
        <TableForm
          title={name}
          accessTableOnly
          hideActions
          hideExportButton
          hideAddButton
          hidePagination
          forColumnAccess={true}
          data={addActions('rolesData', true) || []}
          count={rolesData.length || 0}
          columns={getHeader(rolesData, 'Role', true)}
        />
      )}
      <Modal open={openModal} onClose={onClose} aria-labelledby="modal-modal-title">
        <MainCard sx={{ width: 1020 }} modal darkTitle content={false}>
          <Grid container spacing={2} alignItems={'center'} sx={{ mt: -1, mb: -1 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
              <CloseCircleOutlined onClick={onClose} style={closeCss} />
            </Grid>
          </Grid>
          <div>
            {formDetails && (
              <TableForm
                title={userTableName}
                accessTableOnly
                hideActions
                hideExportButton
                hideAddButton
                hidePagination
                forColumnAccess={true}
                data={addActions('formDetails', false) || []}
                count={formDetails.length || 0}
                columns={getHeader(formDetails, 'Users', false)}
              />
            )}
          </div>
        </MainCard>
      </Modal>
    </>
  );
};

FormsTable.propTypes = {
  details: PropTypes.array,
  name: PropTypes.string,
  id: PropTypes.string
};

export default FormsTable;
