import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { memo } from 'react';
import { BodyCell, BodyRow } from './SerialInputElements';

const SelectedSerialViewRow = memo(({ index, style, data }) => {
  const { showCheckboxes, selectedSerials, handleCheckboxChange } = data;

  const value = selectedSerials[index];

  return (
    <BodyRow index={index} style={style} key={index}>
      <BodyCell width="20%">{index + 1}</BodyCell>
      <BodyCell width={showCheckboxes ? '60%' : '80%'}>{value}</BodyCell>
      {showCheckboxes && (
        <BodyCell width="20%">
          <CloseIcon
            style={{ cursor: 'pointer' }}
            onClick={() => {
              handleCheckboxChange(false, value);
            }}
          />
        </BodyCell>
      )}
    </BodyRow>
  );
});

SelectedSerialViewRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  data: PropTypes.shape({
    originalData: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any
      })
    ).isRequired,
    selectedSerials: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any
      })
    ).isRequired,
    handleCheckboxChange: PropTypes.func,
    showCheckboxes: PropTypes.bool
  }).isRequired
};

export const DevolutionSelectedSerialViewRow = memo(({ index, style, data }) => {
  const { showCheckboxes, selectedSerials, handleCheckboxChange } = data;

  const value = selectedSerials[index];

  return (
    <BodyRow index={index} style={style} key={index}>
      <BodyCell width="20%">{index + 1}</BodyCell>
      <BodyCell width={showCheckboxes ? '60%' : '80%'}>{value.oldSerialNo}</BodyCell>
      {showCheckboxes && (
        <BodyCell width="20%">
          <CloseIcon
            style={{ cursor: 'pointer' }}
            onClick={() => {
              handleCheckboxChange(false, value);
            }}
          />
        </BodyCell>
      )}
    </BodyRow>
  );
});

DevolutionSelectedSerialViewRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  data: PropTypes.shape({
    originalData: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any
      })
    ).isRequired,
    selectedSerials: PropTypes.any,
    handleCheckboxChange: PropTypes.func,
    showCheckboxes: PropTypes.bool
  }).isRequired
};

export const DevolutionRejectedSerialViewRow = memo(({ index, style, data }) => {
  const { showCheckboxes, rejectedSerials } = data;

  const value = rejectedSerials[index];

  return (
    <BodyRow index={index} style={style} key={index}>
      <BodyCell width="20%">{index + 1}</BodyCell>
      <BodyCell width={showCheckboxes ? '60%' : '80%'}>{value.oldSerialNo}</BodyCell>
      {/* {showCheckboxes && (
        <BodyCell width="20%">
          <CloseIcon
            style={{ cursor: 'pointer' }}
            onClick={() => {
              handleCheckboxChange(false, value);
            }}
          />
        </BodyCell>
      )} */}
    </BodyRow>
  );
});

DevolutionRejectedSerialViewRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  data: PropTypes.shape({
    originalData: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any
      })
    ).isRequired,
    rejectedSerials: PropTypes.any,
    handleCheckboxChange: PropTypes.func,
    showCheckboxes: PropTypes.bool
  }).isRequired
};

export default SelectedSerialViewRow;
