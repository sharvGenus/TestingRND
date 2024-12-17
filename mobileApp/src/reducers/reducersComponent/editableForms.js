import status from '../../actions/actionStatus';

export default (
    state = {
        editableForms: []
    },
    action = {}
) => {
    switch (action.type) {
        case 'GET_EDITABLE_FORMS_REQUEST':
            return {
                status: status.PENDING,
                editableForms: []
            };
        case 'GET_EDITABLE_FORMS_SUCCESS':
            return {
                status: status.SUCCESS,
                editableForms: action.editableForms
            };
        case 'GET_EDITABLE_FORMS_FAILURE':
            return {
                status: status.ERROR,
                editableForms: state
            };
        default:
            return state;
    }
};
