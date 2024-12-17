const Headers = {
  stockHeaders: [
    {
      Header: 'Store',
      accessor: 'store.name'
    },
    {
      Header: 'Material',
      accessor: 'material.name'
    },
    {
      Header: 'Material Code',
      accessor: 'material.code'
    },
    {
      Header: 'QTY',
      accessor: 'quantity'
    },
    {
      Header: 'UOM',
      accessor: 'uom.name'
    },
    {
      Header: 'Rate',
      accessor: 'rate'
    },
    // {
    //   Header: 'Tax %',
    //   accessor: 'tax'
    // },
    {
      Header: 'Value',
      accessor: 'value'
    }
    // {
    //   Header: 'Serial Number',
    //   accessor: 'material.isSerialNumber'
    // }
  ],
  stockExpandedHeaders: [
    {
      Header: 'Store Location',
      accessor: 'storeLocation.name'
    },
    {
      Header: 'Material Name',
      accessor: 'material.name'
    },
    {
      Header: 'Material Code',
      accessor: 'material.code'
    },
    {
      Header: 'QTY',
      accessor: 'quantity'
    },
    {
      Header: 'UOM',
      accessor: 'uom.name'
    },
    {
      Header: 'Rate',
      accessor: 'rate'
    },
    // {
    //   Header: 'Tax %',
    //   accessor: 'tax'
    // },
    {
      Header: 'Value',
      accessor: 'value'
    }
  ],
  installerHeaders: [
    {
      Header: 'Installer',
      accessor: 'installer.name'
    },
    {
      Header: 'Material Name',
      accessor: 'material.name'
    },
    {
      Header: 'Material Code',
      accessor: 'material.code'
    },
    {
      Header: 'QTY',
      accessor: 'quantity'
    },
    {
      Header: 'UOM',
      accessor: 'uom.name'
    },
    {
      Header: 'Rate',
      accessor: 'rate'
    },
    // {
    //   Header: 'Tax %',
    //   accessor: 'tax'
    // },
    {
      Header: 'Value',
      accessor: 'value'
    }
  ],
  viewHeaders: [
    {
      Header: 'Movement Type',
      accessor: 'transaction_type.name'
    },
    // {
    //   Header: 'MovementType Code',
    //   accessor: 'transaction_type.code'
    // },
    {
      Header: 'Document No',
      accessor: 'referenceDocumentNumber'
    },
    {
      Header: 'Material Code',
      accessor: 'material.code'
    },
    {
      Header: 'Material Name',
      accessor: 'material.name'
    },
    {
      Header: 'Store Location',
      accessor: 'organization_store_location.name'
    },
    {
      Header: 'QTY',
      accessor: 'quantity'
    },
    {
      Header: 'UOM',
      accessor: 'uom.name'
    },
    {
      Header: 'Rate',
      accessor: 'rate'
    },
    // {
    //   Header: 'Tax %',
    //   accessor: 'tax'
    // },
    {
      Header: 'Value',
      accessor: 'value'
    },
    {
      Header: 'Vendor Name',
      accessor: 'vendorName'
    },
    {
      Header: 'Vendor Code',
      accessor: 'vendorCode'
    },
    {
      Header: 'Store',
      accessor: 'vendorStoreName'
    },
    // {
    //   Header: 'Other Location',
    //   accessor: 'other_store_location.name'
    // },
    // {
    //   Header: 'Cancel No',
    //   accessor: 'cancelRefDocNo'
    // },
    {
      Header: 'Request Number',
      accessor: 'requestNumber'
    },
    {
      Header: 'CreatedBy',
      accessor: 'created.name'
    },
    {
      Header: 'Date & Time',
      accessor: 'createdAt'
    }
  ],
  serialHeaders: [
    {
      Header: 'SR No.',
      accessor: 'nos'
    },
    // {
    //   Header: 'Name',
    //   accessor: 'name'
    // },
    {
      Header: 'Serial Number',
      accessor: 'serialNo'
    },
    {
      Header: 'Status',
      accessor: 'status',
      exportAccessor: 'isActive'
    }
  ]
};

export default Headers;
