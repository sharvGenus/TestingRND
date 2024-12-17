export const ticketTableColumns = [
  {
    Header: 'Ticket Number',
    accessor: 'updatedTicketNumber',
    exportAccessor: 'ticketNumber'
  },
  {
    Header: 'Form',
    accessor: (list) => list?.['form']?.name
  },
  {
    Header: 'Status',
    accessor: (list) => list?.['ticketStatus']?.toUpperCase(),
    exportAccessor: 'ticketStatus'
  },
  {
    Header: 'Priority',
    accessor: (list) => list?.['priority']?.toUpperCase(),
    exportAccessor: 'priority'
  },
  {
    Header: 'Description',
    accessor: 'description'
  },
  {
    Header: 'Assigned Supervisor',
    accessor: (list) => (list?.['supervisor_obj'] ? `${list?.['supervisor_obj']?.['name']}-${list?.['supervisor_obj']?.['code']}` : '-'),
    exportAccessor: 'supervisor_obj'
  },
  {
    Header: 'Assigned O&M Engineer',
    accessor: (list) => (list?.['assignee'] ? `${list?.['assignee']?.['name']}-${list?.['assignee']?.['code']}` : '-'),
    exportAccessor: 'assignee'
  },
  {
    Header: 'Issue Type',
    accessor: 'issue.name'
  },
  {
    Header: 'Issue Sub Type',
    accessor: 'sub_issue.name'
  },
  {
    Header: 'Mobile Number',
    accessor: 'mobileNumber'
  },
  {
    Header: 'Remarks',
    accessor: 'remarks'
  },
  {
    Header: 'Assignee Remarks',
    accessor: 'assigneeRemarks'
  },
  {
    Header: 'Created By',
    accessor: 'created.name'
  },
  {
    Header: 'Created On',
    accessor: 'createdAt'
  },
  {
    Header: 'Updated By',
    accessor: 'updated.name'
  },
  {
    Header: 'Updated On',
    accessor: 'updatedAt'
  },
  {
    Header: 'Source',
    accessor: ({ ticketSource }) => ticketSource?.toUpperCase(),
    exportAccessor: 'ticketSource'
  }
];

export const ticketHistoryTableColumns = [
  {
    Header: 'Status',
    accessor: (list) => list?.['ticketStatus']?.toUpperCase()
  },
  {
    Header: 'Priority',
    accessor: (list) => list?.['priority']?.toUpperCase()
  },
  {
    Header: 'Description',
    accessor: 'description'
  },
  {
    Header: 'Assigned Supervisor',
    accessor: (list) =>
      list?.['supervisor_object'] ? `${list?.['supervisor_object']?.['name']}-${list?.['supervisor_object']?.['code']}` : '-'
  },
  {
    Header: 'Assigned O&M Engineer',
    accessor: (list) => (list?.['assignee_obj'] ? `${list?.['assignee_obj']?.['name']}-${list?.['assignee_obj']?.['code']}` : '-')
  },
  {
    Header: 'Issue Type',
    accessor: 'issue_obj.name'
  },
  {
    Header: 'Issue Sub Type',
    accessor: 'sub_issue_obj.name'
  },
  {
    Header: 'Remarks',
    accessor: 'remarks'
  },
  {
    Header: 'Assignee Remarks',
    accessor: 'assigneeRemarks'
  },
  {
    Header: 'Mobile Number',
    accessor: 'mobileNumber'
  },
  {
    Header: 'Updated By',
    accessor: 'updated.name'
  },
  {
    Header: 'Updated On',
    accessor: 'updatedAt'
  }
];

export const ticketFilterByDate = [
  {
    label: 'All',
    id: 'all'
  },
  {
    label: 'Today',
    id: '0'
  },
  {
    label: '1 Days Old',
    id: '1'
  },
  {
    label: '2 Days Old',
    id: '2'
  },
  {
    label: '3 Days Old',
    id: '3'
  },
  {
    label: '5 Days Old',
    id: '5'
  },
  {
    label: '7 Days Old',
    id: '7'
  },
  {
    label: 'More than 7 Days Old',
    id: '8',
    type: 'error'
  }
];
