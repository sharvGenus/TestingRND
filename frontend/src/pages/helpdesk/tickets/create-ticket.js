import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@mui/material';
import SearchData from './search-data';
import TicketForm from './ticket-form';
import request from 'utils/request';
import TableForm from 'tables/table';
import toast from 'utils/ToastNotistack';

const CreateTicket = ({ goToTicketList }) => {
  const [selectedForm, setSelectedForm] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openTickets, setOpenTickets] = useState(null);
  const [gaaResponseData, setGAAResponseData] = useState();

  const getOpenTickets = useCallback(async () => {
    if (selectedRow) {
      const response = await request('/ticket-list', {
        method: 'GET',
        params: selectedRow?.['Response ID']
      });
      if (response.success) {
        setOpenTickets(response?.data?.data?.rows || []);
      } else {
        toast('Failed to load previous open ticket records', { variant: 'error' });
      }
    }
  }, [selectedRow]);

  useEffect(() => {
    getOpenTickets();
  }, [getOpenTickets]);

  const onSearchResultHandler = (searchResult) => {
    setSearchResults(searchResult.data);
    if (searchResult.data.length === 1) {
      setSelectedRow(searchResult.data[0]);
      setGAAResponseData({ responseId: searchResult.data[0]?.['Response ID'], formId: searchResult.form.formId });
    } else {
      setIsDialogOpen(true);
    }
    setSelectedForm(searchResult.form);
  };

  const onSubmitHandler = async (value, projectWiseMappingId) => {
    const payload = {
      issueId: value.issueId,
      subIssueId: value.subIssueId,
      description: value.description,
      projectId: selectedForm.projectId || null,
      formId: selectedForm.formId || null,
      formWiseMappingId: selectedForm.id || null,
      projectWiseMappingId,
      assigneeType: value.assigneeType,
      assignBy: value.assignBy,
      mobileNumber: value.mobileNumber,
      supervisorId: null,
      assigneeId: null,
      ticketStatus: 'assigned',
      responseId: selectedRow['Response ID'],
      remarks: value.remarks || '',
      priority: value.priority,
      attachments: value['attachments-paths'] || []
    };

    if (value.assigneeType === 'supervisor') {
      payload.supervisorId = value.supervisorId;
      payload.assigneeId = value.supervisorId;
    } else if (value.assigneeType === 'installer') {
      payload.supervisorId = null;
      payload.assigneeId = value.assigneeId;
    } else {
      payload.ticketStatus = 'open';
    }

    const response = await request('/ticket-create', { method: 'POST', timeoutOverride: 10 * 60000, body: payload });
    if (response.success) {
      toast(`Ticket created successfully. Ticket ID: ${response.data.data.updatedTicketNumber}`, {
        variant: 'success',
        autoHideDuration: 10000
      });
      goToTicketList(true);
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  return (
    <>
      <SearchData onSearchResult={onSearchResultHandler} onCloseTicketForm={goToTicketList} />
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} scroll="paper" maxWidth="lg">
        <TableForm
          data={searchResults?.map((data, index) => ({ ...data, id: index })) || []}
          columns={selectedForm?.displayFields?.map((field) => ({ Header: field.name, accessor: field.name })) || []}
          count={searchResults?.length || 0}
          hidePagination
          hideEditIcon
          hideHeader
          hideDeleteIcon
          miniAction
          hideHistoryIcon
          hideRestoreIcon
          handleRowView={(row) => {
            setSelectedRow(searchResults[row.id]);
            setGAAResponseData({ responseId: searchResults[row.id]?.['Response ID'], formId: selectedForm.formId });
            setIsDialogOpen(false);
          }}
        />
      </Dialog>
      <TicketForm
        disableFields={selectedRow ? (openTickets?.length === 0 && selectedRow['MDM Payload Status'] === 'Success' ? false : true) : true}
        geoLocation={selectedRow?.[selectedForm?.geoLocationField?.name] || null}
        tableData={selectedRow}
        tableColumns={selectedForm?.displayFields}
        openTickets={openTickets}
        projectId={selectedForm?.projectId}
        onFormSubmit={onSubmitHandler}
        onCloseTicketForm={goToTicketList}
        gaaResponseData={gaaResponseData}
      />
    </>
  );
};

CreateTicket.propTypes = {
  goToTicketList: PropTypes.func
};

export default CreateTicket;
