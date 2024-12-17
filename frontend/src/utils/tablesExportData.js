const { formatTimeStamp, getValueByAccessor } = require('./utils');

const tableExportData = {
  getData: (sarr, columns, devolutionExport = false, normalDate = false) => {
    let newRespData = [];
    sarr &&
      sarr.length > 0 &&
      sarr.map((val) => {
        let newVal = {};
        columns &&
          columns.length > 0 &&
          columns.map((cols) => {
            if (cols.Header !== 'Actions') {
              const value = getValueByAccessor(val, cols.accessor, devolutionExport);
              const isDateHeader = ['Updated On', 'Created On', 'Submitted On'].includes(cols.Header) || cols.Header.includes('Date');
              let newValue;
              if (isDateHeader && value && value !== null && !normalDate) newValue = formatTimeStamp(value);
              else newValue = value;
              newVal[cols.Header] = newValue;
            }
          });
        newRespData.push(newVal);
      });
    return newRespData;
  }
};

export default tableExportData;
