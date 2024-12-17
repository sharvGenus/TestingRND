import { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import Filterable from 'components/Filterable';

// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const MetabaseEmbed = Loadable(lazy(() => import('pages/metabase-embed')));
const AddInventoryMapping = Loadable(lazy(() => import('pages/form-configurator/add-inventory-data-mapping')));
const AddDataMapping = Loadable(lazy(() => import('pages/form-configurator/add-new-data-mapping')));
const EditWorkAreaAllocation = Loadable(lazy(() => import('pages/extra-pages/work-area-allocation/edit-area-allocation')));
const AssignNewSupervisor = Loadable(lazy(() => import('pages/extra-pages/supervisor-assignment/create-new-supervisor')));
const CreateNewForm = Loadable(lazy(() => import('pages/form-configurator/create-new-form')));
const AddNewPayload = Loadable(lazy(() => import('pages/form-configurator/add-new-payload')));
const AddNewAuth = Loadable(lazy(() => import('pages/form-configurator/add-new-auth')));
const AddValidationRule = Loadable(lazy(() => import('pages/form-configurator/add-new-validation')));
const AddIntegrationRule = Loadable(lazy(() => import('pages/form-configurator/add-new-integration')));
const ShowValidationRules = Loadable(lazy(() => import('pages/form-configurator/form-validation-rules')));
const ShowVisibilityRule = Loadable(lazy(() => import('pages/form-configurator/form-visibility-rules')));
const ShowIntegrationRules = Loadable(lazy(() => import('pages/form-configurator/form-integration-rules')));
const FormConfigurator = Loadable(lazy(() => import('pages/form-configurator/form-configurator')));
const FormResponses = Loadable(lazy(() => import('pages/form-configurator/form-responses')));
const FormResponseData = Loadable(lazy(() => import('pages/form-configurator/responses/form-response-data')));
const FormResponseEdit = Loadable(lazy(() => import('pages/form-configurator/responses/form-response-edit')));
const AddVisibilityRule = Loadable(lazy(() => import('pages/form-configurator/add-new-visibility')));
const ProjectSiteStore = Loadable(lazy(() => import('pages/extra-pages/project-site-store')));
const LocationSiteStore = Loadable(lazy(() => import('pages/extra-pages/location-site-store')));
const StockLedger = Loadable(lazy(() => import('pages/extra-pages/stock-ledger')));
const GRN = Loadable(lazy(() => import('pages/extra-pages/grn/create-new-grn')));
const GRNReceipt = Loadable(lazy(() => import('pages/receipts/grn-receipt')));
const MRF = Loadable(lazy(() => import('pages/extra-pages/mrf')));
const MIN = Loadable(lazy(() => import('pages/extra-pages/min/create-new-min')));
const MRFReceipt = Loadable(lazy(() => import('pages/receipts/mrf-receipt')));
const MINReceipt = Loadable(lazy(() => import('pages/receipts/min-receipt')));
const STSRCReceipt = Loadable(lazy(() => import('pages/receipts/stsrc-receipt')));
const SRCTSReceipt = Loadable(lazy(() => import('pages/receipts/srcts-receipt')));
const STOGRNReceipt = Loadable(lazy(() => import('pages/receipts/sto-grn-receipt')));
const WorkAreaAllocation = Loadable(lazy(() => import('pages/extra-pages/work-area-allocation')));
const GaaNetworkHierarchyRights = Loadable(lazy(() => import('pages/extra-pages/gaa-network-area-allocation')));
const EditGaaNetworkHierarchyRights = Loadable(
  lazy(() => import('pages/extra-pages/gaa-network-area-allocation/edit-gaa-network-area-allocation'))
);
const MaterialTransferToStore = Loadable(lazy(() => import('pages/extra-pages/store-to-store-material-transfer')));
const STOReceipt = Loadable(lazy(() => import('pages/receipts/sto-receipt')));
const LTLReceipt = Loadable(lazy(() => import('pages/receipts/ltl-receipt')));
const SupervisorAssignment = Loadable(lazy(() => import('pages/extra-pages/supervisor-assignment')));
const MaterialTransferProjectToProject = Loadable(lazy(() => import('pages/extra-pages/project-to-project-material-transfer/index')));
const MaterialTransferProjectToProjectGrn = Loadable(
  lazy(() => import('pages/extra-pages/project-to-project-grn-material-transfer/index'))
);
const PTPReceipt = Loadable(lazy(() => import('pages/receipts/ptp-receipt')));
const PTPGRNReceipt = Loadable(lazy(() => import('pages/receipts/ptp-grn-receipt')));
const MaterialTransferContractorToInstaller = Loadable(lazy(() => import('pages/extra-pages/contractor-to-installer-material-transfer')));
const MaterialTransferInstallerToInstaller = Loadable(lazy(() => import('pages/extra-pages/installer-to-installer-material-transfer')));
const MaterialTransferPSSToCustomer = Loadable(lazy(() => import('pages/extra-pages/pss-to-customer-material-transfer')));
const MaterialTransferCustomerToPSS = Loadable(lazy(() => import('pages/extra-pages/customer-to-pss-material-transfer')));
const StoGRN = Loadable(lazy(() => import('pages/extra-pages/sto-grn')));
const MRR = Loadable(lazy(() => import('pages/extra-pages/mrr')));
const MRRReceipt = Loadable(lazy(() => import('pages/receipts/mrr-receipt')));
const MRN = Loadable(lazy(() => import('pages/extra-pages/mrn/create-new-mrn')));
const RETURNMRN = Loadable(lazy(() => import('pages/extra-pages/return-mrn/create-new-return-mrn')));
const MRNReceipt = Loadable(lazy(() => import('pages/receipts/mrn-receipt')));
const CancelGRN = Loadable(lazy(() => import('pages/extra-pages/cancelGrn/create-new-cancel-grn')));
const CancelMIN = Loadable(lazy(() => import('pages/extra-pages/cancelMin/create-new-cancel-min')));
const CancelSTO = Loadable(lazy(() => import('pages/extra-pages/cancelSto/create-new-cancel-sto')));
const STCReceipt = Loadable(lazy(() => import('pages/receipts/stc-receipt')));
const CTSReceipt = Loadable(lazy(() => import('pages/receipts/cts-receipt')));
const ConsumptionRequestReceipt = Loadable(lazy(() => import('pages/receipts/consumption-request-receipt')));
const ConsumptionReceipt = Loadable(lazy(() => import('pages/receipts/consumption-receipt')));
const CancelLTL = Loadable(lazy(() => import('pages/extra-pages/cancelLtl/create-new-cancel-ltl')));
const CancelPTP = Loadable(lazy(() => import('pages/extra-pages/cancelPtp/create-new-cancel-ptp')));
const CancelPTPGRN = Loadable(lazy(() => import('pages/extra-pages/cancelPtpGrn/create-new-cancel-ptp-grn')));
const CancelSTC = Loadable(lazy(() => import('pages/extra-pages/cancelStc/create-new-cancel-stc')));
const CancelMRF = Loadable(lazy(() => import('pages/extra-pages/cancelMrf/create-new-cancel-mrf')));
const CancelSTOGRN = Loadable(lazy(() => import('pages/extra-pages/cancelStoGrn/create-new-cancel-sto-grn')));
const CancelMRR = Loadable(lazy(() => import('pages/extra-pages/cancelMrr/create-new-cancel-mrr')));
const CancelMRN = Loadable(lazy(() => import('pages/extra-pages/cancelMrn/create-new-cancel-mrn')));
const CancelSTSRC = Loadable(lazy(() => import('pages/extra-pages/cancelStsrc/create-new-cancel-stsrc')));
const CancelSRCTS = Loadable(lazy(() => import('pages/extra-pages/cancelSrcts/create-new-cancel-srcts')));
const CancelReturnMRN = Loadable(lazy(() => import('pages/extra-pages/cancelReturnMrn/create-new-cancel-return-mrn')));
const STR = Loadable(lazy(() => import('pages/extra-pages/str')));
const LTL = Loadable(lazy(() => import('pages/extra-pages/location-to-location-material-transfer')));
const STSRC = Loadable(lazy(() => import('pages/extra-pages/stsrc')));
const SRCTS = Loadable(lazy(() => import('pages/extra-pages/src-to-store')));
const PurchaseOrder = Loadable(lazy(() => import('pages/extra-pages/purchase-order')));
const ApproverDashboard = Loadable(lazy(() => import('pages/extra-pages/approver-dashboard')));
const EmailTemplates = Loadable(lazy(() => import('pages/extra-pages/email-templates')));
const SmtpConfiguraton = Loadable(lazy(() => import('pages/extra-pages/smtp-configuration')));
const DeliveryChallanReport = Loadable(lazy(() => import('pages/gmisp-reports/delivery-challan-report')));
const ContractorReconciliationReport = Loadable(lazy(() => import('pages/gmisp-reports/contractor-reconciliation-report')));
const StoreDashboard = Loadable(lazy(() => import('pages/gmisp-reports/store-dashboard')));
const MaterialSerialNumberReport = Loadable(lazy(() => import('pages/gmisp-reports/material-serial-number-report')));
const SupervisorMaterialStatusReport = Loadable(lazy(() => import('pages/gmisp-reports/supervisor-wise-material-status-report')));
const DashboardReport = Loadable(lazy(() => import('pages/gmisp-reports/dashboard-report')));
const STRReceipt = Loadable(lazy(() => import('pages/receipts/str-receipt')));
const CancelSTR = Loadable(lazy(() => import('pages/cancel-transactions/cancelStr')));
const AccessManagement = Loadable(lazy(() => import('pages/access-management')));
const AccessManagementForm = Loadable(lazy(() => import('pages/access-management/form')));
const MaterialQuantity = Loadable(lazy(() => import('pages/extra-pages/bom/set-material-quantity')));
const ContractorLimit = Loadable(lazy(() => import('pages/extra-pages/bom/set-contractor-limit')));
const ReturnMRNReceipt = Loadable(lazy(() => import('pages/receipts/return-mrn-receipt')));
const Tickets = Loadable(lazy(() => import('pages/helpdesk/tickets/index')));
const MyTickets = Loadable(lazy(() => import('pages/helpdesk/my-tickets/index')));
const Configurator = Loadable(lazy(() => import('pages/helpdesk/configurator/index')));
const ConfigureEscalation = Loadable(lazy(() => import('pages/helpdesk/configure-escalation/index')));
const ConfigureEmailTemplate = Loadable(lazy(() => import('pages/helpdesk/configure-email-template/index')));
const ConsumptionRequest = Loadable(lazy(() => import('pages/extra-pages/consumption-request')));
const Consumption = Loadable(lazy(() => import('pages/extra-pages/consumption')));
const Devolution = Loadable(lazy(() => import('pages/extra-pages/devolution')));
const InstallerToContractor = Loadable(lazy(() => import('pages/extra-pages/installer-to-contractor')));

// pages with filtering
const DevolutionView = Filterable(Loadable(lazy(() => import('pages/receipts/devolution-view'))));
const DevolutionConfigurator = Filterable(Loadable(lazy(() => import('pages/extra-pages/devolution-configurator'))));
const DevolutionApprover = Filterable(Loadable(lazy(() => import('pages/extra-pages/devolution-approver-dashboard'))));
const Role = Filterable(Loadable(lazy(() => import('pages/extra-pages/roles-and-permissions/roles/index'))));
const Permissions = Filterable(Loadable(lazy(() => import('pages/extra-pages/roles-and-permissions/permissions/index'))));
const Users = Filterable(Loadable(lazy(() => import('pages/extra-pages/users'))));
const ApproverMasterPage = Filterable(Loadable(lazy(() => import('pages/extra-pages/approver'))));
const CityMasterPage = Filterable(Loadable(lazy(() => import('pages/extra-pages/city'))));
const CountryMasterPage = Filterable(Loadable(lazy(() => import('pages/extra-pages/country'))));
const CustomerDepartment = Filterable(Loadable(lazy(() => import('pages/extra-pages/customer-department'))));
const CustomerDesignation = Filterable(Loadable(lazy(() => import('pages/extra-pages/customer-designation'))));
const GAA = Filterable(Loadable(lazy(() => import('pages/extra-pages/gaa'))));
const MasterMakerLovPage = Filterable(Loadable(lazy(() => import('pages/extra-pages/master-maker-lov'))));
const MasterMakerPage = Filterable(Loadable(lazy(() => import('pages/extra-pages/master-maker'))));
const Material = Filterable(Loadable(lazy(() => import('pages/extra-pages/material'))));
const OrganizationLocation = Filterable(Loadable(lazy(() => import('pages/extra-pages/organization-location'))));
const OrganizationStoreLocation = Filterable(Loadable(lazy(() => import('pages/extra-pages/organization-store-location'))));
const OrganizationStore = Filterable(Loadable(lazy(() => import('pages/extra-pages/organization-store'))));
const Organization = Filterable(Loadable(lazy(() => import('pages/extra-pages/organization'))));
const ProjectMasterMakerLovPage = Filterable(Loadable(lazy(() => import('pages/extra-pages/project-master-maker-lov'))));
const ProjectMasterMakerPage = Filterable(Loadable(lazy(() => import('pages/extra-pages/project-master-maker'))));
const QAMasterMakerLovPage = Filterable(Loadable(lazy(() => import('pages/extra-pages/qa-master-maker-lov'))));
const QAMasterMakerPage = Filterable(Loadable(lazy(() => import('pages/extra-pages/qa-master-maker'))));
const ProjectMasterPage = Filterable(Loadable(lazy(() => import('pages/extra-pages/project'))));
const StateMasterPage = Filterable(Loadable(lazy(() => import('pages/extra-pages/state'))));
const CreateNewTransactionType = Filterable(Loadable(lazy(() => import('pages/extra-pages/transaction-type-range'))));
const FormResponsePage = Filterable(Loadable(lazy(() => import('pages/form-configurator/responses/form-response-list'))));
const GAALevelEntry = Filterable(Loadable(lazy(() => import('pages/extra-pages/gaa-level-entry'))));
const NetworkLevelEntry = Filterable(Loadable(lazy(() => import('pages/extra-pages/network-level-entry'))));
const Network = Filterable(Loadable(lazy(() => import('pages/extra-pages/network'))));
const BillRaiseScreen = Loadable(lazy(() => import('pages/extra-pages/billing-section/bill-raise-screen')));
const ApproverForBiling = Loadable(lazy(() => import('pages/extra-pages/billing-section/billing-approver/index')));
const AgingOfMaterialReport = Loadable(lazy(() => import('pages/gmisp-reports/aging-of-material')));
const DateWiseProductivityReport = Loadable(lazy(() => import('pages/gmisp-reports/date-wise-productivity-report')));
const ValidationStatusReport = Loadable(lazy(() => import('pages/gmisp-reports/validation-status-report')));
const UserWiseValidationStatusReport = Loadable(lazy(() => import('pages/gmisp-reports/user-wise-validation-status-report')));
const AreaWiseProductivityReport = Loadable(lazy(() => import('pages/gmisp-reports/area-wise-productivity-report')));
const UserWiseProductivityReport = Loadable(lazy(() => import('pages/gmisp-reports/user-wise-productivity-report')));
const GaaAndNetworkHierarchyReport = Loadable(lazy(() => import('pages/gmisp-reports/gaa-and-network-hierarchy')));
const MdmDataSyncReport = Loadable(lazy(() => import('pages/gmisp-reports/mdm-data-sync-report')));
const ContractorWiseMaterialSummary = Loadable(lazy(() => import('pages/gmisp-reports/contractor-wise-material-summary-report/index')));
const StockReport = Loadable(lazy(() => import('pages/gmisp-reports/report-for-stock')));
const StoreWiseMaterialReport = Loadable(lazy(() => import('pages/gmisp-reports/store-wise-material-report')));
const DocumentWiseReport = Loadable(lazy(() => import('pages/gmisp-reports/document-wise-report')));
const ProjectScope = Loadable(lazy(() => import('pages/extra-pages/project-scope')));
const DailyExecutionPlan = Loadable(lazy(() => import('pages/extra-pages/daily-execution-plan')));
const ExecutiveDashboard = Loadable(lazy(() => import('pages/dashboards/executive-dashboard')));
const ExceptionDashboard = Loadable(lazy(() => import('pages/dashboards/exception-dashboard')));
const AreaWiseProgressDashboard = Loadable(lazy(() => import('pages/dashboards/area-wise-progress-dashboard')));
const TicketStatusDashboard = Loadable(lazy(() => import('pages/dashboards/ticket-status-dashboard')));
const TicketAssignByWiseReport = Loadable(lazy(() => import('pages/gmisp-reports/ticket-reports/ticket-assignby-wise-report')));
const TicketStatusWiseReport = Loadable(lazy(() => import('pages/gmisp-reports/ticket-reports/ticket-status-wise-report')));
const ContractorDashboard = Loadable(lazy(() => import('pages/dashboards/contractor-dashboard')));
const ProjectSummaryDashboard = Loadable(lazy(() => import('pages/dashboards/project-summary-dashboard')));
const SupervisorDashboard = Loadable(lazy(() => import('pages/dashboards/supervisor-dashboard')));
const MaterialGrnReport = Loadable(lazy(() => import('pages/gmisp-reports/material-grn-reports')));
const ProductivitySummaryReport = Loadable(lazy(() => import('pages/gmisp-reports/productivity-summary-report')));
const Rural = Filterable(Loadable(lazy(() => import('pages/extra-pages/rural'))));
const RuralLevelEntry = Filterable(Loadable(lazy(() => import('pages/extra-pages/rural-level-entry'))));
const Urban = Filterable(Loadable(lazy(() => import('pages/extra-pages/urban'))));
const UrbanLevelEntry = Filterable(Loadable(lazy(() => import('pages/extra-pages/urban-level-entry'))));

// ==============================|| MAIN ROUTING ||============================== //
const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'sample-page',
          element: <SamplePage />
        },
        {
          path: 'all-users',
          element: <Users />
        },
        {
          path: 'roles',
          element: <Role />
        },
        {
          path: 'permissions',
          element: <Permissions />
        },
        {
          path: 'gaa-network-area-allocation',
          element: <GaaNetworkHierarchyRights />
        },
        {
          path: 'work-area-allocation',
          element: <WorkAreaAllocation />
        },
        {
          path: 'edit-gaa-network-area-allocation/:userId',
          element: <EditGaaNetworkHierarchyRights />
        },
        {
          path: 'edit-work-area-allocation/:userId',
          element: <EditWorkAreaAllocation />
        },
        {
          path: 'supervisor-assignment',
          element: <SupervisorAssignment />
        },
        {
          path: 'create-new-supervisor',
          element: <AssignNewSupervisor />
        },
        {
          path: 'company-master/:orgType',
          element: <Organization />
        },
        {
          path: 'customer-master/:orgType',
          element: <Organization />
        },
        {
          path: 'customer-department-master',
          element: <CustomerDepartment />
        },
        {
          path: 'customer-designation-master',
          element: <CustomerDesignation />
        },
        {
          path: 'project-master',
          element: <ProjectMasterPage />
        },
        {
          path: 'approver-master',
          element: <ApproverMasterPage />
        },
        {
          path: 'country-master',
          element: <CountryMasterPage />
        },
        {
          path: 'state-master',
          element: <StateMasterPage />
        },
        {
          path: 'city-master',
          element: <CityMasterPage />
        },
        {
          path: 'gaa-master',
          element: <GAA />
        },
        {
          path: 'gaa-level-entry-master',
          element: <GAALevelEntry />
        },
        {
          path: 'network-master',
          element: <Network />
        },
        {
          path: 'network-level-entry-master',
          element: <NetworkLevelEntry />
        },
        {
          path: 'contractor-master/:orgType',
          element: <Organization />
        },
        {
          path: 'contractor-location-master/:orgType',
          element: <OrganizationLocation />
        },
        {
          path: 'company-location-master/:orgType',
          element: <OrganizationLocation />
        },
        {
          path: 'supplier-master/:orgType',
          element: <Organization />
        },
        {
          path: 'material-master',
          element: <Material />
        },
        {
          path: 'contractor-store-master/:orgType',
          element: <OrganizationStore />
        },
        {
          path: 'customer-store-master/:orgType',
          element: <OrganizationStore />
        },
        {
          path: 'company-store-master/:orgType',
          element: <OrganizationStore />
        },
        {
          path: 'location-site-store-master',
          element: <LocationSiteStore />
        },
        {
          path: 'supplier-repair-center-master/:orgType',
          element: <OrganizationStore />
        },
        {
          path: 'project-site-store-master',
          element: <ProjectSiteStore />
        },
        {
          path: 'master-maker',
          element: <MasterMakerPage />
        },
        {
          path: 'master-maker-lov',
          element: <MasterMakerLovPage />
        },
        {
          path: 'transaction-type-range',
          element: <CreateNewTransactionType />
        },
        {
          path: 'project-wise-master-maker',
          element: <ProjectMasterMakerPage />
        },
        {
          path: 'project-wise-master-lov',
          element: <ProjectMasterMakerLovPage />
        },
        {
          path: 'qa-master-maker',
          element: <QAMasterMakerPage />
        },
        {
          path: 'qa-master-lov',
          element: <QAMasterMakerLovPage />
        },
        {
          path: 'form-configurator',
          element: <FormConfigurator />
        },
        {
          path: 'form-responses',
          element: <FormResponses />
        },
        {
          path: 'survey-reports/:info/:ctg',
          element: <FormResponses />
        },
        {
          path: 'installation-reports/:info/:ctg',
          element: <FormResponses />
        },
        {
          path: 'o&m-reports/:info/:ctg',
          element: <FormResponses />
        },
        {
          path: 'qa-reports/:info/:ctg',
          element: <FormResponses />
        },
        {
          path: 'create-new-form',
          element: <CreateNewForm />
        },
        {
          path: 'update-form/:mode/:formId',
          element: <CreateNewForm />
        },
        {
          path: 'form-responses/:formId/:formName',
          element: <FormResponsePage />
        },
        {
          path: 'form-reports/:formId/:formName/:info',
          element: <FormResponsePage />
        },
        {
          path: 'customer-reports/:formId/:formName/:info/:isTemp',
          element: <FormResponsePage />
        },
        {
          path: 'form-response-data/:formId/:responseId/:mode',
          element: <FormResponseData />
        },
        {
          path: 'form-response-edit/:formId/:responseId/:mode',
          element: <FormResponseEdit />
        },
        {
          path: 'add-new-payload/:formId/:blockId',
          element: <AddNewPayload />
        },
        {
          path: 'add-new-auth/:formId/:blockId',
          element: <AddNewAuth />
        },
        {
          path: 'add-new-validation/:formId',
          element: <AddValidationRule />
        },
        {
          path: 'form-validation-rules/:formId',
          element: <ShowValidationRules />
        },
        {
          path: 'form-integration-rules/:formId',
          element: <ShowIntegrationRules />
        },
        {
          path: 'add-new-integration/:formId',
          element: <AddIntegrationRule />
        },
        {
          path: 'add-new-data-mapping/:formId',
          element: <AddDataMapping />
        },
        {
          path: 'add-new-inventory-mapping/:formId',
          element: <AddInventoryMapping />
        },
        {
          path: 'form-visibility-rules/:formId',
          element: <ShowVisibilityRule />
        },
        {
          path: 'add-new-visibility/:formId',
          element: <AddVisibilityRule />
        },
        {
          path: 'grn',
          element: <GRN />
        },
        {
          path: 'mrf',
          element: <MRF />
        },
        {
          path: 'min',
          element: <MIN />
        },
        {
          path: 'mrr',
          element: <MRR />
        },
        {
          path: 'mrn',
          element: <MRN />
        },
        {
          path: 'return-mrn',
          element: <RETURNMRN />
        },
        {
          path: 'stock-ledger',
          element: <StockLedger />
        },
        // {
        //   path: 'ptpr-receipt',
        //   element: <PTPRReceipt />
        // },
        {
          path: 'grn-receipt',
          element: <GRNReceipt />
        },
        {
          path: 'mrf-receipt',
          element: <MRFReceipt />
        },
        {
          path: 'min-receipt',
          element: <MINReceipt />
        },
        {
          path: 'stsrc-receipt',
          element: <STSRCReceipt />
        },
        {
          path: 'srcts-receipt',
          element: <SRCTSReceipt />
        },
        {
          path: 'sto-grn-receipt',
          element: <STOGRNReceipt />
        },
        {
          path: 'mrr-receipt',
          element: <MRRReceipt />
        },
        {
          path: 'mrn-receipt',
          element: <MRNReceipt />
        },
        {
          path: 'return-mrn-receipt',
          element: <ReturnMRNReceipt />
        },
        {
          path: 'str-receipt',
          element: <STRReceipt />
        },
        {
          path: 'sto-receipt',
          element: <STOReceipt />
        },
        {
          path: 'ptp-receipt',
          element: <PTPReceipt />
        },
        {
          path: 'ptp-grn-receipt',
          element: <PTPGRNReceipt />
        },
        {
          path: 'stc-receipt',
          element: <STCReceipt />
        },
        {
          path: 'cts-receipt',
          element: <CTSReceipt />
        },
        {
          path: 'ltl-receipt',
          element: <LTLReceipt />
        },
        {
          path: 'consumption-request-receipt',
          element: <ConsumptionRequestReceipt />
        },
        {
          path: 'consumption-receipt',
          element: <ConsumptionReceipt />
        },
        {
          path: 'contractor-store-location-master/:orgType',
          element: <OrganizationStoreLocation />
        },
        {
          path: 'company-store-location-master/:orgType',
          element: <OrganizationStoreLocation />
        },
        {
          path: 'sto',
          element: <MaterialTransferToStore />
        },
        {
          path: 'sto-grn',
          element: <StoGRN />
        },
        {
          path: 'ptp',
          element: <MaterialTransferProjectToProject />
        },
        {
          path: 'ptp-grn',
          element: <MaterialTransferProjectToProjectGrn />
        },
        {
          path: 'cti',
          element: <MaterialTransferContractorToInstaller />
        },
        {
          path: 'itc',
          element: <InstallerToContractor />
        },
        {
          path: 'iti',
          element: <MaterialTransferInstallerToInstaller />
        },
        {
          path: 'stc',
          element: <MaterialTransferPSSToCustomer />
        },
        {
          path: 'cts',
          element: <MaterialTransferCustomerToPSS />
        },
        {
          path: 'cancel-grn',
          element: <CancelGRN />
        },
        {
          path: 'cancel-min',
          element: <CancelMIN />
        },
        {
          path: 'cancel-str',
          element: <CancelSTR />
        },
        {
          path: 'cancel-sto',
          element: <CancelSTO />
        },

        {
          path: 'cancel-ltl',
          element: <CancelLTL />
        },
        {
          path: 'cancel-ptp',
          element: <CancelPTP />
        },
        {
          path: 'cancel-ptp-grn',
          element: <CancelPTPGRN />
        },
        {
          path: 'cancel-stc',
          element: <CancelSTC />
        },
        {
          path: 'cancel-mrf',
          element: <CancelMRF />
        },
        {
          path: 'cancel-sto-grn',
          element: <CancelSTOGRN />
        },
        {
          path: 'cancel-mrr',
          element: <CancelMRR />
        },
        {
          path: 'cancel-mrn',
          element: <CancelMRN />
        },
        {
          path: 'cancel-return-mrn',
          element: <CancelReturnMRN />
        },
        // {
        //   path: 'cancel-ptpr',
        //   element: <CancelPTPR />
        // },
        {
          path: 'str',
          element: <STR />
        },
        {
          path: 'ltl',
          element: <LTL />
        },
        // {
        //   path: 'ptpr',
        //   element: <RequestPTP />
        // },
        {
          path: 'consumption-request',
          element: <ConsumptionRequest />
        },
        {
          path: 'consumption',
          element: <Consumption />
        },
        {
          path: 'devolution',
          element: <Devolution />
        },
        {
          path: 'devolution-view',
          element: <DevolutionView />
        },
        {
          path: 'devolution-configurator',
          element: <DevolutionConfigurator />
        },
        {
          path: 'devolution-approver',
          element: <DevolutionApprover />
        },
        {
          path: 'stsrc',
          element: <STSRC />
        },
        {
          path: 'srcts',
          element: <SRCTS />
        },
        {
          path: 'purchase-order',
          element: <PurchaseOrder />
        },
        {
          path: 'approver-dashboard',
          element: <ApproverDashboard />
        },
        {
          path: 'bill-submission',
          element: <BillRaiseScreen />
        },
        {
          path: 'billing-approver-dashboard',
          element: <ApproverForBiling />
        },
        {
          path: 'email-templates',
          element: <EmailTemplates />
        },
        {
          path: 'smtp-configuration',
          element: <SmtpConfiguraton />
        },
        {
          path: 'delivery-challan-report',
          element: <DeliveryChallanReport />
        },
        {
          path: 'contractor-reconciliation-report',
          element: <ContractorReconciliationReport />
        },
        {
          path: 'contractor-report',
          element: <MetabaseEmbed dashboardName="Contractor Report" />
        },
        {
          path: 'store-dashboard',
          element: <StoreDashboard />
        },
        {
          path: 'executive-dashboard',
          element: <ExecutiveDashboard />
        },
        {
          path: 'exception-dashboard',
          element: <ExceptionDashboard />
        },
        {
          path: 'area-wise-progress-dashboard',
          element: <AreaWiseProgressDashboard />
        },
        {
          path: 'ticket-status-dashboard',
          element: <TicketStatusDashboard />
        },
        {
          path: 'aging-of-material',
          element: <AgingOfMaterialReport />
        },
        {
          path: 'gaa-and-network-hierarchy-report',
          element: <GaaAndNetworkHierarchyReport />
        },
        {
          path: 'mdm-data-sync-report',
          element: <MdmDataSyncReport />
        },
        {
          path: 'contractor-dashboard',
          element: <ContractorDashboard />
        },
        {
          path: 'date-wise-productivity-report',
          element: <DateWiseProductivityReport />
        },
        {
          path: 'productivity-summary-report',
          element: <ProductivitySummaryReport />
        },
        {
          path: 'validation-status-report',
          element: <ValidationStatusReport />
        },
        {
          path: 'user-wise-validation_status_report',
          element: <UserWiseValidationStatusReport />
        },
        {
          path: 'area-wise-productivity-report',
          element: <AreaWiseProductivityReport />
        },
        {
          path: 'user-wise-productivity-report',
          element: <UserWiseProductivityReport />
        },
        {
          path: 'document-wise-report',
          element: <DocumentWiseReport />
        },
        {
          path: 'dashboard-report',
          element: <DashboardReport />
        },
        {
          path: 'material-serial-number-report',
          element: <MaterialSerialNumberReport />
        },
        {
          path: 'menu-masters',
          element: <AccessManagement />
        },
        {
          path: 'access-form-responses',
          element: <AccessManagementForm />
        },
        {
          path: 'material-quantity',
          element: <MaterialQuantity />
        },
        {
          path: 'contractor-limit',
          element: <ContractorLimit />
        },
        {
          path: 'ticket-configurator',
          element: <Configurator />
        },
        {
          path: 'configure-escalation',
          element: <ConfigureEscalation />
        },
        {
          path: 'configure-email-template',
          element: <ConfigureEmailTemplate />
        },
        {
          path: 'tickets',
          element: <Tickets />
        },
        {
          path: 'my-tickets',
          element: <MyTickets />
        },
        {
          path: 'supervisor-dashboard',
          element: <SupervisorDashboard />
        },
        {
          path: 'inventory-dashboard',
          element: <MetabaseEmbed dashboardName="Inventory Dashboard" />
        },
        {
          path: 'project-summary-dashboard',
          element: <ProjectSummaryDashboard />
        },
        {
          path: 'substation-survey-report',
          element: <MetabaseEmbed dashboardName="Substation Survey Report" />
        },
        {
          path: 'feeder-survey-report',
          element: <MetabaseEmbed dashboardName="Feeder Survey Report" />
        },
        {
          path: 'dt-survey-report',
          element: <MetabaseEmbed dashboardName="DT Survey Report" />
        },
        {
          path: 'wc-consumer-survey-report',
          element: <MetabaseEmbed dashboardName="WC Consumer Survey Report" />
        },
        {
          path: 'supervisor-wise-material-status-report',
          element: <SupervisorMaterialStatusReport type="supervisor" />
        },
        {
          path: 'installer-wise-material-status-report',
          element: <SupervisorMaterialStatusReport type="installer" />
        },
        {
          path: 'material-grn-report',
          element: <MaterialGrnReport />
        },
        {
          path: 'stock-report',
          element: <StockReport />
        },
        {
          path: 'store-wise-material-summary-report',
          element: <StoreWiseMaterialReport />
        },
        {
          path: 'contractor-wise-material-summary-report',
          element: <ContractorWiseMaterialSummary />
        },
        {
          path: 'project-scope',
          element: <ProjectScope />
        },
        {
          path: 'daily-execution-plan',
          element: <DailyExecutionPlan />
        },
        {
          path: 'cancel-stsrc',
          element: <CancelSTSRC />
        },
        {
          path: 'cancel-srcts',
          element: <CancelSRCTS />
        },
        {
          path: 'ticket-status-wise-report',
          element: <TicketStatusWiseReport />
        },
        {
          path: 'ticket-supervisor-wise-report',
          element: <TicketAssignByWiseReport assignBy="Supervisor" />
        },
        {
          path: 'ticket-installer-wise-report',
          element: <TicketAssignByWiseReport assignBy="Installer" />
        },
        {
          path: 'rural-master',
          element: <Rural />
        },
        {
          path: 'rural-level-entry-master',
          element: <RuralLevelEntry />
        },
        {
          path: 'urban-master',
          element: <Urban />
        },
        {
          path: 'urban-level-entry-master',
          element: <UrbanLevelEntry />
        }
      ]
    },
    {
      path: '/maintenance',
      element: <CommonLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    }
  ]
};

export default MainRoutes;
