import * as Yup from 'yup';

const isUptoThreeDecimalPlaces = [
  'is-decimal-up-to-3-places',
  'Must have up to 3 decimal places',
  (value) => {
    if (!value) return true;
    return /^\d+(\.\d{1,3})?$/.test(value.toString());
  }
];
const isUptoTwoDecimalPlaces = [
  'is-decimal-up-to-2-places',
  'Must have up to 2 decimal places',
  (value) => {
    if (!value) return true;
    return /^\d+(\.\d{1,2})?$/.test(value.toString());
  }
];
const isNonZero = (vl = undefined) => ['is-non-zero', `${vl ? vl : 'Quantity'} should be greater than zero`, (value) => value > 0];
const nothing = ['nothing', '', () => true];

const dateComparison = (dateStr1, dateStr2, le = true) => {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);

  return le ? date1 <= date2 : date1 >= date2;
};

const dateComparisonV2 = (dateStr1, dateStr2, dateStr3, le = true) => {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);
  const date3 = new Date(dateStr3);
  return le ? date3 <= date1 && date1 <= date2 : date3 <= date1 && date1 >= date2;
};

const Validations = {
  allowedColumns: Yup.number()
    .typeError('Value must be a number')
    .min(1, 'Value must be between 1 and 5')
    .max(5, 'Value must be between 1 and 5')
    .required(''),
  name: Yup.string()
    .matches(/^[A-Za-z ]*$/, 'Please enter valid name')
    .required('Required'),
  form: Yup.string().required('Required').nullable(),
  formType: Yup.string().required('Required').nullable(),
  taskType: Yup.string().required('Required').nullable(),
  code: Yup.string()
    .matches(/^(?!0\d).*$/, 'Leading zero values are not allowed')
    .required('Required')
    .nullable(),
  inventoryName: Yup.string()
    .matches(/^[A-Za-z0-9\-_'\s(),./]+$/, 'Please enter valid name')
    .required('Required'),
  particulars: Yup.string()
    .matches(/^[A-Za-z0-9\-_'\s(),./]+$/, 'Please enter valid particulars')
    .required('Required'),
  orgName: Yup.string().required('Required'),
  title: Yup.string().required('Required').nullable(),
  office: Yup.string().required('Required').nullable(),
  masterCode: Yup.string()
    .matches(/^(?!0\d).*$/, 'Leading zero values are not allowed')
    .required('Required'),
  projectName: Yup.string()
    .matches(/^(?!0\d).*$/, 'Leading zero values are not allowed')
    .required('Required'),
  type: Yup.string().required('Required'),
  gstNumber: Yup.string()
    .matches(
      /^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/,
      'Please enter valid GST number'
    )
    .required('Required')
    .nullable(),
  attachments: Yup.string().required('Required'),
  storePhoto: Yup.string().required('Required'),
  email: Yup.string()
    .matches(/^[a-zA-Z0-9._]{1,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Enter valid email')
    .required('Required')
    .nullable(),
  mobileNumber: Yup.string().matches('^((\\+91)?|91)?[6789]\\d{9}$', 'Please enter valid mobile number').required('Required'),
  mobileNumberOptional: Yup.string()
    .nullable()
    .test('isValidOrEmpty', 'Please enter a valid mobile number', function (value) {
      return !value || /^((\+91)?|91)?[6789]\d{9}$/.test(value);
    }),
  other: Yup.string().required('Required'),
  nother: Yup.string().nullable().required('Required'),
  otherArray: Yup.array().min(1, 'Please select atleast one field'),
  areaLevel: Yup.array().min(1, 'Please select atleast one level.'),
  formTitle: Yup.string()
    .matches(/^[A-Za-z ]*$/, 'Only A-Z letters allowed.')
    .required('Required'),
  attributeTitle: Yup.string()
    .required(' ')
    .matches(/^[A-Z].*$/, 'First letter must be capital'),
  dbColumn: Yup.string()
    .matches(/^(?!.*__)[a-z_]{1,20}$/, 'Only use small letters and underscore. (Max length 20)')
    .required(''),
  required: Yup.string().required(' '),
  telephone: Yup.string()
    .matches(/\b(?:\d{3}-\d{3}-\d{4}|\(\d{3}\) \d{3}-\d{4}|\d{10})\b/, 'Enter valid telephone number')
    .nullable(),
  address: Yup.string().required('Required'),
  registeredAddress: Yup.string().required('Required'),
  quantity: Yup.number().typeError('Please enter valid quantity').required('Required'),
  billingQuantity: Yup.number().typeError('Please enter valid billing quantity').required('Required'),
  trxnQuantity: Yup.number()
    .test(...isNonZero())
    .test(...isUptoThreeDecimalPlaces)
    .typeError('Please enter valid quantity')
    .required('Required'),
  maxQuantity: (maxQuantity, nonZero = false) =>
    Yup.number()
      .test(...(nonZero ? isNonZero() : nothing))
      .test(...isUptoThreeDecimalPlaces)
      .required('Required')
      .typeError('Please enter a valid Quantity')
      .max(maxQuantity, `Maximum quantity allowed: ${maxQuantity || 0}.`),
  country: Yup.string().required('Required'),
  state: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  registeredCountry: Yup.string().required('Required'),
  registeredState: Yup.string().required('Required'),
  registeredCity: Yup.string().required('Required'),
  organizationType: Yup.string().nullable().required('Required'),
  organizationCode: Yup.number()
    .typeError('Value must be a valid integer')
    .required('Required')
    .integer('Value must be an integer')
    .max('2147483647', 'Value exceeds maximum allowed'),
  organizationStoreId: Yup.string().nullable().required('Required'),
  organizationLocationId: Yup.string().required('Required'),
  integrationId: Yup.string().required('Required'),
  firm: Yup.string().required('Required'),
  movementType: Yup.string().required('Required'),
  supplier: Yup.string().required('Required'),
  masterMaker: Yup.string().required('Required'),
  projectMasterMaker: Yup.string().required('Required'),
  lov: Yup.string().required('Required'),
  date: Yup.string().required('Required'),
  fromDate: Yup.string().required('Required'),
  toDate: Yup.string().when('fromDate', {
    is: (fromDate) => !!fromDate,
    then: Yup.string().test('isGreaterThanFromDate', 'To Date cannot be less than From date', function (value, context) {
      return new Date(value).getTime() >= new Date(context.parent.fromDate).getTime();
    })
  }),
  // .required('To Date is required'),
  invoiceNumber: Yup.string().required('Required'),
  challanNumber: Yup.string().required('Required'),
  poNumber: Yup.string().required('Required'),
  workOrderNumber: Yup.string().required('Required'),
  receivingStore: Yup.string().required('Required'),
  uom: Yup.string().required('Required'),
  project: Yup.string().nullable().required('Required'),
  projectArr: Yup.array().of(Yup.mixed()).nullable().required('Required').min(1, 'Required'),
  organizationArr: Yup.array().of(Yup.mixed()).nullable().required('Required').min(1, 'Required'),
  accessProject: Yup.string().nullable().required('Required'),
  rate: Yup.string()
    .matches(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/, 'Enter valid rate')
    .required('Required'),
  tax: Yup.string()
    .matches(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/, 'Enter valid tax')
    .required('Required'),
  rangeFrom: Yup.string().required('Required'),
  rangeTo: Yup.string().required('Required'),
  requiredWithLabel: () => Yup.string().nullable().required('Required'),
  requiredWithNonZero: (label) =>
    Yup.number().required('Required').min(1, `${label} must be greater than zero`).typeError(`${label} must be a number`),
  endRange: (startRange) =>
    Yup.number().required('Required').min(startRange, `End Range must be greater than start range`).typeError(`End Range must be a number`),
  value: Yup.number().required('Required'),
  isSerialize: Yup.string().required('Please select a checkbox'),
  vehicleNumber: Yup.string().required('Required'),
  vehicleNumberOptional: Yup.string().nullable(),
  inventoryNameOptional: Yup.string()
    .nullable()
    .test('isValidOrEmpty', 'Please enter valid name', function (value) {
      return !value || /^[A-Za-z0-9\-_'\s(),./]+$/.test(value);
    }),
  aadharNumber: Yup.string().matches(/^\d{12}$/, 'Please enter valid aadhar number'),
  panNumber: Yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter valid PAN Number'),
  lrNumber: Yup.string().required('Required'),
  eWayBillNumber: Yup.string().required('Required'),
  eWayBillDate: Yup.string().required('Required'),
  actualReceiptDate: Yup.string()
    .when('eWayBillDate', {
      is: (eWayBillDate) => !!eWayBillDate,
      then: Yup.string().test(
        'isGreaterThanEWayBillDate',
        'Actual receipt date cannot be less than e-way bill date',
        function (value, context) {
          return new Date(value).getTime() >= new Date(context.parent.eWayBillDate).getTime();
        }
      )
    })
    .required('Required'),
  pincode: Yup.string().min(6, 'Enter valid pincode').max(6, 'Enter valid pincode').required('Required'),
  registeredPincode: Yup.string().min(6, 'Enter valid pincode').max(6, 'Enter valid pincode').required('Required'),
  projectSiteStore: Yup.string().nullable().required('Required'),
  placeOfTransfer: Yup.string().required('Required'),
  contractorStore: Yup.string().nullable().required('Required'),
  projectSiteStoreLocation: Yup.string().required('Required'),
  contractorStoreLocation: Yup.string().nullable().required('Required'),
  contractorEmployee: Yup.string().required('Required'),
  alphanumericWithAlphabetRequired: (label) =>
    Yup.string()
      // .matches(/^[a-zA-Z0-9]*[a-zA-Z]+[a-zA-Z0-9-/]*$/, `Enter Valid ${label}`)
      .matches(/^[^\s]*$/, `Enter Valid ${label}`)
      .required('Required'),
  description: Yup.string().required('Required'),
  longDescription: Yup.string().required('Required'),
  hsnCode: Yup.string().min(6, 'Enter valid HSN Code').max(8, 'Enter valid HSN Code').required('Required'),
  isSerialNumber: Yup.string().required('Required'),
  store: Yup.string().nullable().required('Required'),
  accessStore: Yup.string().nullable().required('Required'),
  series: Yup.string().required('Required'),
  material: Yup.string().required('Required'),
  materialType: Yup.string().required('Required'),
  materialCode: Yup.string()
    .required('Required')
    .matches(/^\S+$/, 'Should not contain any space')
    .matches(/[0-9]/, 'Should contain at least one number')
    .matches(/^(?!0\d).*$/, 'Leading zero values are not allowed'),
  organizationId: Yup.string().nullable().required('Required'),
  accessOrganizationId: Yup.string().nullable().required('Required'),
  company: Yup.string().required('Required'),
  contractor: Yup.string().nullable().required('Required'),
  contractorId: Yup.string().required('Required'),
  fromInstaller: Yup.string().nullable().required('Required'),
  toInstaller: Yup.string().nullable().required('Required'),
  fromStoreLocationId: Yup.string().nullable().required('Required'),
  toStoreLocationId: Yup.string().nullable().required('Required'),
  storeLocationId: Yup.string().nullable().required('Required'),
  installerStoreLocationId: Yup.string().nullable().required('Required'),
  accessStoreLocationId: Yup.string().nullable().required('Required'),
  fromStore: Yup.string().nullable().required('Required'),
  toStore: Yup.string().required('Required'),
  transporterName: Yup.string().required('Required'),
  customerSiteStoreId: Yup.string().nullable().required('Required'),
  toCustomerId: Yup.string().nullable().required('Required'),
  financialYear: Yup.string().required('Required'),
  user: Yup.string().required('Required'),
  accessUser: Yup.string().nullable().required('Required'),
  rightsFor: Yup.string().nullable().required('Required'),
  gaaLevelId: Yup.string().nullable().required('Required'),
  networkLevelId: Yup.string().nullable().required('Required'),
  server: Yup.string().required('Required'),
  port: Yup.string().required('Required'),
  encryption: Yup.string().required('Required'),
  requisitionNumber: Yup.string().nullable().required('Required'),
  password: Yup.string().required('Required'),
  transaction: Yup.string().nullable().required('Required'),
  serviceCenter: Yup.string().nullable().required('Required'),
  scrapLocation: Yup.string().nullable().required('Required'),
  effectiveFrom: Yup.string().required('Required'),
  effectiveTo: Yup.string().required('Required'),
  displayName: Yup.string().required('Required'),
  templateName: Yup.string().required('Required'),
  subject: Yup.string().required('Required'),
  from: Yup.string().required('Required'),
  to: Yup.array().min(1, 'Provide at least one Receiver Email'),
  supervisorNumber: Yup.string().required('Required'),
  attachmentsWhenIsAuthorized: Yup.string()
    .nullable()
    .when('authorizedUser', {
      is: (value) => value === 'true' || value === true,
      then: Yup.string().nullable().required('Required')
    }),
  requestNumber: Yup.string().required('Required'),
  remarks: Yup.string()
    .test('isLength', 'Length should not be more then 256 characters', (value) => !value || value?.length <= 256)
    .nullable(),
  bankName: Yup.string()
    .matches(/^[A-Za-z ]*$/, 'Please enter valid bank name')
    .required('Required'),
  ifscCode: Yup.string()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code')
    .required('IFSC code is required'),
  accountNumber: Yup.string()
    .matches(/^[0-9]{1,}$/, 'Please enter a valid account number')
    .required('Required'),
  endDate: () => Yup.string().required('Required'),
  startDateRange: (startRange, label1, label2) =>
    Yup.string()
      .required('Required')
      .test('date-comparison', `${label1} must be >= ${label2}`, function (value) {
        return dateComparison(value, startRange, false);
      }),
  endDateRange: (startRange, minRange, label1, label2, label3, ge) =>
    Yup.string()
      .required('Required')
      .test('date-comparison', `${label1} must be <= ${label2} and >= ${label3}`, function (value) {
        return dateComparisonV2(value, startRange, minRange, !ge);
      }),
  endDateRangeMax: (startRange, minRange, label1, label2, label3, ge) =>
    Yup.string()
      .required('Required')
      .test('date-comparison', `${label1} must be >= ${label2} and >= ${label3}`, function (value) {
        return dateComparisonV2(value, startRange, minRange, !ge);
      }),
  month: (label) =>
    Yup.number()
      .test(...isNonZero(label))
      .test(...isUptoTwoDecimalPlaces)
      .typeError(`Please enter valid ${label}`)
      .required('Required'),
  endMonthRange: (startRange, label1, label2) =>
    Yup.number()
      .test(...isNonZero(label1))
      .test(...isUptoTwoDecimalPlaces)
      .typeError(`Please enter valid ${label1}`)
      .required('Required')
      .max(startRange, `${label1} must be less than equal to ${label2}`),
  checkQty: (label) =>
    Yup.number()
      .test(...isNonZero(label))
      .test(...isUptoThreeDecimalPlaces)
      .typeError(`Please enter valid ${label}`)
      .required('Required'),
  checkForInteger: (qty, maxQuantity = undefined) =>
    maxQuantity || maxQuantity >= 0
      ? Yup.number()
          .nullable()
          .transform((value, originalValue) => (/^\s*$/.test(originalValue) ? null : value))
          .integer(`${qty} must be an integer`)
          .required('Required')
          .typeError(`${qty} must be an integer`)
          .min(1, `${qty} must be greater than 0`)
          .max(maxQuantity, `Maximum quantity allowed: ${maxQuantity || 0}.`)
          .required('Required')
      : Yup.number()
          .nullable()
          .transform((value, originalValue) => (/^\s*$/.test(originalValue) ? null : value))
          .integer(`${qty} must be an integer`)
          .required('Required')
          .typeError(`${qty} must be an integer`)
          .min(1, `${qty} must be greater than 0`)
          .required('Required'),
  priority: Yup.number()
    .typeError('Must be a number')
    .integer('Must be an integer')
    .min(0, 'Must be a non-negative number')
    .required('Required')
};

export default Validations;
