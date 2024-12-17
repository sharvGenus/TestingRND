import { Tooltip, IconButton } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PropTypes from 'prop-types';

const Actions = ({ onEdit, onDelete }) => {
  return (
    <div>
      <Tooltip title="Edit" placement="bottom">
        <IconButton color="secondary" onClick={onEdit}>
          <EditOutlinedIcon />
        </IconButton>
      </Tooltip>

      {onDelete && (
        <Tooltip title="Delete" placement="bottom">
          <IconButton color="secondary" onClick={onDelete}>
            <DeleteOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

Actions.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

export default Actions;
