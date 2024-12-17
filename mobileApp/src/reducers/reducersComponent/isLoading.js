import status from '../../actions/actionStatus';

export default (state = { enabled: false }, action = {}) => {
    switch (action.type) {
        case 'SET_LOADER': {
            return {
                status: status.SUCCESS,
                ...action.isLoading
            };
        }
        default:
            return state;
    }
};
