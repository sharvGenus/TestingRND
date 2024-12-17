import { GetDateFormat } from 'utils';

const mainHeadingBgColor = '#1890FF';
const chartHeadingBgColor = '#1F4E78';
const planVsAcutualHeadingBgColor = '#9BC2E6';

const toFixedValue = (value, places = 2) => parseFloat(parseFloat(value).toFixed(places));
const formatValue = (value) => {
  if (!isNaN(value)) {
    return toFixedValue(value);
  }
  return value;
};
const formatObjectValues = (obj) => Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, formatValue(value)]));

function transformContractorSummaryMainTable(data) {
  return {
    data: data.map((item) => ({
      nameOfContractor: item['Name Of Contractor'],
      totalTeam: item['Total Team'],
      activeTeamToday: item['Active Team Today'],
      totalInstallation: item['Total Installation'],
      totalSyncedToMDM: item['Total Synced To MDM']
    }))
  };
}

function transformContractorWiseMaterialAgingData(data) {
  return {
    data: data.map((item) =>
      formatObjectValues({
        contractorName: item['Name Of Contractor'],
        meterAvailableAtContractor: item['Meter Available At Contractor'],
        meter7Days: item['7 Days'],
        meter8To15Days: item['8 to 15 Days'],
        meter16To30Days: item['16 to 30 Days'],
        meterOver30Days: item['> 30 Days']
      })
    )
  };
}

function transformContractorMaterialDetail(data) {
  return {
    data: data.map((item) =>
      formatObjectValues({
        contractorName: item['Name Of Contractor'],
        meterIssuedToContractor: item['Meter Issued To Contractor'],
        meterAvailableAtContractor: item['Meter Available At Contractor'],
        meterIssuedToInstaller: item['Meter Issued To Installer'],
        totalInstallation: item['Total Installation'],
        meterAvailableAtInstaller: item['Meter Available At Installer']
      })
    )
  };
}

const contractorMaterialDetailColumns = [
  {
    Header: 'Contractor Name',
    accessor: 'contractorName'
  },
  {
    Header: 'Meter Issued to Contractor',
    accessor: 'meterIssuedToContractor'
  },
  {
    Header: 'Meter Available at Contractor',
    accessor: 'meterAvailableAtContractor'
  },
  {
    Header: 'Meter Issued to Installer',
    accessor: 'meterIssuedToInstaller'
  },
  {
    Header: 'Total Installation',
    accessor: 'totalInstallation'
  },
  {
    Header: 'Meter Available at Installer',
    accessor: 'meterAvailableAtInstaller'
  }
];

function transformContractorStats(data) {
  return [
    {
      title: 'TOTAL CONTRACTOR',
      value: data['Total Contractor']
    },
    {
      title: 'Total Team',
      value: data['Total Team']
    },
    {
      title: 'Active Team Today',
      value: data['Active Team Today']
    },
    {
      title: 'Total Installation',
      value: data['Total Installation']?.toString()
    },
    {
      title: 'Total Synced To MDM',
      value: data['Total Synced To MDM']
    }
  ];
}

function transformPlannedVsActualData(data, title = 'Untitled', index = 0) {
  const monthYearToIndex = {};
  data.forEach((item) => {
    const monthYear = item['Month-Year'];
    if (!monthYearToIndex[monthYear]) {
      monthYearToIndex[monthYear] = Object.keys(monthYearToIndex).length;
    }
  });

  const plan = new Array(Object.keys(monthYearToIndex).length).fill(0);
  const actual = new Array(Object.keys(monthYearToIndex).length).fill(0);

  data.forEach((item) => {
    const monthYear = item['Month-Year'];
    const _index = monthYearToIndex[monthYear];
    plan[_index] = item['Planned Quantity'];
    actual[_index] = item['Installed Quantity'];
  });

  const xAxis = 'Month-Year';

  const sortedMonthYears = Object.keys(monthYearToIndex).sort((a, b) => {
    const [, yearA] = a.split('-');
    const [, yearB] = b.split('-');
    if (yearA !== yearB) {
      return yearA - yearB;
    }
    return monthYearToIndex[a] - monthYearToIndex[b];
  });

  const chartData = sortedMonthYears.map((monthYear) => ({
    [xAxis]: monthYear,
    plan: plan[monthYearToIndex[monthYear]],
    actual: actual[monthYearToIndex[monthYear]]
  }));

  return {
    id: index + 1,
    title,
    chartData,
    xAxis
  };
}

function transformPlannedVsActualMeterInstallationStatus(ungroupedData) {
  return Object.values(
    Object.fromEntries(
      Object.entries(
        ungroupedData.reduce((prev, current) => {
          if (!prev[current['Meter Type']]) {
            prev[current['Meter Type']] = [];
          }

          prev[current['Meter Type']].push({
            'Month-Year': current['Month-Year'],
            'Planned Quantity': current['Planned Quantity'],
            'Installed Quantity': current['Installed Quantity']
          });

          return prev;
        }, {})
      ).map(([key, value], index) => [key, transformPlannedVsActualData(value, key, index)])
    )
  );
}

function transformGaaLevelWisePercentage(data) {
  return data.map((item) => ({
    value: parseFloat(item.InstalledQuantity),
    label: item['GAA Entry Name']
  }));
}

const transformMeterTypeWiseData = (rawData) =>
  Object.entries(
    rawData.reduce((acc, curr) => {
      if (!acc[curr['Meter Type']]) {
        acc[curr['Meter Type']] = 0;
      }
      acc[curr['Meter Type']] += Number(curr['Installed Quantity']);
      return acc;
    }, {})
  ).map(([key, value]) => ({ 'Meter Type': key, 'Installed Quantity': value }));

const transformMainExecutiveTableData = (tableData) => {
  return tableData.map((item) => ({
    ...item,
    'Material Type': item['Material Type'] || 'N/A',
    'Start Date': item['Start Date'] || 'N/A',
    'End Date': item['End Date'] || 'N/A'
  }));
};

const mainExecutiveTableColumns = [
  { Header: 'Installation Type', accessor: 'Meter Type' },
  { Header: 'Material Type', accessor: 'Material Type' },
  { Header: 'Start Date', accessor: 'Start Date' },
  { Header: 'End Date', accessor: 'End Date' },
  { Header: 'Total Scope', accessor: 'Total Scope' },
  { Header: 'Supplied', accessor: 'Supplied Quantity' },
  { Header: 'Installed', accessor: 'Installed Quantity' },
  { Header: 'Synced To MDM', accessor: 'Synced To MDM' },
  { Header: 'Total SAT', accessor: 'Total SAT' },
  { Header: 'IIR (Per Day)', accessor: 'IIR (Per Day)' },
  { Header: 'CMIR (Per Day)', accessor: 'CMIR (Per Day)' },
  { Header: 'RIR (Per Day)', accessor: 'RIR (Per Day)' },
  { Header: 'Remaining Time', accessor: 'Remaining Time' }
];

const transformMainExecutiveTableDataSummary = (tableData, projectDetails) => {
  let totalScope = 0;
  let suppliedQuantity = 0;
  let installedQuantity = 0;
  let syncedToMDM = 0;
  let totalSAT = 0;
  let iirPerDay = 0;
  let cmirPerDay = 0;
  let rirPerDay = 0;

  tableData.forEach((item) => {
    totalScope += Math.abs(item['Total Scope']);
    suppliedQuantity += Math.abs(item['Supplied Quantity']);
    installedQuantity += Math.abs(item['Installed Quantity']);
    syncedToMDM += Math.abs(item['Synced To MDM']);
    totalSAT += Math.abs(item['Total SAT']);
    iirPerDay += Math.abs(item['IIR (Per Day)']);
    cmirPerDay += Math.abs(item['CMIR (Per Day)']);
    rirPerDay += Math.abs(item['RIR (Per Day)']);
  });

  return [
    {
      title: 'Last updated on',
      value: new Date().toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }).replace(',', '').replaceAll('/', '-')
    },
    {
      title: 'Start Date',
      value:
        (projectDetails?.closureDate && new Date(projectDetails?.closureDate)?.toLocaleDateString('en-GB').replaceAll('/', '-')) || 'N/A'
    },
    {
      title: 'End Date',
      value: (projectDetails?.poEndDate && new Date(projectDetails?.poEndDate)?.toLocaleDateString('en-GB').replaceAll('/', '-')) || 'N/A'
    },
    {
      title: 'Total Scope',
      value: totalScope.toString()
    },
    {
      title: 'Supplied',
      value: suppliedQuantity.toString()
    },
    {
      title: 'Installed',
      value: installedQuantity.toString()
    },
    {
      title: 'Synced to MDM',
      value: syncedToMDM.toString()
    },
    {
      title: 'Total SAT',
      value: totalSAT.toString()
    },
    {
      title: 'IIR (PER DAY)',
      value: iirPerDay.toString()
    },
    {
      title: 'CMIR (PER DAY)',
      value: cmirPerDay.toString()
    },
    {
      title: 'RIR (PER DAY)',
      value: rirPerDay.toString()
    },
    {
      title: 'Remaining Time',
      value: (() => {
        if (!projectDetails?.poEndDate) return 'N/A';
        const dateCalculate = GetDateFormat(projectDetails.poEndDate);
        return dateCalculate;
      })()
    }
  ];
};

const contractorSummaryMainTableColumns = [
  {
    Header: 'Name Of Contractor',
    accessor: 'nameOfContractor'
  },
  {
    Header: 'Total Team',
    accessor: 'totalTeam'
  },
  {
    Header: 'Active Team Today',
    accessor: 'activeTeamToday'
  },
  {
    Header: 'Total Installation',
    accessor: 'totalInstallation'
  },
  {
    Header: 'Total Synced To MDM',
    accessor: 'totalSyncedToMDM'
  }
];

const contractorWiseMaterialAgingColumns = [
  {
    Header: 'Contractor Name',
    accessor: 'contractorName'
  },
  {
    Header: 'Meter Available at Contractor',
    accessor: 'meterAvailableAtContractor'
  },
  {
    Header: '7 Days',
    accessor: 'meter7Days'
  },
  {
    Header: '8 to 15 Days',
    accessor: 'meter8To15Days'
  },
  {
    Header: '16 to 30 Days',
    accessor: 'meter16To30Days'
  },
  {
    Header: '> 30 Days',
    accessor: 'meterOver30Days'
  }
];

export {
  transformContractorSummaryMainTable,
  transformContractorWiseMaterialAgingData,
  transformContractorStats,
  transformContractorMaterialDetail,
  transformPlannedVsActualMeterInstallationStatus,
  transformMeterTypeWiseData,
  transformGaaLevelWisePercentage,
  transformMainExecutiveTableData,
  transformMainExecutiveTableDataSummary,
  contractorSummaryMainTableColumns,
  contractorWiseMaterialAgingColumns,
  contractorMaterialDetailColumns,
  mainExecutiveTableColumns,
  mainHeadingBgColor,
  chartHeadingBgColor,
  planVsAcutualHeadingBgColor
};
