import status from '../../actions/actionStatus';

export default (
    state = {
        formsTypesList: []
    },
    action = {}
) => {
    switch (action.type) {
        case 'GET_FORMS_TYPES_REQUEST':
            return {
                status: status.PENDING,
                formsTypesList: []
            };
        case 'GET_FORMS_TYPES_SUCCESS':
            return {
                status: status.SUCCESS,
                formsTypesList: action.formsTypesList
            };
        case 'GET_FORMS_TYPES_FAILURE':
            return {
                status: status.ERROR,
                formsTypesList: state
            };
        default:
            return state;
    }
};
