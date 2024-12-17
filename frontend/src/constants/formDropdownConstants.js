export const SOURCE_TABLES = [
  //gaa-level-entry
  {
    id: 'f38ec129-0b3f-4e9d-b1b3-cf0ea21688ee',
    tableIdCell: 'a1bfc8a2-9674-4940-bb43-19b6f600e674',
    name: 'GAA Level Entry',
    columns: [
      {
        id: 'b3bfc8a2-9674-4940-bb43-19b6f600e674',
        name: 'Level ID',
        isColumn: false,
        isCondition: false
      },
      {
        id: 'b3bfc8a2-9674-4940-bb43-19b6f600e674',
        name: 'Level Name',
        table: 'd4dc5b2c-8c9c-4bd9-93e3-f9f3d42f5cc7',
        cell: '8d3e6d07-8f5b-4942-afab-6b5be6594a89',
        idCell: '498f5b52-5b51-4c7e-a16d-113bcc47fc4e',
        isColumn: false,
        isCondition: true,
        conditionFunction: (id) => {
          return [{ column: '194f5b52-5b51-4c7e-a16d-113bcc47fc4e', operation: 'et', value: id }];
        }
      },
      {
        id: 'b8c68440-19de-4908-8362-d0d41b0c89a4',
        name: 'Entry Name',
        isColumn: true,
        isCondition: false
      },
      {
        id: 'b1bfc8a2-9674-4940-bb43-19b6f600e674',
        name: 'Entry Code',
        isColumn: true,
        isCondition: false
      },
      {
        id: 'a1bfc8a2-9674-4940-bb43-19b6f600e674',
        name: 'Entry ID',
        isColumn: false,
        isDep: true,
        isCondition: false
      },
      {
        id: 'a1bfc8a2-9674-4940-bb43-19b6f600e674',
        name: 'Entry Name',
        table: 'f38ec129-0b3f-4e9d-b1b3-cf0ea21688ee',
        cell: 'b8c68440-19de-4908-8362-d0d41b0c89a4',
        idCell: 'a1bfc8a2-9674-4940-bb43-19b6f600e674',
        isColumn: false,
        isCondition: true,
        conditionFunction: () => {
          return [];
        }
      },
      {
        id: 'b3bfc8a2-9674-4940-bb43-19b6f600e672',
        name: 'Parent ID',
        isColumn: false,
        isDep: true,
        isCondition: false
      }
    ]
  },
  //network-level-entry
  {
    id: 'efc06b18-43f9-4040-b09c-b15667de74b1',
    tableIdCell: '132b867c-eda3-44ce-8c2a-d04dc03ab3e7',
    name: 'Network Level Entry',
    columns: [
      {
        id: '337b367c-eda3-44ce-8c2a-d04dc03ab3e7',
        name: 'Level ID',
        isColumn: false,
        isCondition: false
      },
      {
        id: '337b367c-eda3-44ce-8c2a-d04dc03ab3e7',
        name: 'Level Name',
        table: 'd4dc5b2c-8c9c-4bd9-93e3-f9f3d42f5cc7',
        cell: '8d3e6d07-8f5b-4942-afab-6b5be6594a89',
        idCell: '498f5b52-5b51-4c7e-a16d-113bcc47fc4e',
        isColumn: false,
        isCondition: true,
        conditionFunction: (id) => {
          return [{ column: '194f5b52-5b51-4c7e-a16d-113bcc47fc4e', operation: 'et', value: id }];
        }
      },
      {
        id: '34607538-5f8f-4c59-81d7-d0638613ac45',
        name: 'Entry Name',
        isColumn: true,
        isCondition: false
      },
      {
        id: '137b867c-eda3-44ce-8c2a-d04dc03ab3e7',
        name: 'Entry Code',
        isColumn: true,
        isCondition: false
      },
      {
        id: '132b867c-eda3-44ce-8c2a-d04dc03ab3e7',
        name: 'Entry ID',
        isColumn: false,
        isDep: true,
        isCondition: false
      },
      {
        id: '132b867c-eda3-44ce-8c2a-d04dc03ab3e7',
        name: 'Entry Name',
        table: 'f38ec129-0b3f-4e9d-b1b3-cf0ea21688ee',
        cell: '34607538-5f8f-4c59-81d7-d0638613ac45',
        idCell: '132b867c-eda3-44ce-8c2a-d04dc03ab3e7',
        isColumn: false,
        isCondition: true,
        conditionFunction: () => {
          return [];
        }
      },
      {
        id: '337b367c-eda3-44ce-8c2a-d04dc03ab3e8',
        name: 'Parent ID',
        isColumn: false,
        isDep: true,
        isCondition: false
      }
    ]
  },
  //global-master-maker
  {
    id: '3a094270-e052-41f1-821a-236442b98303',
    tableIdCell: '1d61f0d9-ce90-47dd-a469-d428b11fcb1d',
    name: 'Global Master Maker',
    columns: [
      {
        id: '95622402-6212-4e80-8bb2-63589bc014e9',
        name: 'Master Name',
        isColumn: true,
        isCondition: false
      },
      {
        id: '1d61f0d9-ce90-47dd-a469-d428b11fcb1d',
        name: 'Master ID',
        isColumn: false,
        isDep: true,
        isCondition: false
      },
      {
        id: '1d61f0d9-ce90-47dd-a469-d428b11fcb1d',
        name: 'Master Name',
        table: '3a094270-e052-41f1-821a-236442b98303',
        cell: '95622402-6212-4e80-8bb2-63589bc014e9',
        idCell: '1d61f0d9-ce90-47dd-a469-d428b11fcb1d',
        isColumn: false,
        isCondition: true,
        conditionFunction: () => {
          return [];
        }
      }
    ]
  },
  //gloabl-master-maker-lov
  {
    id: '553e753f-1bce-476e-939f-1fd98d9daafd',
    tableIdCell: 'be91d676-9aff-4890-827f-7ba886bf04d8',
    name: 'Global Master LOV',
    columns: [
      {
        id: '29ea6177-c9ea-4449-9691-eff82800f7bf',
        name: 'Master ID',
        isColumn: false,
        isDep: true,
        isCondition: false
      },
      {
        id: '29ea6177-c9ea-4449-9691-eff82800f7bf',
        name: 'Master Name',
        table: '3a094270-e052-41f1-821a-236442b98303',
        cell: '95622402-6212-4e80-8bb2-63589bc014e9',
        idCell: '1d61f0d9-ce90-47dd-a469-d428b11fcb1d',
        isColumn: false,
        isCondition: true,
        conditionFunction: () => {
          return [];
        }
      },
      {
        id: 'be91d676-9aff-4890-827f-7ba886bf04d8',
        name: 'LOV ID',
        isColumn: false,
        isDep: true,
        isCondition: false
      },
      {
        id: 'be91d676-9aff-4890-827f-7ba886bf04d8',
        name: 'LOV Name',
        table: '553e753f-1bce-476e-939f-1fd98d9daafd',
        cell: 'eb84241e-35bb-4b5a-948d-6b8ce55b5c24',
        idCell: 'be91d676-9aff-4890-827f-7ba886bf04d8',
        isColumn: false,
        isCondition: true,
        conditionFunction: () => {
          return [];
        }
      },
      {
        id: 'eb84241e-35bb-4b5a-948d-6b8ce55b5c24',
        name: 'LOV Name',
        isColumn: true,
        isCondition: false
      }
    ]
  },
  //project-master-maker
  {
    id: '180a68c1-ea90-4af6-a98b-60544a4f9284',
    tableIdCell: '1e7bd0dd-0724-40f4-9395-8ff5394cd7e3',
    name: 'Project Master Maker',
    columns: [
      {
        id: '1eabd0dd-0724-40f4-9395-8ff5394cd7e3',
        name: 'Master Name',
        isColumn: true,
        isCondition: false
      },
      {
        id: '12abd0dd-0724-40f4-9395-8ff5394cd7e3',
        name: 'Project ID',
        isColumn: false,
        isCondition: false
      },
      {
        id: '1e7bd0dd-0724-40f4-9395-8ff5394cd7e3',
        name: 'Master ID',
        isColumn: false,
        isCondition: false
      },
      {
        id: '1e7bd0dd-0724-40f4-9395-8ff5394cd7e3',
        name: 'Master Name',
        table: '180a68c1-ea90-4af6-a98b-60544a4f9284',
        cell: '1eabd0dd-0724-40f4-9395-8ff5394cd7e3',
        idCell: '1e7bd0dd-0724-40f4-9395-8ff5394cd7e3',
        isColumn: false,
        isCondition: true,
        conditionFunction: (id) => {
          return [{ column: '12abd0dd-0724-40f4-9395-8ff5394cd7e3', operation: 'et', value: id }];
        }
      }
    ]
  },
  //project-master-maker-lov
  {
    id: '3f7a5e93-612f-4ea9-b1b3-0288d2bb863d',
    tableIdCell: '6eabd0dd-0724-40f4-9395-8ff5394cd7f3',
    name: 'Project Master LOV',
    columns: [
      {
        id: '6eabd0dd-0724-40f4-9395-8ff5394cd7e3',
        name: 'LOV Name',
        isColumn: true,
        isCondition: false
      },
      {
        id: '437b367c-eda3-44ce-8c2a-d04dc03ab3e6',
        name: 'Master ID',
        isColumn: false,
        isDep: true,
        isCondition: false
      },
      {
        id: '437b367c-eda3-44ce-8c2a-d04dc03ab3e6',
        name: 'Master Name',
        table: '180a68c1-ea90-4af6-a98b-60544a4f9284',
        cell: '1eabd0dd-0724-40f4-9395-8ff5394cd7e3',
        idCell: '1e7bd0dd-0724-40f4-9395-8ff5394cd7e3',
        isColumn: false,
        isCondition: true,
        conditionFunction: (id) => {
          return [{ column: '12abd0dd-0724-40f4-9395-8ff5394cd7e3', operation: 'et', value: id }];
        }
      },
      {
        id: '6eabd0dd-0724-40f4-9395-8ff5394cd7f3',
        name: 'LOV ID',
        isColumn: false,
        isDep: true,
        isCondition: false
      },
      {
        id: '6eabd0dd-0724-40f4-9395-8ff5394cd7f3',
        name: 'LOV Name',
        table: '3f7a5e93-612f-4ea9-b1b3-0288d2bb863d',
        cell: '6eabd0dd-0724-40f4-9395-8ff5394cd7e3',
        idCell: '6eabd0dd-0724-40f4-9395-8ff5394cd7f3',
        isColumn: false,
        isCondition: true,
        conditionFunction: () => {
          return [];
        }
      },
      {
        id: 'e7abd0dd-0724-40f4-9395-8ff5394cd7e3',
        name: 'LOV Code',
        isColumn: true,
        isCondition: false
      }
    ]
  },
  //qa-master-maker
  {
    id: '8109792c-c6f6-4b54-9e84-fff897900149',
    tableIdCell: '09282f60-5ed3-4a34-8768-fac57ce8d240',
    name: 'QA Master Maker',
    columns: [
      {
        id: 'b4ea9335-fafa-4adc-8479-d60d29b16dc4',
        name: 'Master Name',
        isColumn: true,
        isCondition: false
      },
      {
        id: 'b456d348-4c30-429f-b999-73ccbbd630fe',
        name: 'Project ID',
        isColumn: false,
        isCondition: false
      },
      {
        id: '09282f60-5ed3-4a34-8768-fac57ce8d240',
        name: 'Master ID',
        isColumn: false,
        isCondition: false
      },
      {
        id: '09282f60-5ed3-4a34-8768-fac57ce8d240',
        name: 'Master Name',
        table: '8109792c-c6f6-4b54-9e84-fff897900149',
        cell: 'b4ea9335-fafa-4adc-8479-d60d29b16dc4',
        idCell: '09282f60-5ed3-4a34-8768-fac57ce8d240',
        isColumn: false,
        isCondition: true,
        conditionFunction: (id) => {
          return [{ column: 'b456d348-4c30-429f-b999-73ccbbd630fe', operation: 'et', value: id }];
        }
      },
      {
        id: '294ae2f6-fdd6-4886-bc8a-6d4c67358744',
        name: 'Meter Type ID',
        isColumn: false,
        isCondition: false
      },
      {
        id: '294ae2f6-fdd6-4886-bc8a-6d4c67358744',
        name: 'Meter Type Name',
        table: '553e753f-1bce-476e-939f-1fd98d9daafd',
        cell: 'eb84241e-35bb-4b5a-948d-6b8ce55b5c24',
        idCell: 'be91d676-9aff-4890-827f-7ba886bf04d8',
        isColumn: false,
        isCondition: true,
        conditionFunction: () => {
          return [{ column: '29ea6177-c9ea-4449-9691-eff82800f7bf', operation: 'et', value: '0eba82dc-29af-4694-b943-af7d86fc686f' }];
        }
      }
    ]
  },
  //qa-master-maker-lov
  {
    id: '44d5b2b0-ec81-4ee6-acc2-0cfad4c703a2',
    tableIdCell: '2b40d6b3-8009-49de-9277-2a6e39cb1397',
    name: 'QA Master LOV',
    columns: [
      {
        id: '9d30bfc7-ff0b-4d7a-9e8f-6e58fa21d849',
        name: 'Major Contributor Name',
        isColumn: true,
        isCondition: false
      },
      {
        id: '8e64a78e-8183-4d1d-8552-800022acde5f',
        name: 'Master ID',
        isColumn: false,
        isDep: true,
        isCondition: false
      },
      {
        id: '8e64a78e-8183-4d1d-8552-800022acde5f',
        name: 'Master Name',
        table: '8109792c-c6f6-4b54-9e84-fff897900149',
        cell: 'b4ea9335-fafa-4adc-8479-d60d29b16dc4',
        idCell: '09282f60-5ed3-4a34-8768-fac57ce8d240',
        isColumn: false,
        isCondition: true,
        conditionFunction: (id) => {
          return [{ column: 'b456d348-4c30-429f-b999-73ccbbd630fe', operation: 'et', value: id }];
        }
      },
      {
        id: '2b40d6b3-8009-49de-9277-2a6e39cb1397',
        name: 'Major Contributor ID',
        isColumn: false,
        isDep: true,
        isCondition: false
      },
      {
        id: '2b40d6b3-8009-49de-9277-2a6e39cb1397',
        name: 'Major Contributor Name',
        table: '44d5b2b0-ec81-4ee6-acc2-0cfad4c703a2',
        cell: '9d30bfc7-ff0b-4d7a-9e8f-6e58fa21d849',
        idCell: '2b40d6b3-8009-49de-9277-2a6e39cb1397',
        isColumn: false,
        isCondition: true,
        conditionFunction: () => {
          return [];
        }
      },
      {
        id: 'cbb9584d-9fc6-46e0-95c2-a061f491705d',
        name: 'Major Contributor Code',
        isColumn: true,
        isCondition: false
      },
      {
        id: '50757854-92b9-450f-b0e9-e360980e72f2',
        name: 'Priority',
        isColumn: true,
        isCondition: false
      },
      {
        id: '0602328e-288a-4e46-931f-c2a83594f5e7',
        name: 'Defect',
        isColumn: true,
        isCondition: false
      }
    ]
  },
  //users
  {
    id: '4236c773-cb7e-4f33-821c-32338daa49dc',
    tableIdCell: '77bd1cbb-fa7d-454b-b359-4ceae1eb4291',
    name: 'Users',
    columns: [
      {
        id: 'cb14d5bc-d42e-4e78-8c3b-699308e034b2',
        name: 'User Name',
        isColumn: true,
        isCondition: false
      },
      {
        id: '77bd1cbb-fa7d-454b-b359-4ceae1eb4291',
        name: 'User ID',
        isColumn: false,
        isCondition: false
      },
      {
        id: '77bd1cbb-fa7d-454b-b359-4ceae1eb4291',
        name: 'User Name',
        table: '4236c773-cb7e-4f33-821c-32338daa49dc',
        cell: 'cb14d5bc-d42e-4e78-8c3b-699308e034b2',
        idCell: '77bd1cbb-fa7d-454b-b359-4ceae1eb4291',
        isColumn: false,
        isCondition: true,
        conditionFunction: () => {
          return [];
        }
      },
      {
        id: '2d5c62cf-32ec-40dc-af0d-4b0b0a7c7e5a',
        name: 'Organization Type ID',
        isColumn: false,
        isCondition: false
      },
      {
        id: 'a0d8e590-5c28-4454-858e-7a91ab7cd2fa',
        name: 'Organization Name ID',
        isColumn: false,
        isDep: true,
        isCondition: false
      }
    ]
  },
  //organization
  {
    id: '4993b4e1-fe3a-4c84-9206-cddb3aee1dae',
    tableIdCell: '0d3fa265-d395-4a09-9d30-772c6d0ae45a',
    name: 'Organization',
    columns: [
      {
        id: '7b5cee77-ecbe-4f53-bcb1-a97b4a940bcb',
        name: 'Organization Name',
        isColumn: true,
        isCondition: false
      },
      {
        id: '0d3fa265-d395-4a09-9d30-772c6d0ae45c',
        name: 'Organization Type ID',
        isColumn: false,
        isDep: true,
        isCondition: false
      },
      {
        id: '0d3fa265-d395-4a09-9d30-772c6d0ae45c',
        name: 'Organization Type',
        table: '553e753f-1bce-476e-939f-1fd98d9daafd',
        cell: 'eb84241e-35bb-4b5a-948d-6b8ce55b5c24',
        idCell: 'be91d676-9aff-4890-827f-7ba886bf04d8',
        isColumn: false,
        isCondition: false, // make it true if needed
        conditionFunction: () => {
          return [{ column: '29ea6177-c9ea-4449-9691-eff82800f7bf', operation: 'et', value: 'b2cb6cc5-7fba-410c-8ac0-294df90829f4' }];
        }
      },
      {
        id: '0d3fa265-d395-4a09-9d30-772c6d0ae45a',
        name: 'Organization ID',
        table: '4993b4e1-fe3a-4c84-9206-cddb3aee1dae',
        cell: '7b5cee77-ecbe-4f53-bcb1-a97b4a940bcb',
        idCell: '0d3fa265-d395-4a09-9d30-772c6d0ae45a',
        isColumn: false,
        isCondition: false,
        conditionFunction: () => {
          return [];
        }
      }
    ]
  },
  //serialize
  {
    id: '2bfda55d-d007-4c75-b696-5ee05ef1ec66',
    tableIdCell: '',
    name: 'Serialize Material',
    columns: [
      {
        id: '11411549-19df-48e2-8073-bdeb064e99d4',
        name: 'Material ID',
        isColumn: false,
        isCondition: false
      },
      {
        id: '11411549-19df-48e2-8073-bdeb064e99d4',
        name: 'Material Name',
        table: 'f3d13141-3cba-489d-9987-5f72a3e345c4',
        cell: '1af33948-9a71-414c-b59f-03fb4813fa8a',
        idCell: '5b7dbdef-abac-4710-8214-8f3abb501696',
        isColumn: false,
        isCondition: true,
        conditionFunction: () => {
          return [];
        }
      },
      {
        id: '11bfad18-e3df-42b4-b2b5-295b245ac85b',
        name: 'Serial Number',
        isColumn: true,
        isDep: true,
        isCondition: false
      },
      {
        id: 'aca8818c-ecd2-4615-8a0c-99980c078678',
        name: 'Parent ID',
        isDep: true,
        isColumn: false,
        isCondition: false
      }
    ]
  }
  //material-type
  // {
  //   id: '02cc1fdc-0c8b-4cf9-9977-34fed65601e7',
  //   tableIdCell: '',
  //   name: 'Serialize Material Type',
  //   columns: [
  //     {
  //       id: '74821e0c-cab8-4f10-a81d-be8f2a059627',
  //       name: 'Serial Number',
  //       isColumn: false,
  //       isDep: true,
  //       isCondition: false
  //     },
  //     {
  //       id: '9400c842-b286-4ff3-8e3c-702bf689ecec',
  //       name: 'Material Type ID',
  //       isColumn: true,
  //       isDep: true,
  //       isCondition: false
  //     }
  //   ]
  // }
];
