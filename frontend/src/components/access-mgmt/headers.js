export const Headers = [
  {
    Header: 'Organization Type',
    accessor: 'master_maker_lov.name'
  },
  {
    Header: 'Organization Name',
    accessor: 'organization.name'
  },
  {
    Header: 'Name',
    accessor: 'name'
  },
  {
    Header: 'Role',
    accessor: 'role.name'
  },
  {
    Header: 'Code',
    accessor: 'code'
  },
  {
    Header: 'Email',
    accessor: 'email'
  },
  {
    Header: 'Mobile Number',
    accessor: 'mobileNumber'
  },
  {
    Header: 'Address',
    accessor: 'address'
  },
  {
    Header: 'Country',
    accessor: 'city.state.country.name'
  },
  {
    Header: 'State',
    accessor: 'city.state.name'
  },
  {
    Header: 'City',
    accessor: 'city.name'
  },
  {
    Header: 'Pincode',
    accessor: 'pinCode'
  },
  {
    Header: 'Status',
    accessor: 'status',
    exportAccessor: 'isActive'
  },
  {
    Header: 'Updated On',
    accessor: 'updatedAt'
  },
  {
    Header: 'Updated By',
    accessor: 'updatedBy'
  },
  {
    Header: 'Created On',
    accessor: 'createdAt'
  },
  {
    Header: 'Created By',
    accessor: 'createdBy'
  }
];

export const MainHeaders = [
  {
    Header: 'Name',
    accessor: 'visibleName'
  },
  {
    Header: 'Actions',
    accessor: 'actions'
  },
  {
    Header: 'Row-Column',
    accessor: 'show'
  }
];

export const DataHeaders = {
  Country: [
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Code',
      accessor: 'code'
    }
  ],
  State: [
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Code',
      accessor: 'code'
    }
  ],
  City: [
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Code',
      accessor: 'code'
    }
  ]
};
