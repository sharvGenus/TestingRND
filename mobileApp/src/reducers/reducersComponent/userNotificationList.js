import status from '../../actions/actionStatus';

export default (
    state = {
        notificationLists: { notificationList: [] }
    },
    action = {}
) => {
    switch (action.type) {
        case 'GET_NOTIFICATION_LIST_REQUEST':
            return {
                status: status.PENDING,
                notificationLists: { notificationList: action.notificationList }
            };
        case 'GET_NOTIFICATION_LIST_SUCCESS':
            return {
                status: status.SUCCESS,
                notificationLists: { notificationList: action.notificationList }
            };
        case 'GET_NOTIFICATION_LIST_FAILURE':
            return {
                status: status.ERROR,
                notificationLists: { notificationList: [] }
            };
        default:
            return state;
    }
};
