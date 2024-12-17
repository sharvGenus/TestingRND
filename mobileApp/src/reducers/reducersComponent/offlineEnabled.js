import status from '../../actions/actionStatus';

export default (state = { offlineEnabled: { enabled: false } }, action = {}) => {
    switch (action.type) {
        case 'GET_OFFLINE_ENABLED_SUCESS': {
            return {
                status: status.SUCCESS,
                enabled: action.offlineEnabled
            };
        }
        case 'GET_OFFLINE_ENABLED_ERROR': {
            return {
                status: status.ERROR,
                enabled: false
            };
        }
        default:
            return state;
    }
};
