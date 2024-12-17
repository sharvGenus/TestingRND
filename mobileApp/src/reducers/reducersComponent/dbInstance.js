import status from '../../actions/actionStatus';

export default (state = { dbInstance: { db: undefined } }, action = {}) => {
    switch (action.type) {
        case 'GET_DATA_BASE_SUCESS': {
            return {
                status: status.SUCCESS,
                db: action.dbInstance
            };
        }
        case 'GET_DATA_BASE_ERROR': {
            return {
                status: status.ERROR,
                db: undefined
            };
        }
        default:
            return state;
    }
};
