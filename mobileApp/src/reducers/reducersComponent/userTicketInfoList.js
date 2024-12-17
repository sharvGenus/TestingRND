import status from '../../actions/actionStatus';

export default (
    state = {
        ticketInfoList: []
    },
    action = {}
) => {
    switch (action.type) {
        case 'GET_TICKET_INFO_LIST_REQUEST':
            return {
                status: status.PENDING,
                ticketInfoLists: []
            };
        case 'GET_TICKET_INFO_LIST_SUCCESS':
            return {
                status: status.SUCCESS,
                ticketInfoList: action.ticketInfoList
            };
        case 'GET_TICKET_INFO_LIST_FAILURE':
            return {
                status: status.ERROR,
                ticketInfoLists: state
            };
        default:
            return state;
    }
};
