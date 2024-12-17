import status from '../../actions/actionStatus';

export default (
    state = {
        formsSubTypesList: []
    },
    action = {}
) => {
    switch (action.type) {
        case 'GET_FORMS_SUB_TYPES_REQUEST':
            return {
                status: status.PENDING,
                formsTypesList: []
            };
        case 'GET_FORMS_SUB_TYPES_SUCCESS':
            return {
                status: status.SUCCESS,
                formsSubTypesList: action.formsSubTypesList
            };
        case 'GET_FORMS_SUB_TYPES_FAILURE':
            return {
                status: status.ERROR,
                formsTypesList: state
            };
        default:
            return state;
    }
};
