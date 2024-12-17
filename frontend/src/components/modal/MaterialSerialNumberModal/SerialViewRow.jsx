import { Checkbox } from '@mui/material';
import PropTypes from 'prop-types';
import { memo, useEffect, useState } from 'react';
import { BodyCell, BodyRow } from './SerialInputElements';

const blueBackgroundStyles = {
  '&.MuiCheckbox-root': {
    color: 'white'
  },
  '&.MuiCheckbox-root:hover': {
    backgroundColor: 'rgba(245, 245, 245, 0.4)'
  }
};

export const CheckboxComponent = ({ checked: checkedProp, onChecked: handleCheck, blueBackground }) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(checkedProp);
  }, [checkedProp]);

  return (
    <Checkbox
      checked={!!checked}
      indeterminate={checked === 'indeterminate'}
      onChange={(e) => {
        const result = handleCheck(e.target.checked);

        if (result) {
          if (result === 'indeterminate') {
            setChecked(result);
          } else {
            setChecked(e.target.checked);
          }
        }
      }}
      sx={blueBackground ? blueBackgroundStyles : {}}
      margin="auto"
    />
  );
};

const SerialViewRow = memo(({ index, style, data }) => {
  const { originalData, showCheckboxes, selectedSerials, handleCheckboxChange } = data;

  const value = originalData[index];

  return (
    <BodyRow index={index} style={style} key={index}>
      <BodyCell width="20%">{index + 1}</BodyCell>
      <BodyCell width={showCheckboxes ? '60%' : '80%'}>{value}</BodyCell>
      {showCheckboxes && (
        <BodyCell width="20%">
          <CheckboxComponent checked={selectedSerials.includes(value)} onChecked={(event) => handleCheckboxChange(event, value)} />
        </BodyCell>
      )}
    </BodyRow>
  );
});

export const DevolutionSerialViewRow = memo(({ index, style, data }) => {
  const { originalData, showCheckboxes, selectedSerials, handleCheckboxChange } = data;

  const value = originalData[index];
  const checkOldSrNos = (sr) => {
    if (!sr?.[0]?.oldSerialNo) return sr;
    else return sr.map((v) => v.oldSerialNo);
  };

  return (
    <BodyRow index={index} style={style} key={index}>
      <BodyCell width="20%">{index + 1}</BodyCell>
      <BodyCell width={showCheckboxes ? '60%' : '80%'}>{value.oldSerialNo}</BodyCell>
      {showCheckboxes && (
        <BodyCell width="20%">
          <CheckboxComponent
            checked={checkOldSrNos(selectedSerials).includes(value.oldSerialNo)}
            onChecked={(event) => handleCheckboxChange(event, value)}
          />
        </BodyCell>
      )}
    </BodyRow>
  );
});

CheckboxComponent.propTypes = {
  blueBackground: PropTypes.bool,
  checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  onChecked: PropTypes.func
};

SerialViewRow.propTypes = {
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

DevolutionSerialViewRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  data: PropTypes.shape({
    originalData: PropTypes.any,
    selectedSerials: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any
      })
    ).isRequired,
    handleCheckboxChange: PropTypes.func,
    showCheckboxes: PropTypes.bool
  }).isRequired
};

export default SerialViewRow;
