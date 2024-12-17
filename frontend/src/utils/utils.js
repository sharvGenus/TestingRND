import CryptoJS from 'crypto-js';
import { isEqual } from 'lodash';
import toast from './ToastNotistack';
/**
 * CheckIfNotEmpty is for checking text is empty or not
 * @param text
 * @returns {*|boolean}
 */
export const checkIfNotEmpty = (text) => !(text == null || /^\s*$/.test(text));

/**
 * ToTitleCase is for convert lines/text into title case
 * @param {string} txt
 * @returns {stargin}
 */
export const toTitleCase = (txt) =>
  txt
    .split(' ')
    .map((_i) => _i.slice(0, 1).toUpperCase() + _i.slice(1, _i.length).toLowerCase())
    .join(' ');

function isObject(value) {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}

export const setReccurssiveObjectKeys = (object, path, value) => {
  if (!isObject(object)) {
    return { ...object };
  }
  path = path.split('.');
  const { length } = path;
  const lastIndex = length - 1;

  let index = -1;
  let nested = object;
  while (nested != null && ++index < length) {
    const key = path[index];
    let newValue = value;
    if (index !== lastIndex) {
      const objValue = nested[key];
      newValue = objValue;
    }
    nested[key] = newValue;
    nested = nested[key];
  }
  return object;
};

export const numberToWords = (number) => {
  if (isNaN(number)) return number;
  const units = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertNumberToWords = (n) => {
    let words = '';

    if (n >= 10000000) {
      words += convertNumberToWords(Math.floor(n / 10000000)) + ' Crore ';
      n %= 10000000;
    }

    if (n >= 100000) {
      words += convertNumberToWords(Math.floor(n / 100000)) + ' Lakh ';
      n %= 100000;
    }

    if (n >= 1000) {
      words += convertNumberToWords(Math.floor(n / 1000)) + ' Thousand ';
      n %= 1000;
    }

    if (n >= 100) {
      words += units[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }

    if (n >= 20) {
      words += tens[Math.floor(n / 10)];
      if (n % 10 !== 0) {
        words += ' ' + units[n % 10];
      }
    } else if (n >= 11) {
      words += teens[n - 11];
    } else if (n > 0) {
      words += units[n];
    }

    return words;
  };

  const integerPart = Math.floor(number);
  const decimalPart = Math.round((number - integerPart) * 100);

  let integerWords = convertNumberToWords(integerPart).trim() || 'Zero';
  let decimalWords = '';

  if (integerPart === 0 && decimalPart === 0) {
    return 'Zero';
  }

  if (decimalPart > 0) {
    decimalWords = 'and ' + convertNumberToWords(decimalPart).trim();
  }

  if (decimalPart === 0) {
    decimalWords = '';
  }

  if (decimalWords && integerWords !== 'Zero') {
    return integerWords + decimalWords;
  } else if (decimalWords) {
    return decimalWords;
  } else {
    return integerWords;
  }
};

export const removeUndefinedOrNullFromObject = (object) => {
  Object.entries(object).forEach(([key, element]) => {
    if (element === null || element === undefined) {
      delete object[key];
    } else if (typeof element === 'object' && Object.keys(element).length > 0) {
      return removeUndefinedOrNullFromObject(element);
    }
    return null;
  });
  return object;
};

export const getReccurssiveObjectKeys = (object, path) => {
  if (!isObject(object)) {
    return object;
  }
  path = path.split('.');
  const { length } = path;

  let index = -1;
  let nested = object;
  while (nested != null && ++index < length) {
    const key = path[index];
    nested = nested[key];
  }
  return nested;
};

export const getUniqueArray = (arr) => arr.filter((item, index) => arr.indexOf(item) === index);

// eslint-disable-next-line no-console
export const printErrorsOnConsole = (error) => console.log('error :>> ', error);

/**
 * Retrieves a nested property value from an object using a string-based accessor.
 * @param {object} obj - The object to traverse.
 * @param {string} accessor - The accessor string specifying the property to retrieve (e.g., 'project.name').
 * @returns {any} - The value of the accessed property or undefined if the property is not found or the accessor is invalid.
 */
export const getValueByAccessor = (obj, accessor, devolutionExport) => {
  if (!accessor.split) return;
  const properties = accessor.split('.');
  // console.log('properties :', properties);
  let value = obj;

  for (const property of properties) {
    const match = property.match(/(\w+)(?:\[(\w+)\])?/);
    // console.log('match :', match, obj);
    if (match) {
      const [, propName, key] = match;
      if (devolutionExport && match.input) {
        value = value[match.input];
      } else if (value && typeof value === 'object' && propName in value) {
        value = key ? value[propName][key] : value[propName];
      } else {
        return undefined; // Property not found, return undefined
      }
    } else {
      return undefined; // Invalid accessor, return undefined
    }
  }

  return value;
};

export const generateSHA512 = (str, iterations = 1000) => {
  if (!str) throw new Error('Something Went Wrong');
  if (iterations === 0) return str;
  return generateSHA512(CryptoJS.SHA512(str).toString().toLowerCase(), iterations - 1);
};

export const getTokenFromCookie = () => {
  const token = document.cookie.split('; ').filter((x) => x && x.split('=')?.[0] === 'auth_token')?.[0];
  return token?.split('=')?.[1] ? `Bearer ${token.split('=')?.[1]}` : '';
};

export const removeTokenFromCookie = () => {
  const allCookies = document.cookie.split(';').filter((x) => x.split('=')?.[0] !== 'auth_token');
  document.cookie = allCookies.join('; ');
};

const processDate = (_date) => {
  const dateObj = new Date(_date);
  if (!_date || isNaN(dateObj)) {
    throw new Error('Invalid Date');
  }

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return { day, month, year, hours, minutes };
};

export const checkFormat = (value) => {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  return regex.test(value);
};

export const getTimeOnly = (dateTimeString, format) => {
  const date = new Date(dateTimeString);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (format === '12hour') {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  } else if (format === '24hour') {
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes}`;
  } else {
    throw new Error('Invalid format parameter. Please use either "12hrs" or "24hrs".');
  }
};

export const getDateTimeBoth = (dateTimeString, format) => {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedHours = format === '12hour' ? hours % 12 || 12 : hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const ampm = format === '12hour' ? (hours >= 12 ? 'PM' : 'AM') : '';

  if (format === '12hour') {
    return `${formattedDay}-${formattedMonth}-${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
  } else if (format === '24hour') {
    return `${formattedDay}-${formattedMonth}-${year} ${formattedHours}:${formattedMinutes}`;
  } else {
    throw new Error('Invalid format parameter. Please use either "12hour" or "24hour".');
  }
};

export const getCurrentFormattedDate = () => {
  const now = new Date(); // Get the current date and time
  const year = now.getUTCFullYear(); // Get the current year (in UTC)
  const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Get the current month (0-based, so we add 1)
  const day = String(now.getUTCDate()).padStart(2, '0'); // Get the current day
  const hours = String(now.getUTCHours()).padStart(2, '0'); // Get the current hour
  const minutes = String(now.getUTCMinutes()).padStart(2, '0'); // Get the current minute
  const seconds = String(now.getUTCSeconds()).padStart(2, '0'); // Get the current second
  const milliseconds = String(now.getUTCMilliseconds()).padStart(3, '0'); // Get the current millisecond

  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

  return formattedDate;
};

export const formatTimeStamp = (_date) => {
  try {
    const { day, month, year, hours, minutes } = processDate(_date);
    return `${day}-${month}-${year}, ${hours}:${minutes}`;
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatDate = (_date) => {
  try {
    const { day, month, year } = processDate(_date);
    return `${day}-${month}-${year}`;
  } catch (error) {
    return 'Invalid Date';
  }
};

export const convertIfDate = (value) => {
  const result = formatDate(value);
  if (result !== 'Invalid Date') return result;
  return value;
};

export const formatOperator = (operator) => {
  switch (operator) {
    case 'et':
      return '=';
    case 'net':
      return '!=';
    case 'lt':
      return '<';
    case 'gt':
      return '>';
    case 'lte':
      return '<=';
    case 'gte':
      return '>=';
    default:
      return 'ss';
  }
};

export const isMissingStoreLocation = (data, storeLocationKey) => {
  const isMissingLocations = data.some((item) => !item[storeLocationKey]);

  if (isMissingLocations) {
    toast(`Please select "${storeLocationKey.match(/from/i) ? 'From' : 'To'} Store Location" for all materials`, { variant: 'warning' });
  }

  return isMissingLocations;
};

export const fetchTransactionType = (obj, name) => {
  if (!obj || !name) return undefined;
  const transactionType = obj.find((item) => item.name === name);
  return transactionType ? transactionType.id : undefined;
};

export const getStoreInt = (val) => {
  if (val.storeId) return val.storeId;
  else if (
    val.transaction_type &&
    val.transaction_type.name &&
    (val.transaction_type.name === 'MRR' || val.transaction_type.name === 'CONSUMPTIONREQUEST')
  )
    return val.fromStoreId;
  else return val.toStoreId;
};

export const groupByRequisitionNumberForDropdown = (data) => {
  if (!data) return [];

  const groupedData = data.reduce((accumulator, currentObject) => {
    const { referenceDocumentNumber, transactionTypeId } = currentObject;
    if (!accumulator[referenceDocumentNumber + transactionTypeId + getStoreInt(currentObject)]) {
      accumulator[referenceDocumentNumber + transactionTypeId + getStoreInt(currentObject)] = [];
    }
    accumulator[referenceDocumentNumber + transactionTypeId + getStoreInt(currentObject)].push(currentObject);
    return accumulator;
  }, {});

  return Object.entries(groupedData).map(([, value]) => ({
    id: value[0].id,
    name: value[0].referenceDocumentNumber,
    data: value
  }));
};

export const parseAddressFromObject = (obj) => {
  if (!obj) return '';
  try {
    const city = obj.city || obj.cities;
    return `${obj.address}, ${city.name}, ${city.state.name}, ${city.state.country.name} - ${obj.pincode || obj.pinCode || ''}`;
  } catch {
    return '';
  }
};

export const prepareResponseForReceipt = (obj) => {
  if (!obj) return [];

  return obj
    .map((item) => {
      const { stock_ledgers: sl, remarks } = item;
      if (!Array.isArray(sl)) return [];

      const [slFirstItem] = sl;

      const createMaterialData = (slArray, predicate) => {
        let sumOfAmounts = 0;
        let sumOfQty = 0;
        let slItem;

        const materialData = slArray.filter(predicate).map((materialItem, index) => {
          const amount = Number(materialItem.value);
          sumOfAmounts += amount;
          sumOfQty += Math.abs(materialItem.quantity);

          if (!slItem && materialItem.quantity) slItem = materialItem;

          return {
            ...materialItem,
            serialNumber: index + 1,
            amount: amount.toFixed(2),
            remarks: materialItem.remarks || item.remarks
          };
        });

        return {
          materialData,
          sumOfAmounts: sumOfAmounts.toFixed(2),
          sumOfQty: sumOfQty.toFixed(2),
          slItem
        };
      };

      const { materialData, sumOfAmounts, sumOfQty, slItem: slPositiveQty } = createMaterialData(sl, (slItem) => slItem.quantity > 0);
      const {
        materialData: materialDataNegativeQty,
        sumOfAmounts: sumOfNegativeAmounts,
        sumOfQty: sumOfNegativeQty,
        slItem: slNegativeQty
      } = createMaterialData(sl, (slItem) => slItem.quantity < 0);

      return {
        ...item,
        requestNumber: slFirstItem?.requestNumber,
        projectName: slFirstItem?.project?.name,
        remarks: remarks || item?.remarks || '',
        fromProject: slNegativeQty?.project,
        toProject: slPositiveQty?.project,
        fromOrganization: slNegativeQty?.organization,
        toOrganization: slPositiveQty?.organization,
        fromStore: slNegativeQty?.organization_store,
        toStore: slPositiveQty?.organization_store,
        fromStoreLocation: slNegativeQty?.organization_store_location,
        toStoreLocation: slPositiveQty?.organization_store_location,
        materialData,
        materialDataNegativeQty,
        sumOfAmounts: +sumOfAmounts > 0 ? sumOfAmounts : sumOfNegativeAmounts,
        sumOfNegativeAmounts: +sumOfAmounts > 0 ? sumOfAmounts : sumOfNegativeAmounts,
        sumOfQty,
        sumOfNegativeQty
      };
    })
    .filter(Boolean);
};

export const concateNameAndCode = (arr) => {
  const newValue =
    arr &&
    arr.length > 0 &&
    arr.map((val) => ({
      ...val,
      id: val?.id,
      name: val?.name + ' - ' + val?.code
    }));
  return newValue || [];
};

export const concateCodeAndName = (arr) => {
  const newValue =
    arr &&
    arr.length > 0 &&
    arr.map((val) => ({
      ...val,
      id: val?.id,
      name: val?.code + ' - ' + val?.name
    }));
  return newValue || [];
};

export const pickKeyFromResponseObject = (obj, key = 'requestNumber') => {
  if (!obj) return obj;
  if (obj?.stock_ledgers?.[0]?.[key]) {
    return obj?.stock_ledgers?.[0]?.[key];
  }
  if (obj?.[0]?.[key]) {
    return obj?.[0]?.[key];
  }
  if (obj?.[key]) {
    return obj?.[key];
  }
  return '';
};

export const valueIsMissingOrNA = (value) => {
  if (!value || ['na', 'n/a', 'N/A', 'NA'].includes(value)) {
    return true;
  }
  return false;
};

export const transformDataWithFilePaths = (data, fileFields) => {
  if (!data) return data;

  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      if (fileFields.some((item) => item.name === key)) {
        try {
          return [`${key}-paths`, typeof value === 'string' ? JSON.parse(value) : value || []];
        } catch {
          return [`${key}-paths`, []];
        }
      } else {
        return [key, value];
      }
    })
  );
};

export const parentOrganizationFetchers = {
  getTopmostOrganization: (data) => data?.organization?.parent || data?.organization,
  getImmediateParentOrganization: (data) => data?.organisationBranch || data?.organization,
  getBranchOrganization: (data) => data?.organisationBranch
};

export const getStore = (val) => {
  if (!val) return null;
  if (
    val.transaction_type &&
    val.transaction_type.name &&
    (val.transaction_type.name === 'MRR' || val.transaction_type.name === 'CONSUMPTIONREQUEST')
  )
    return val.fromStoreId;
  else return val.toStoreId;
};

export const getCompStore = (val) => {
  if (!val) return null;
  if (
    val.transaction_type &&
    val.transaction_type.name &&
    (val.transaction_type.name === 'MRR' || val.transaction_type.name === 'CONSUMPTIONREQUEST')
  )
    return val.toStoreId;
  else return val.fromStoreId;
};

export const getVisibleColumns = (columns, ignoredColumns, returnWholeColumn = false) => {
  const ignoredAccessorsSet = new Set(ignoredColumns);
  const visibleColumns = columns
    .filter((item) => !ignoredAccessorsSet.has(typeof item.accessor === 'function' ? item.Header : item.accessor))
    .map((item) => {
      if (returnWholeColumn) {
        return item;
      }
      return item.exportAccessor || item.accessor;
    });
  return visibleColumns;
};

export const hasChanged = ([prevValue, currentValue]) => {
  return prevValue !== undefined && !isEqual(prevValue, currentValue);
};

export const isDecimalUom = (uom) => {
  return !['number', 'numbers', 'nos', 'no', 'sno'].includes(uom?.toLowerCase());
};

export const toFixedQuantity = (value, places = 3) => {
  var adjustment = Math.pow(10, places);
  var roundedValue = Math.floor(value * adjustment) / adjustment;
  return roundedValue;
};

export const getRequestStatus = ({ status: s, approvalStatus: aS, isProcessed }) => {
  const status = Number(s);
  const approvalStatus = Number(aS);
  if (status === 0) {
    return 'Cancelled';
  } else if (isProcessed === true) {
    return 'Processed';
  } else if (approvalStatus === 2) {
    return 'Active';
  } else if (approvalStatus === 1) {
    return 'Approved';
  } else if (approvalStatus === 0) {
    return 'Rejected';
  } else {
    return 'Unknown Status';
  }
};

export const sortAlphanumeric = (arr) => {
  return [...arr].sort((a, b) => {
    if (isNaN(a) && isNaN(b)) {
      return a.localeCompare(b, 'en', { numeric: true });
    } else if (!isNaN(a) && isNaN(b)) {
      return -1;
    } else if (isNaN(a) && !isNaN(b)) {
      return 1;
    } else {
      return parseInt(a) - parseInt(b);
    }
  });
};

export function debounceFunction(func, timeout = 100) {
  let time;
  return function (...args) {
    clearTimeout(time);
    time = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export const generateGaaApiParameter = ({ areaLevelsData, values, methods, accessRank }) => {
  let newLevelFilter = {};
  let errorFlag = false;
  if (areaLevelsData) {
    for (let i = areaLevelsData?.length - 1; i >= 0; i--) {
      if (values[`gaaLevelEntryId${i}`]?.length) {
        newLevelFilter[`${areaLevelsData[i].columnName}`] = values[`gaaLevelEntryId${i}`];
        break;
      }
    }
    if (!values['gaaLevelEntryId0']?.length) {
      methods.setError('gaaLevelEntryId0', { message: 'This field is required' }, { shouldFocus: true });
      errorFlag = true;
    }
    for (let i = 1; i < areaLevelsData.length; i++) {
      const { rank } = areaLevelsData[i];
      if (rank <= accessRank && !values[`gaaLevelEntryId${i}`]?.length) {
        methods.setError(`gaaLevelEntryId${i}`, { message: 'This field is required' }, { shouldFocus: true });
        errorFlag = true;
      }
    }
  }
  return { errorFlag, newLevelFilter };
};

export const getFormFieldNames = (methods) => {
  return Object.keys(methods.watch());
};

export const createFormsList = (forms) => {
  return (
    forms?.webformDataObject?.rows
      ?.filter((values) => values.isPublished)
      .map((element) => ({
        id: element.id,
        name: element.name,
        tableName: element.tableName
      })) || []
  );
};

export const calculateChartDomain = (dataMax) => {
  if (dataMax < 10) {
    return [0, dataMax + 4];
  } else if (dataMax < 100) {
    return [0, dataMax + 5];
  } else {
    return [0, dataMax + Math.ceil(dataMax * 0.1)];
  }
};

export const truncateChartLabel = (label) => {
  const maxLength = 16;
  let outputLabel = label;
  if (label.length > maxLength) {
    const start = label.slice(0, maxLength / 2);
    const end = label.slice(-maxLength / 2);
    outputLabel = `${start}...${end}`;
  }
  return outputLabel.length < label.length ? outputLabel : label;
};

export const generateChartMargins = (maxLabelLength) => {
  const leftMargin = Math.min(40, 8 * maxLabelLength);
  const bottomMargin = maxLabelLength > 10 ? 70 : 40;
  return [leftMargin, bottomMargin];
};

export const formatToThousandNotation = (value) => {
  try {
    const bigValue = BigInt(typeof value === 'string' ? value.split('.')[0] : parseInt(value));
    const thousand = BigInt(1000);
    if (bigValue >= thousand) {
      return `${(bigValue / thousand).toString()}.${(((bigValue % thousand) * 100n) / thousand).toString().padStart(2, '0')}K`;
    }
    return bigValue.toString();
  } catch {
    return value;
  }
};

// Used To date the date format into years months and days saperated
// EX - 2034-01-14T00:00:00.000Z to 9 years, 3 months 28 days from current date
export const GetDateFormat = (date = new Date()) => {
  const mainDate = new Date(date);
  const currentDate = new Date();

  const timeDiff = mainDate - currentDate;
  if (timeDiff <= 0) return '0 days';

  // Get total months difference
  const totalMonthsDiff = (mainDate.getFullYear() - currentDate.getFullYear()) * 12 + (mainDate.getMonth() - currentDate.getMonth());

  // Calculate years and months
  const years = Math.floor(totalMonthsDiff / 12);
  let months = totalMonthsDiff % 12;

  // Adjust the currentDate to the same day of the mainDate month
  const adjustedCurrentDate = new Date(currentDate);
  adjustedCurrentDate.setFullYear(currentDate.getFullYear() + years);
  adjustedCurrentDate.setMonth(currentDate.getMonth() + months);

  // Calculate remaining days
  let daysDiff = Math.floor((mainDate - adjustedCurrentDate) / (1000 * 60 * 60 * 24));

  // If the days are negative, adjust the months and days accordingly
  if (daysDiff < 0) {
    const lastMonth = new Date(mainDate.getFullYear(), mainDate.getMonth(), 0).getDate(); // Days in the previous month
    daysDiff += lastMonth;
    months -= 1;
  }

  // Return formatted result
  return `${years} Years ${months} Months ${daysDiff} Days`.trim();
};
