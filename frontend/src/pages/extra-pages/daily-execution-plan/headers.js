const createSeries = (startNumber, size) => Array.from({ length: size }, (_, i) => startNumber + i);
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];

const getFormatedDate = (selecteddate) => {
  return {
    dayOfWeek: selecteddate.toLocaleDateString('en-US', { weekday: 'short' }),
    year: selecteddate.toLocaleDateString('en-US', { year: 'numeric' }),
    month: selecteddate.toLocaleDateString('en-US', { month: 'long' }),
    day: selecteddate.toLocaleDateString('en-US', { day: 'numeric' }),
    dayOfWeekIndex: selecteddate.getDay()
  };
};

export const Headers = {
  dep: [
    {
      Header: 'Material Type',
      accessor: 'master_maker_lov.name'
    },
    {
      Header: 'Month',
      accessor: 'month'
    },
    {
      Header: 'Year',
      accessor: 'year'
    },
    {
      Header: ' 1 ',
      accessor: 'q1'
    },
    {
      Header: ' 2 ',
      accessor: 'q2'
    },
    {
      Header: ' 3 ',
      accessor: 'q3'
    },
    {
      Header: ' 4 ',
      accessor: 'q4'
    },
    {
      Header: ' 5 ',
      accessor: 'q5'
    },
    {
      Header: ' 6 ',
      accessor: 'q6'
    },
    {
      Header: ' 7 ',
      accessor: 'q7'
    },
    {
      Header: ' 8 ',
      accessor: 'q8'
    },
    {
      Header: ' 9 ',
      accessor: 'q9'
    },
    {
      Header: ' 10 ',
      accessor: 'q10'
    },
    {
      Header: ' 11 ',
      accessor: 'q11'
    },
    {
      Header: ' 12 ',
      accessor: 'q12'
    },
    {
      Header: ' 13 ',
      accessor: 'q13'
    },
    {
      Header: ' 14 ',
      accessor: 'q14'
    },
    {
      Header: ' 15 ',
      accessor: 'q15'
    },
    {
      Header: ' 16 ',
      accessor: 'q16'
    },
    {
      Header: ' 17 ',
      accessor: 'q17'
    },
    {
      Header: ' 18 ',
      accessor: 'q18'
    },
    {
      Header: ' 19 ',
      accessor: 'q19'
    },
    {
      Header: ' 20 ',
      accessor: 'q20'
    },
    {
      Header: ' 21 ',
      accessor: 'q21'
    },
    {
      Header: ' 22 ',
      accessor: 'q22'
    },
    {
      Header: ' 23 ',
      accessor: 'q23'
    },
    {
      Header: ' 24 ',
      accessor: 'q24'
    },
    {
      Header: ' 25 ',
      accessor: 'q25'
    },
    {
      Header: ' 26 ',
      accessor: 'q26'
    },
    {
      Header: ' 27 ',
      accessor: 'q27'
    },
    {
      Header: ' 28 ',
      accessor: 'q28'
    },
    {
      Header: ' 29 ',
      accessor: 'q29'
    },
    {
      Header: ' 30 ',
      accessor: 'q30'
    },
    {
      Header: ' 31 ',
      accessor: 'q31'
    },
    {
      Header: 'Updated By',
      accessor: 'updated.name'
    },
    {
      Header: 'Created By',
      accessor: 'created.name'
    },
    {
      Header: 'Updated On',
      accessor: 'updatedAt'
    },
    {
      Header: 'Created On',
      accessor: 'createdAt'
    }
  ]
};

export const PreData = {
  // populateDate: new Array(42).fill({ date: '', qty: null }),
  day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  month: months.map((v, ind) => {
    return { id: ind + 1, name: v };
  }),
  monthSet: months,
  year: [...createSeries(1900, 201)].map((v) => {
    return { id: v, name: v };
  }),
  getFirstAndLastDateOfMonth: (year, month) => {
    const firstDate = new Date(year, month - 1, 1);
    const lastDate = new Date(year, month, 0);
    return {
      firstDate: getFormatedDate(firstDate),
      lastDate: getFormatedDate(lastDate)
    };
  },
  getCurrentMonthAndYear: () => {
    const currentDate = new Date();
    return {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1
    };
  }
};
