export default {
  API_HOST: process.env.REACT_APP_HOST || '',
  API_BASE: '/api',
  API_VERSION: '/v1',
  API: {
    SAMPLE: '/sample'
  }
};

export const REQUEST_TIMEOUT = 30000;

export const DEFAULT_ERROR = {
  message: 'Request has been failed',
  code: 500
};

export const TIMEOUT_ERROR = {
  message: 'Your request is failed due to timeout',
  code: 500
};

export const PAGINATION_CONST = {
  pageIndex: 1,
  pageSize: 25,
  sortBy: 'updatedAt',
  sortOrder: 'DESC'
};

export const RECAPTCHA_SITE_KEY = '6LczBkMpAAAAAJyfXq0coQtt8MGtwuiHjrzW4qMO';

export const OPERATORS = [
  {
    id: 'et',
    name: '='
  },
  {
    id: 'net',
    name: '!='
  },
  {
    id: 'gt',
    name: '>'
  },
  {
    id: 'lt',
    name: '<'
  },
  {
    id: 'gte',
    name: '>='
  },
  {
    id: 'lte',
    name: '<='
  }
];

// "appoval level column & resurvey column name change impact" - search this text

export const APPROVAL_LEVEL_COLUMNS = [
  {
    name: 'L* Approval Status',
    type: 'Dropdown',
    columnName: 'l_*_approval_status',
    columnType: 'uuid',
    isRequired: false,
    defaultAttributeId: 'c0a32dda-8a70-462d-a369-2ac8269565b6',
    properties: {
      sourceTable: '3f7a5e93-612f-4ea9-b1b3-0288d2bb863d',
      sourceColumn: '6eabd0dd-0724-40f4-9395-8ff5394cd7e3',
      dependency: '',
      extraColumn: '',
      editable: true,
      defaultHide: true,
      selectType: 'single',
      conditions: [],
      type: 'AND',
      approval: true
    }
  },
  {
    name: 'L* Exception Category',
    type: 'Dropdown',
    columnName: 'l_*_exception_ctg',
    columnType: 'uuid',
    isRequired: false,
    defaultAttributeId: 'c0a32dda-8a70-462d-a369-2ac8269565b6',
    properties: {
      sourceTable: '180a68c1-ea90-4af6-a98b-60544a4f9284',
      sourceColumn: '1eabd0dd-0724-40f4-9395-8ff5394cd7e3',
      dependency: '',
      extraColumn: '',
      editable: true,
      defaultHide: true,
      selectType: 'single',
      conditions: [],
      type: 'AND',
      approval: true
    }
  },
  {
    name: 'L* Exception Remark',
    type: 'Dropdown',
    columnName: 'l_*_exception_rmk',
    columnType: 'uuid',
    isRequired: false,
    defaultAttributeId: 'c0a32dda-8a70-462d-a369-2ac8269565b6',
    properties: {
      sourceTable: '3f7a5e93-612f-4ea9-b1b3-0288d2bb863d',
      sourceColumn: '6eabd0dd-0724-40f4-9395-8ff5394cd7e3',
      dependency: '',
      extraColumn: '',
      editable: true,
      defaultHide: true,
      selectType: 'single',
      conditions: [],
      type: 'AND',
      approval: true
    }
  },
  {
    name: 'L* Remark',
    type: 'Text',
    columnName: 'l_*_remark',
    columnType: 'text',
    isRequired: false,
    defaultAttributeId: 'd7268ee9-971a-42e5-bd23-235d86e8b0d9',
    properties: {
      editable: true,
      defaultHide: true,
      approval: true
    }
  },
  {
    name: 'L* Approver Name',
    type: 'Dropdown',
    columnName: 'l_*_approver_name',
    columnType: 'uuid',
    isRequired: false,
    defaultAttributeId: 'c0a32dda-8a70-462d-a369-2ac8269565b6',
    properties: {
      sourceTable: '4236c773-cb7e-4f33-821c-32338daa49dc',
      sourceColumn: 'cb14d5bc-d42e-4e78-8c3b-699308e034b2',
      dependency: '',
      extraColumn: '',
      editable: false,
      defaultHide: true,
      selectType: 'single',
      conditions: [],
      type: 'AND',
      approval: true
    }
  },
  {
    name: 'L* Approval Date',
    type: 'Date Time',
    columnName: 'l_*_approval_date',
    columnType: 'text',
    isRequired: false,
    defaultAttributeId: '866b2df6-706e-416a-8a29-90e779684be0',
    properties: {
      pickerType: 'dateTimeBoth',
      timeFormat: '12hour',
      captureCurrentDate: true,
      editable: false,
      defaultHide: true,
      approval: true
    }
  }
];

export const RESURVEY_COLUMNS = [
  {
    name: 'L1 Resurvey Action',
    type: 'Chip Select',
    columnName: 'is_resurvey',
    columnType: 'text',
    isRequired: false,
    defaultAttributeId: '9f9af2b6-1113-48e0-a5c5-0a34e2226937',
    properties: {
      values: 'YES,NO',
      defaultValue: '',
      defaultHide: true,
      approval: true
    }
  },
  {
    name: 'L1 Resurveyor Organization Type',
    type: 'Dropdown',
    columnName: 'resurveyor_org_type',
    columnType: 'uuid',
    isRequired: false,
    defaultAttributeId: 'c0a32dda-8a70-462d-a369-2ac8269565b6',
    properties: {
      sourceTable: '553e753f-1bce-476e-939f-1fd98d9daafd',
      sourceColumn: 'eb84241e-35bb-4b5a-948d-6b8ce55b5c24',
      dependency: '',
      extraColumn: '',
      editable: true,
      defaultHide: true,
      selectType: 'single',
      conditions: [
        {
          column: '29ea6177-c9ea-4449-9691-eff82800f7bf',
          operation: 'et',
          value: 'b2cb6cc5-7fba-410c-8ac0-294df90829f4'
        }
      ],
      type: 'AND',
      approval: true
    }
  },
  {
    name: 'L1 Resurveyor Organization',
    type: 'Dropdown',
    columnName: 'resurveyor_org_id',
    columnType: 'uuid',
    isRequired: false,
    defaultAttributeId: 'c0a32dda-8a70-462d-a369-2ac8269565b6',
    properties: {
      sourceTable: '4993b4e1-fe3a-4c84-9206-cddb3aee1dae',
      sourceColumn: '7b5cee77-ecbe-4f53-bcb1-a97b4a940bcb',
      dependency: '',
      extraColumn: '',
      editable: true,
      defaultHide: true,
      selectType: 'single',
      conditions: [],
      type: 'AND',
      approval: true
    }
  },
  {
    name: 'L1 Resurveyor Name',
    type: 'Dropdown',
    columnName: 'resurvey_by',
    columnType: 'uuid',
    isRequired: false,
    defaultAttributeId: 'c0a32dda-8a70-462d-a369-2ac8269565b6',
    properties: {
      sourceTable: '4236c773-cb7e-4f33-821c-32338daa49dc',
      sourceColumn: 'cb14d5bc-d42e-4e78-8c3b-699308e034b2',
      dependency: '',
      extraColumn: '',
      editable: true,
      defaultHide: true,
      selectType: 'single',
      conditions: [],
      type: 'AND',
      approval: true
    }
  }
];

// TICKET STATUS
export const TICKET_STATUS_TYPE_LIST = [
  {
    id: 'open',
    name: 'Open'
  },
  {
    id: 'assigned',
    name: 'Assigned'
  },
  {
    id: 'in-progress',
    name: 'In Progress'
  },
  {
    id: 'rejected',
    name: 'Rejected'
  },
  {
    id: 'on-hold',
    name: 'On Hold'
  },
  {
    id: 'resolved',
    name: 'Resolved'
  },
  {
    id: 'closed',
    name: 'Closed'
  }
];

export const TICKET_PRIORITY_LIST = [
  {
    id: 'high',
    name: 'High'
  },
  {
    id: 'medium',
    name: 'Medium'
  },
  {
    id: 'low',
    name: 'Low'
  }
];
