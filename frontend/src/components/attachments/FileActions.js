import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import TranslucentButton from 'components/transactions-report/buttons/TranslucentButton';
import SmallIconButton from 'components/transactions-report/buttons/SmallIconButton';

const FileActions = ({ onDownload, onDelete, onUndo, flaggedForDeletion, update }) => {
  return (
    <Box>
      {flaggedForDeletion ? (
        <Tooltip title="Undo Delete" placement="top">
          <TranslucentButton onClick={onUndo}>
            <SmallIconButton>
              <UndoOutlinedIcon />
            </SmallIconButton>
          </TranslucentButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip title="Download" placement="top">
            <TranslucentButton onClick={onDownload}>
              <SmallIconButton>
                <FileDownloadOutlinedIcon />
              </SmallIconButton>
            </TranslucentButton>
          </Tooltip>
          {update && (
            <Tooltip title="Delete" placement="top">
              <TranslucentButton onClick={onDelete}>
                <SmallIconButton>
                  <DeleteOutlinedIcon />
                </SmallIconButton>
              </TranslucentButton>
            </Tooltip>
          )}
        </>
      )}
    </Box>
  );
};

FileActions.propTypes = {
  onDownload: PropTypes.func,
  onDelete: PropTypes.func,
  onUndo: PropTypes.func,
  flaggedForDeletion: PropTypes.bool,
  update: PropTypes.bool
};

export default FileActions;
