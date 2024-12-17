import status from '../../actions/actionStatus';

export default (
    state = {
        dropDownList: []
    },
    action = {}
) => {
    switch (action.type) {
        case 'GET_DROPDOWN_LOV_REQUEST':
            return {
                status: status.PENDING,
                dropDownList: []
            };
        case 'GET_DROPDOWN_LOV_SUCCESS':
            return {
                status: status.SUCCESS,
                dropDownList: action.dropDownList
            };
        case 'GET_DROPDOWN_LOV_FAILURE':
            return {
                status: status.ERROR,
                dropDownList: state
            };
        default:
            return state;
    }
};
