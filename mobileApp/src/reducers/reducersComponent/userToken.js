import status from '../../actions/actionStatus';

export default (state = { userToken: { token: null } }, action = {}) => {
    switch (action.type) {
        case 'GET_USER_TOKEN_SUCESS': {
            return {
                status: status.SUCCESS,
                token: action.userToken
            };
        }
        case 'GET_USER_TOKEN_ERROR': {
            return {
                status: status.ERROR,
                token: null
            };
        }
        default:
            return state;
    }
};
