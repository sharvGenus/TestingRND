import status from '../../actions/actionStatus';

export default (
    state = {
        formsList: []
    },
    action = {}
) => {
    switch (action.type) {
        case 'GET_FORMS_REQUEST':
            return {
                status: status.PENDING,
                formsTypesList: []
            };
        case 'GET_FORMS_SUCCESS':
            return {
                status: status.SUCCESS,
                formsList: action.formsList
            };
        case 'GET_FORMS_FAILURE':
            return {
                status: status.ERROR,
                formsTypesList: state
            };
        default:
            return state;
    }
};
