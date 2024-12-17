/* eslint-disable no-unused-vars */
import {
  DeleteFilled,
  DeleteOutlined,
  EditFilled,
  EditOutlined,
  EyeFilled,
  EyeOutlined,
  InfoCircleFilled,
  InfoCircleOutlined,
  PlusCircleFilled,
  PlusCircleOutlined
} from '@ant-design/icons';
import ReplyIcon from '@mui/icons-material/Reply';
import { IconButton, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const HandleActions = ({ icon1, icon2, selectedAction, handleAction }) => {
  const [action, setAction] = useState(selectedAction ? selectedAction : false);
  const onChange = () => {
    let actn = action;
    setAction(!actn);
    handleAction(!actn);
  };

  return (
    <IconButton color="secondary" onClick={onChange}>
      {action ? icon1 : icon2}
    </IconButton>
  );
};

HandleActions.propTypes = {
  icon1: PropTypes.any,
  icon2: PropTypes.any,
  selectedAction: PropTypes.bool,
  handleAction: PropTypes.func
};

export const Actions = ({ values, onSelectedActions }) => {
  const [selectAction, setSelectActions] = useState({});

  useEffect(() => {
    const allValues = values;
    if (allValues && allValues.selectedActions) {
      setSelectActions(allValues.selectedActions);
    }
  }, [values]);

  return (
    <div>
      <Tooltip title="View" placement="bottom">
        <HandleActions
          icon1={<EyeFilled style={{ fontSize: 22 }} />}
          icon2={<EyeOutlined style={{ fontSize: 22 }} />}
          selectedAction={selectAction?.view ? selectAction?.view : false}
          handleAction={(vl) => {
            onSelectedActions({ ...selectAction, view: vl });
          }}
        />
      </Tooltip>
      <Tooltip title="Edit" placement="bottom">
        <HandleActions
          icon1={<EditFilled style={{ fontSize: 22 }} />}
          icon2={<EditOutlined style={{ fontSize: 22 }} />}
          selectedAction={selectAction?.edit ? selectAction?.edit : false}
          handleAction={(vl) => {
            onSelectedActions({ ...selectAction, edit: vl });
          }}
        />
      </Tooltip>
      <Tooltip title="Delete" placement="bottom">
        <HandleActions
          icon1={<DeleteFilled style={{ fontSize: 22 }} />}
          icon2={<DeleteOutlined style={{ fontSize: 22 }} />}
          selectedAction={selectAction?.delete ? selectAction?.delete : false}
          handleAction={(vl) => {
            onSelectedActions({ ...selectAction, delete: vl });
          }}
        />
      </Tooltip>
      <Tooltip title="Add" placement="bottom">
        <HandleActions
          icon1={<PlusCircleFilled style={{ fontSize: 22 }} />}
          icon2={<PlusCircleOutlined style={{ fontSize: 22 }} />}
          selectedAction={selectAction?.add ? selectAction?.add : false}
          handleAction={(vl) => {
            onSelectedActions({ ...selectAction, add: vl });
          }}
        />
      </Tooltip>
      <Tooltip title="History" placement="bottom">
        <HandleActions
          icon1={<InfoCircleFilled style={{ fontSize: 22 }} />}
          icon2={<InfoCircleOutlined style={{ fontSize: 22 }} />}
          selectedAction={selectAction?.history ? selectAction?.history : false}
          handleAction={(vl) => {
            onSelectedActions({ ...selectAction, history: vl });
          }}
        />
      </Tooltip>
    </div>
  );
};

Actions.propTypes = {
  values: PropTypes.any,
  onSelectedActions: PropTypes.func,
  hideView: PropTypes.bool,
  hideEdit: PropTypes.bool,
  hideDelete: PropTypes.bool,
  hideAdd: PropTypes.bool,
  hideHistory: PropTypes.bool
};

export const SendTo = ({ values, onSend }) => {
  const handleAction = () => {
    onSend(values);
  };

  return (
    <div>
      <Tooltip title="show" placement="bottom">
        <IconButton color="secondary" onClick={() => handleAction()}>
          <ReplyIcon sx={{ transform: 'scaleX(-1)' }} style={{ fontSize: 30 }} />
        </IconButton>
      </Tooltip>
    </div>
  );
};

SendTo.propTypes = {
  values: PropTypes.any,
  onSend: PropTypes.func
};
