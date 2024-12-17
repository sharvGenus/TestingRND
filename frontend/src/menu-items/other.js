// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  TableOutlined,
  UserOutlined,
  FormOutlined,
  FileDoneOutlined,
  SettingOutlined,
  KeyOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  ProfileOutlined,
  SendOutlined
} from '@ant-design/icons';

// icons
const icons = {
  TableOutlined,
  UserOutlined,
  FormOutlined,
  ProfileOutlined,
  FileDoneOutlined,
  SettingOutlined,
  KeyOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  SendOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const other = [
  ...[
    {
      id: 'dashboards-group',
      type: 'group',
      children: [
        {
          id: 'dashboards-group',
          title: <FormattedMessage id="dashboards-group" />,
          type: 'collapse',
          icon: icons.DashboardOutlined,
          children: [
            {
              id: 'supervisor-dashboard',
              title: <FormattedMessage id="supervisor-dashboard" />,
              type: 'item',
              url: '/supervisor-dashboard'
            },
            {
              id: 'inventory-dashboard',
              title: <FormattedMessage id="inventory-dashboard" />,
              type: 'item',
              url: '/inventory-dashboard'
            },
            {
              id: 'project-summary-dashboard',
              title: <FormattedMessage id="project-summary-dashboard" />,
              type: 'item',
              url: '/project-summary-dashboard'
            },
            {
              id: 'contractor-dashboard',
              title: <FormattedMessage id="contractor-dashboard" />,
              type: 'item',
              url: '/contractor-dashboard'
            },
            {
              id: 'executive-dashboard',
              title: <FormattedMessage id="executive-dashboard" />,
              type: 'item',
              url: '/executive-dashboard'
            },
            {
              id: 'exception-dashboard',
              title: <FormattedMessage id="exception-dashboard" />,
              type: 'item',
              url: '/exception-dashboard'
            },
            {
              id: 'area-wise-progress-dashboard',
              title: <FormattedMessage id="area-wise-progress-dashboard" />,
              type: 'item',
              url: '/area-wise-progress-dashboard'
            },
            {
              id: 'ticket-status-dashboard',
              title: <FormattedMessage id="ticket-status-dashboard" />,
              type: 'item',
              url: '/ticket-status-dashboard'
            }
          ]
        }
      ]
    },
    {
      id: 'reports-group',
      type: 'group',
      children: [
        {
          id: 'reports-group',
          title: <FormattedMessage id="reports-group" />,
          type: 'collapse',
          icon: icons.BarChartOutlined,
          children: [
            {
              id: 'survey-reports-collapse',
              title: <FormattedMessage id="survey-reports-collapse" />,
              type: 'item',
              url: '/survey-reports',
              param: 'Survey',
              ctg: '1d75feca-2e64-4b95-900d-fcd53446ddeb'
            },
            {
              id: 'meter-installation-reports-collapse',
              title: <FormattedMessage id="meter-installation-reports-collapse" />,
              type: 'item',
              url: '/installation-reports',
              param: 'Installation',
              ctg: '30ea8a65-ff5b-4bff-b1a1-892204e23669'
            },
            {
              id: 'o&m-reports-collapse',
              title: <FormattedMessage id="o&m-reports-collapse" />,
              type: 'item',
              url: '/o&m-reports',
              param: 'O&M',
              ctg: '30ea8a65-ff5b-4bff-b1a1-892204e23669'
            },
            {
              id: 'qa-reports-collapse',
              title: <FormattedMessage id="qa-reports-collapse" />,
              type: 'item',
              url: '/qa-reports',
              param: 'QA',
              ctg: '080000d8-9337-4f5a-b60a-4b3ceb7cd6d5'
            },
            {
              id: 'inventory-reports-collapse',
              title: <FormattedMessage id="inventory-reports-collapse" />,
              type: 'collapse',
              children: [
                {
                  id: 'aging-of-material',
                  title: <FormattedMessage id="aging-of-material" />,
                  type: 'item',
                  url: '/aging-of-material'
                },
                {
                  id: 'contractor-report',
                  title: <FormattedMessage id="contractor-report" />,
                  type: 'item',
                  url: '/contractor-report'
                },
                {
                  id: 'document-wise-report',
                  title: <FormattedMessage id="document-wise-report" />,
                  type: 'item',
                  url: '/document-wise-report'
                },
                {
                  id: 'stock-report',
                  title: <FormattedMessage id="stock-report" />,
                  type: 'item',
                  url: '/stock-report'
                },
                {
                  id: 'store-wise-material-summary-report',
                  title: <FormattedMessage id="store-wise-material-summary-report" />,
                  type: 'item',
                  url: '/store-wise-material-summary-report'
                },
                {
                  id: 'contractor-wise-material-summary-report',
                  title: <FormattedMessage id="contractor-wise-material-summary-report" />,
                  type: 'item',
                  url: '/contractor-wise-material-summary-report'
                },
                {
                  id: 'supervisor-wise-material-status-report',
                  title: <FormattedMessage id="supervisor-wise-material-status-report" />,
                  type: 'item',
                  url: '/supervisor-wise-material-status-report'
                },
                {
                  id: 'installer-wise-material-status-report',
                  title: <FormattedMessage id="installer-wise-material-status-report" />,
                  type: 'item',
                  url: '/installer-wise-material-status-report'
                },
                {
                  id: 'material-grn-report',
                  title: <FormattedMessage id="material-grn-report" />,
                  type: 'item',
                  url: '/material-grn-report'
                }
              ]
            },
            {
              id: 'productivity-collapse',
              title: <FormattedMessage id="productivity-collapse" />,
              type: 'collapse',
              children: [
                {
                  id: 'productivity-summary-report',
                  title: <FormattedMessage id="productivity-summary-report" />,
                  type: 'item',
                  url: '/productivity-summary-report'
                },
                {
                  id: 'date-wise-productivity-report',
                  title: <FormattedMessage id="date-wise-productivity-report" />,
                  type: 'item',
                  url: '/date-wise-productivity-report'
                },
                {
                  id: 'area-wise-productivity-report',
                  title: <FormattedMessage id="area-wise-productivity-report" />,
                  type: 'item',
                  url: '/area-wise-productivity-report'
                },
                {
                  id: 'user-wise-productivity-report',
                  title: <FormattedMessage id="user-wise-productivity-report" />,
                  type: 'item',
                  url: '/user-wise-productivity-report'
                }
              ]
            },
            {
              id: 'qa-and-validation-collapse',
              title: <FormattedMessage id="qa-and-validation-collapse" />,
              type: 'collapse',
              children: [
                {
                  id: 'validation-status-report',
                  title: <FormattedMessage id="validation-status-report" />,
                  type: 'item',
                  url: '/validation-status-report'
                },
                {
                  id: 'user-wise-validation_status_report',
                  title: <FormattedMessage id="user-wise-validation_status_report" />,
                  type: 'item',
                  url: '/user-wise-validation_status_report'
                }
              ]
            },
            {
              id: 'ticket-reports',
              title: <FormattedMessage id="ticket-reports" />,
              type: 'collapse',
              children: [
                {
                  id: 'supervisor-wise-report',
                  title: <FormattedMessage id="supervisor-wise-report" />,
                  type: 'item',
                  url: '/ticket-supervisor-wise-report'
                },
                {
                  id: 'installer-wise-report',
                  title: <FormattedMessage id="installer-wise-report" />,
                  type: 'item',
                  url: '/ticket-installer-wise-report'
                },
                {
                  id: 'ticket-status-wise-report',
                  title: <FormattedMessage id="ticket-status-wise-report" />,
                  type: 'item',
                  url: '/ticket-status-wise-report'
                }
              ]
            },
            {
              id: 'gaa-and-network-hierarchy-report',
              title: <FormattedMessage id="gaa-and-network-hierarchy-report" />,
              type: 'item',
              url: '/gaa-and-network-hierarchy-report'
            },
            {
              id: 'mdm-data-sync-report',
              title: <FormattedMessage id="mdm-data-sync-report" />,
              type: 'item',
              url: '/mdm-data-sync-report'
            },
            {
              id: 'customer-reports',
              title: <FormattedMessage id="customer-reports" />,
              type: 'collapse',
              children: [
                {
                  id: 'wc-consumer-survey-report',
                  title: <FormattedMessage id="wc-consumer-survey-report" />,
                  type: 'item',
                  url: window.location.origin.includes('uatwfm')
                    ? `/customer-reports/295bd0e9-63d2-4983-a115-4721a15b6ac4/WC Consumer Survey/true/preprodReport`
                    : `/customer-reports/3c279a10-f26f-4ade-b12f-6032ea8e5a91/WC Consumer Survey/true/wcConsumerSurveyReport`
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  {
    id: 'user-role-management',
    type: 'group',
    children: [
      {
        id: 'user-role-management',
        title: <FormattedMessage id="user-role-management" />,
        type: 'collapse',
        icon: icons.UserOutlined,
        children: [
          {
            id: 'user-master',
            title: <FormattedMessage id="user-master" />,
            type: 'item',
            url: '/all-users'
          },
          {
            id: 'role-master',
            title: <FormattedMessage id="role-master" />,
            type: 'item',
            url: '/roles'
          },
          {
            id: 'permission-master',
            title: <FormattedMessage id="permission-master" />,
            type: 'item',
            url: '/permissions'
          },
          {
            id: 'access-management',
            title: <FormattedMessage id="access-management" />,
            type: 'collapse',
            children: [
              {
                id: 'menu-masters',
                title: <FormattedMessage id="menu-masters" />,
                type: 'item',
                url: '/menu-masters'
              },
              {
                id: 'access-form-responses',
                title: <FormattedMessage id="access-form-responses" />,
                type: 'item',
                url: '/access-form-responses'
              }
            ]
          },
          {
            id: 'new-gaa-hierarachy-master',
            title: <FormattedMessage id="new-gaa-hierarachy-master" />,
            type: 'item',
            url: '/gaa-network-area-allocation'
          },
          {
            id: 'work-area-allocation-master',
            title: <FormattedMessage id="work-area-allocation-master" />,
            type: 'item',
            url: '/work-area-allocation'
          },
          {
            id: 'supervisor-assignment-master',
            title: <FormattedMessage id="supervisor-assignment-master" />,
            type: 'item',
            url: '/supervisor-assignment'
          }
        ]
      }
    ]
  },
  {
    id: 'master-management',
    type: 'group',
    children: [
      {
        id: 'master-management',
        title: <FormattedMessage id="master-management" />,
        type: 'collapse',
        icon: icons.TableOutlined,
        children: [
          {
            id: 'gaa-network-menu',
            title: <FormattedMessage id="gaa-network-menu" />,
            type: 'collapse',
            children: [
              {
                id: 'country-master',
                title: <FormattedMessage id="country-master" />,
                type: 'item',
                url: '/country-master'
              },
              {
                id: 'state-master',
                title: <FormattedMessage id="state-master" />,
                type: 'item',
                url: '/state-master'
              },
              {
                id: 'city-master',
                title: <FormattedMessage id="city-master" />,
                type: 'item',
                url: '/city-master'
              },
              {
                id: 'gaa-master',
                title: <FormattedMessage id="gaa-master" />,
                type: 'item',
                url: '/gaa-master'
              },
              {
                id: 'gaa-level-entry-master',
                title: <FormattedMessage id="gaa-level-entry-master" />,
                type: 'item',
                url: '/gaa-level-entry-master'
              },
              {
                id: 'network-master',
                title: <FormattedMessage id="network-master" />,
                type: 'item',
                url: '/network-master'
              },
              {
                id: 'network-level-entry-master',
                title: <FormattedMessage id="network-level-entry-master" />,
                type: 'item',
                url: '/network-level-entry-master'
              }
            ]
          },
          {
            id: 'rural-urban-menu',
            title: <FormattedMessage id="rural-urban-menu" />,
            type: 'collapse',
            children: [
              {
                id: 'rural-master',
                title: <FormattedMessage id="rural-master" />,
                type: 'item',
                url: '/rural-master'
              },
              {
                id: 'rural-level-entry-master',
                title: <FormattedMessage id="rural-level-entry-master" />,
                type: 'item',
                url: '/rural-level-entry-master'
              },
              {
                id: 'urban-master',
                title: <FormattedMessage id="urban-master" />,
                type: 'item',
                url: '/urban-master'
              },
              {
                id: 'urban-level-entry-master',
                title: <FormattedMessage id="urban-level-entry-master" />,
                type: 'item',
                url: '/urban-level-entry-master'
              }
            ]
          },
          {
            id: 'organization-menu',
            title: <FormattedMessage id="organization-menu" />,
            type: 'collapse',
            children: [
              {
                id: 'company-master',
                title: <FormattedMessage id="company-master" />,
                type: 'item',
                url: '/company-master',
                param: 'Company'
              },
              {
                id: 'firm-master',
                title: <FormattedMessage id="firm-master" />,
                type: 'item',
                url: '/contractor-master',
                param: 'Contractor'
              },
              {
                id: 'supplier-master',
                title: <FormattedMessage id="supplier-master" />,
                type: 'item',
                url: '/supplier-master',
                param: 'Supplier'
              },
              {
                id: 'customer-master',
                title: <FormattedMessage id="customer-master" />,
                type: 'item',
                url: '/customer-master',
                param: 'Customer'
              },
              {
                id: 'customer-department-master',
                title: <FormattedMessage id="customer-department-master" />,
                type: 'item',
                url: '/customer-department-master'
              },
              {
                id: 'customer-designation-master',
                title: <FormattedMessage id="customer-designation-master" />,
                type: 'item',
                url: '/customer-designation-master'
              }
            ]
          },
          {
            id: 'location-store-menu',
            title: <FormattedMessage id="location-store-menu" />,
            type: 'collapse',
            children: [
              {
                id: 'firm-location-master',
                title: <FormattedMessage id="firm-location-master" />,
                type: 'item',
                url: '/contractor-location-master',
                param: 'Contractor'
              },
              {
                id: 'company-location-master',
                title: <FormattedMessage id="company-location-master" />,
                type: 'item',
                url: '/company-location-master',
                param: 'Company'
              },
              {
                id: 'firm-store-master',
                title: <FormattedMessage id="firm-store-master" />,
                type: 'item',
                url: '/contractor-store-master',
                param: 'Contractor'
              },
              {
                id: 'company-store-master',
                title: <FormattedMessage id="company-store-master" />,
                type: 'item',
                url: '/company-store-master',
                param: 'Company'
              },
              {
                id: 'customer-store-master',
                title: <FormattedMessage id="customer-store-master" />,
                type: 'item',
                url: '/customer-store-master',
                param: 'Customer'
              },
              {
                id: 'supplier-repair-center-master',
                title: <FormattedMessage id="supplier-repair-center-master" />,
                type: 'item',
                url: '/supplier-repair-center-master',
                param: 'Supplier'
              },
              {
                id: 'firm-store-location-master',
                title: <FormattedMessage id="firm-store-location-master" />,
                type: 'item',
                url: '/contractor-store-location-master',
                param: 'Contractor'
              },
              {
                id: 'company-store-location-master',
                title: <FormattedMessage id="company-store-location-master" />,
                type: 'item',
                url: '/company-store-location-master',
                param: 'Company'
              }
            ]
          },
          {
            id: 'project-master',
            title: <FormattedMessage id="project-master" />,
            type: 'item',
            url: '/project-master'
          },
          {
            id: 'project-scope',
            title: <FormattedMessage id="project-scope" />,
            type: 'item',
            url: '/project-scope'
          },
          {
            id: 'daily-execution-plan',
            title: <FormattedMessage id="daily-execution-plan" />,
            type: 'item',
            url: '/daily-execution-plan'
          },
          {
            id: 'approver-master',
            title: <FormattedMessage id="approver-master" />,
            type: 'item',
            url: '/approver-master'
          },
          {
            id: 'approver-dashboard',
            title: <FormattedMessage id="approver-dashboard" />,
            type: 'item',
            url: '/approver-dashboard'
          },
          {
            id: 'material-master',
            title: <FormattedMessage id="material-master" />,
            type: 'item',
            url: '/material-master'
          },
          {
            id: 'master-maker-menu',
            title: <FormattedMessage id="master-maker-menu" />,
            type: 'collapse',
            children: [
              {
                id: 'master-maker',
                title: <FormattedMessage id="master-maker" />,
                type: 'item',
                url: '/master-maker'
              },
              {
                id: 'master-maker-lov',
                title: <FormattedMessage id="master-maker-lov" />,
                type: 'item',
                url: '/master-maker-lov'
              },
              {
                id: 'project-wise-master-maker',
                title: <FormattedMessage id="project-wise-master-maker" />,
                type: 'item',
                url: '/project-wise-master-maker'
              },
              {
                id: 'project-wise-master-lov',
                title: <FormattedMessage id="project-wise-master-lov" />,
                type: 'item',
                url: '/project-wise-master-lov'
              },
              {
                id: 'qa-master-maker',
                title: <FormattedMessage id="qa-master-maker" />,
                type: 'item',
                url: '/qa-master-maker'
              },
              {
                id: 'qa-master-lov',
                title: <FormattedMessage id="qa-master-lov" />,
                type: 'item',
                url: '/qa-master-lov'
              }
            ]
          },
          {
            id: 'transaction-type-range',
            title: <FormattedMessage id="transaction-type-range" />,
            type: 'item',
            url: '/transaction-type-range'
          },
          {
            id: 'bill-submission',
            title: <FormattedMessage id="bill-submission" />,
            type: 'item',
            url: '/bill-submission'
          },
          {
            id: 'billing-approver-dashboard',
            title: <FormattedMessage id="billing-approver-dashboard" />,
            type: 'item',
            url: '/billing-approver-dashboard'
          }
        ]
      }
    ]
  },
  {
    id: 'inventory-menu',
    type: 'group',
    children: [
      {
        id: 'inventory-menu',
        title: <FormattedMessage id="inventory-menu" />,
        type: 'collapse',
        icon: icons.FileDoneOutlined,
        children: [
          {
            id: 'stock-ledger',
            title: <FormattedMessage id="stock-ledger" />,
            type: 'item',
            url: '/stock-ledger'
          },
          // {
          //   id: 'smtp-configuration',
          //   title: <FormattedMessage id="smtp-configuration" />,
          //   type: 'item',
          //   url: '/smtp-configuration'
          // },
          // {
          //   id: 'purchase-order',
          //   title: <FormattedMessage id="purchase-order" />,
          //   type: 'item',
          //   url: '/purchase-order'
          // },
          {
            id: 'email-templates',
            title: <FormattedMessage id="email-templates" />,
            type: 'item',
            url: '/email-templates'
          },
          {
            id: 'transaction-management',
            title: <FormattedMessage id="transaction-management" />,
            type: 'collapse',
            children: [
              {
                id: 'grn-collapse',
                title: <FormattedMessage id="grn-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'create-grn',
                    title: <FormattedMessage id="create-grn" />,
                    type: 'item',
                    url: '/grn'
                  },
                  {
                    id: 'grn-receipt',
                    title: <FormattedMessage id="grn-receipt" />,
                    type: 'item',
                    url: '/grn-receipt'
                  },
                  {
                    id: 'cancel-grn',
                    title: <FormattedMessage id="cancel-grn" />,
                    type: 'item',
                    url: '/cancel-grn'
                  }
                ]
              },
              {
                id: 'mrf-collapse',
                title: <FormattedMessage id="mrf-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'create-mrf',
                    title: <FormattedMessage id="create-mrf" />,
                    type: 'item',
                    url: '/mrf'
                  },
                  {
                    id: 'mrf-receipt',
                    title: <FormattedMessage id="mrf-receipt" />,
                    type: 'item',
                    url: '/mrf-receipt'
                  },
                  {
                    id: 'cancel-mrf',
                    title: <FormattedMessage id="cancel-mrf" />,
                    type: 'item',
                    url: '/cancel-mrf'
                  }
                ]
              },
              {
                id: 'min-collapse',
                title: <FormattedMessage id="min-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'create-min',
                    title: <FormattedMessage id="create-min" />,
                    type: 'item',
                    url: '/min'
                  },
                  {
                    id: 'min-receipt',
                    title: <FormattedMessage id="min-receipt" />,
                    type: 'item',
                    url: '/min-receipt'
                  },
                  {
                    id: 'cancel-min',
                    title: <FormattedMessage id="cancel-min" />,
                    type: 'item',
                    url: '/cancel-min'
                  }
                ]
              },

              {
                id: 'cti-collapse',
                title: <FormattedMessage id="cti-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'cti',
                    title: <FormattedMessage id="cti" />,
                    type: 'item',
                    url: '/cti'
                  }
                ]
              },

              {
                id: 'iti-collapse',
                title: <FormattedMessage id="iti-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'iti',
                    title: <FormattedMessage id="iti" />,
                    type: 'item',
                    url: '/iti'
                  }
                ]
              },

              {
                id: 'itc-collapse',
                title: <FormattedMessage id="itc-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'itc',
                    title: <FormattedMessage id="itc" />,
                    type: 'item',
                    url: '/itc'
                  }
                ]
              },

              {
                id: 'mrr-collapse',
                title: <FormattedMessage id="mrr-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'create-mrr',
                    title: <FormattedMessage id="create-mrr" />,
                    type: 'item',
                    url: '/mrr'
                  },
                  {
                    id: 'mrr-receipt',
                    title: <FormattedMessage id="mrr-receipt" />,
                    type: 'item',
                    url: '/mrr-receipt'
                  },
                  {
                    id: 'cancel-mrr',
                    title: <FormattedMessage id="cancel-mrr" />,
                    type: 'item',
                    url: '/cancel-mrr'
                  }
                ]
              },

              {
                id: 'mrn-collapse',
                title: <FormattedMessage id="mrn-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'create-mrn',
                    title: <FormattedMessage id="create-mrn" />,
                    type: 'item',
                    url: '/mrn'
                  },
                  {
                    id: 'mrn-receipt',
                    title: <FormattedMessage id="mrn-receipt" />,
                    type: 'item',
                    url: '/mrn-receipt'
                  },
                  {
                    id: 'cancel-mrn',
                    title: <FormattedMessage id="cancel-mrn" />,
                    type: 'item',
                    url: '/cancel-mrn'
                  }
                ]
              },

              {
                id: 'return-mrn-collapse',
                title: <FormattedMessage id="return-mrn-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'create-return-mrn',
                    title: <FormattedMessage id="create-return-mrn" />,
                    type: 'item',
                    url: '/return-mrn'
                  },
                  {
                    id: 'return-mrn-receipt',
                    title: <FormattedMessage id="return-mrn-receipt" />,
                    type: 'item',
                    url: '/return-mrn-receipt'
                  },
                  {
                    id: 'cancel-return-mrn',
                    title: <FormattedMessage id="cancel-return-mrn" />,
                    type: 'item',
                    url: '/cancel-return-mrn'
                  }
                ]
              },

              {
                id: 'ltl-collapse',
                title: <FormattedMessage id="ltl-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'ltl',
                    title: <FormattedMessage id="ltl" />,
                    type: 'item',
                    url: '/ltl'
                  },
                  {
                    id: 'ltl-receipt',
                    title: <FormattedMessage id="ltl-receipt" />,
                    type: 'item',
                    url: '/ltl-receipt'
                  },
                  {
                    id: 'cancel-ltl',
                    title: <FormattedMessage id="cancel-ltl" />,
                    type: 'item',
                    url: '/cancel-ltl'
                  }
                ]
              },

              {
                id: 'stsrc-collapse',
                title: <FormattedMessage id="stsrc-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'stsrc',
                    title: <FormattedMessage id="stsrc" />,
                    type: 'item',
                    url: '/stsrc'
                  },
                  {
                    id: 'stsrc-receipt',
                    title: <FormattedMessage id="stsrc-receipt" />,
                    type: 'item',
                    url: '/stsrc-receipt'
                  },
                  {
                    id: 'cancel-stsrc',
                    title: <FormattedMessage id="cancel-stsrc" />,
                    type: 'item',
                    url: '/cancel-stsrc'
                  }
                ]
              },

              {
                id: 'srcts-collapse',
                title: <FormattedMessage id="srcts-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'srcts',
                    title: <FormattedMessage id="srcts" />,
                    type: 'item',
                    url: '/srcts'
                  },
                  {
                    id: 'srcts-receipt',
                    title: <FormattedMessage id="srcts-receipt" />,
                    type: 'item',
                    url: '/srcts-receipt'
                  },
                  {
                    id: 'cancel-srcts',
                    title: <FormattedMessage id="cancel-srcts" />,
                    type: 'item',
                    url: '/cancel-srcts'
                  }
                ]
              },

              {
                id: 'str-collapse',
                title: <FormattedMessage id="str-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'str',
                    title: <FormattedMessage id="str" />,
                    type: 'item',
                    url: '/str'
                  },
                  {
                    id: 'str-receipt',
                    title: <FormattedMessage id="str-receipt" />,
                    type: 'item',
                    url: '/str-receipt'
                  },
                  {
                    id: 'cancel-str',
                    title: <FormattedMessage id="cancel-str" />,
                    type: 'item',
                    url: '/cancel-str'
                  }
                ]
              },

              {
                id: 'sto-collapse',
                title: <FormattedMessage id="sto-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'sto',
                    title: <FormattedMessage id="sto" />,
                    type: 'item',
                    url: '/sto'
                  },
                  {
                    id: 'sto-receipt',
                    title: <FormattedMessage id="sto-receipt" />,
                    type: 'item',
                    url: '/sto-receipt'
                  },
                  {
                    id: 'cancel-sto',
                    title: <FormattedMessage id="cancel-sto" />,
                    type: 'item',
                    url: '/cancel-sto'
                  }
                ]
              },

              {
                id: 'sto-grn-collapse',
                title: <FormattedMessage id="sto-grn-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'sto-grn',
                    title: <FormattedMessage id="sto-grn" />,
                    type: 'item',
                    url: '/sto-grn'
                  },
                  {
                    id: 'sto-grn-receipt',
                    title: <FormattedMessage id="sto-grn-receipt" />,
                    type: 'item',
                    url: '/sto-grn-receipt'
                  },
                  {
                    id: 'cancel-sto-grn',
                    title: <FormattedMessage id="cancel-sto-grn" />,
                    type: 'item',
                    url: '/cancel-sto-grn'
                  }
                ]
              },

              {
                id: 'stc-collapse',
                title: <FormattedMessage id="stc-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'stc',
                    title: <FormattedMessage id="stc" />,
                    type: 'item',
                    url: '/stc'
                  },
                  {
                    id: 'stc-receipt',
                    title: <FormattedMessage id="stc-receipt" />,
                    type: 'item',
                    url: '/stc-receipt'
                  },
                  {
                    id: 'cancel-stc',
                    title: <FormattedMessage id="cancel-stc" />,
                    type: 'item',
                    url: '/cancel-stc'
                  }
                ]
              },

              {
                id: 'cts-collapse',
                title: <FormattedMessage id="cts-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'cts',
                    title: <FormattedMessage id="cts" />,
                    type: 'item',
                    url: '/cts'
                  },
                  {
                    id: 'cts-receipt',
                    title: <FormattedMessage id="cts-receipt" />,
                    type: 'item',
                    url: '/cts-receipt'
                  }
                ]
              },

              // {
              //   id: 'ptpr-collapse',
              //   title: <FormattedMessage id="ptpr-collapse" />,
              //   type: 'collapse',
              //   children: [
              //     {
              //       id: 'ptp-request',
              //       title: <FormattedMessage id="ptp-request" />,
              //       type: 'item',
              //       url: '/ptpr'
              //     },
              //     {
              //       id: 'ptpr-receipt',
              //       title: <FormattedMessage id="ptpr-receipt" />,
              //       type: 'item',
              //       url: '/ptpr-receipt'
              //     },
              //     {
              //       id: 'cancel-ptpr',
              //       title: <FormattedMessage id="cancel-ptpr" />,
              //       type: 'item',
              //       url: '/cancel-ptpr'
              //     }
              //   ]
              // },

              {
                id: 'ptp-collapse',
                title: <FormattedMessage id="ptp-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'ptp',
                    title: <FormattedMessage id="ptp" />,
                    type: 'item',
                    url: '/ptp'
                  },
                  {
                    id: 'ptp-receipt',
                    title: <FormattedMessage id="ptp-receipt" />,
                    type: 'item',
                    url: '/ptp-receipt'
                  },
                  {
                    id: 'cancel-ptp',
                    title: <FormattedMessage id="cancel-ptp" />,
                    type: 'item',
                    url: '/cancel-ptp'
                  }
                ]
              },
              {
                id: 'ptp-grn-collapse',
                title: <FormattedMessage id="ptp-grn-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'ptp-grn',
                    title: <FormattedMessage id="ptp-grn" />,
                    type: 'item',
                    url: '/ptp-grn'
                  },
                  {
                    id: 'ptp-grn-receipt',
                    title: <FormattedMessage id="ptp-grn-receipt" />,
                    type: 'item',
                    url: '/ptp-grn-receipt'
                  },
                  {
                    id: 'cancel-ptp-grn',
                    title: <FormattedMessage id="cancel-ptp-grn" />,
                    type: 'item',
                    url: '/cancel-ptp-grn'
                  }
                ]
              },

              {
                id: 'consumption-request-collapse',
                title: <FormattedMessage id="consumption-request-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'consumption-request',
                    title: <FormattedMessage id="consumption-request" />,
                    type: 'item',
                    url: '/consumption-request'
                  },
                  {
                    id: 'consumption-request-receipt',
                    title: <FormattedMessage id="consumption-request-receipt" />,
                    type: 'item',
                    url: '/consumption-request-receipt'
                  }
                ]
              },

              {
                id: 'consumption-collapse',
                title: <FormattedMessage id="consumption-collapse" />,
                type: 'collapse',
                children: [
                  {
                    id: 'consumption',
                    title: <FormattedMessage id="consumption" />,
                    type: 'item',
                    url: '/consumption'
                  },
                  {
                    id: 'consumption-receipt',
                    title: <FormattedMessage id="consumption-receipt" />,
                    type: 'item',
                    url: '/consumption-receipt'
                  }
                ]
              }
            ]
          },
          {
            id: 'reports',
            title: <FormattedMessage id="reports" />,
            type: 'collapse',
            children: [
              {
                id: 'delivery-challan-report',
                title: <FormattedMessage id="delivery-challan-report" />,
                type: 'item',
                url: '/delivery-challan-report'
              },
              {
                id: 'contractor-reconciliation-report',
                title: <FormattedMessage id="contractor-reconciliation-report" />,
                type: 'item',
                url: '/contractor-reconciliation-report'
              },
              {
                id: 'dashboard-report',
                title: <FormattedMessage id="dashboard-report" />,
                type: 'item',
                url: '/dashboard-report'
              },
              {
                id: 'store-dashboard',
                title: <FormattedMessage id="store-dashboard" />,
                type: 'item',
                url: '/store-dashboard'
              },
              {
                id: 'material-serial-number-report',
                title: <FormattedMessage id="material-serial-number-report" />,
                type: 'item',
                url: '/material-serial-number-report'
              }
            ]
          },
          {
            id: 'bom',
            title: <FormattedMessage id="bom" />,
            type: 'collapse',
            children: [
              {
                id: 'material-quantity',
                title: <FormattedMessage id="material-quantity" />,
                type: 'item',
                url: '/material-quantity'
              },
              {
                id: 'contractor-limit',
                title: <FormattedMessage id="contractor-limit" />,
                type: 'item',
                url: '/contractor-limit'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'form-management',
    type: 'group',
    children: [
      {
        id: 'form-management',
        title: <FormattedMessage id="form-management" />,
        type: 'item',
        icon: icons.FormOutlined,
        url: '/form-configurator'
      }
    ]
  },
  {
    id: 'form-responses',
    type: 'group',
    children: [
      {
        id: 'form-responses',
        title: <FormattedMessage id="form-responses" />,
        type: 'item',
        icon: icons.ProfileOutlined,
        url: '/form-responses'
      }
    ]
  },
  {
    id: 'helpdesk-tickets',
    type: 'group',
    children: [
      {
        id: 'helpdesk-tickets',
        title: <FormattedMessage id="helpdesk-tickets" />,
        type: 'collapse',
        icon: icons.DatabaseOutlined,
        children: [
          {
            id: 'configure-ticket',
            title: <FormattedMessage id="configure-ticket" />,
            type: 'item',
            url: '/ticket-configurator'
          },
          {
            id: 'configure-escalation',
            title: <FormattedMessage id="configure-escalation" />,
            type: 'item',
            url: '/configure-escalation'
          },
          {
            id: 'configure-email-template',
            title: <FormattedMessage id="configure-email-template" />,
            type: 'item',
            url: '/configure-email-template'
          },
          {
            id: 'create-ticket',
            title: <FormattedMessage id="create-ticket" />,
            type: 'item',
            url: '/tickets'
          },
          {
            id: 'my-tickets',
            title: <FormattedMessage id="my-tickets" />,
            type: 'item',
            url: '/my-tickets'
          }
        ]
      }
    ]
  },
  {
    id: 'devolution-collapse',
    type: 'group',
    children: [
      {
        id: 'devolution-collapse',
        title: <FormattedMessage id="devolution-collapse" />,
        type: 'collapse',
        icon: icons.SendOutlined,
        children: [
          {
            id: 'create-devolution',
            title: <FormattedMessage id="create-devolution" />,
            type: 'item',
            url: '/devolution'
          },
          {
            id: 'devolution-view',
            title: <FormattedMessage id="devolution-view" />,
            type: 'item',
            url: '/devolution-view'
          },
          {
            id: 'devolution-configurator',
            title: <FormattedMessage id="devolution-configurator" />,
            type: 'item',
            url: '/devolution-configurator'
          },
          {
            id: 'devolution-approver',
            title: <FormattedMessage id="devolution-approver" />,
            type: 'item',
            url: '/devolution-approver'
          }
        ]
      }
    ]
  },
  {
    id: 'settings-menu',
    type: 'group',
    children: [
      {
        id: 'settings-menu',
        title: <FormattedMessage id="settings-menu" />,
        type: 'collapse',
        icon: icons.SettingOutlined,
        children: [
          {
            id: 'smtp-configuration',
            title: <FormattedMessage id="smtp-configuration" />,
            type: 'item',
            url: '/smtp-configuration'
          }
        ]
      }
    ]
  }
];

export default other;
