import status from '../../actions/actionStatus';

export default (
    state = {
        searchFieldList: [],
        searchResultMessage: ''
    },
    action = {}
) => {
    switch (action.type) {
        case 'GET_SEARCH_FIELDS_REQUEST':
            return {
                status: status.PENDING,
                searchFieldList: []
            };
        case 'GET_SEARCH_FIELDS_SUCCESS':
            return {
                status: status.SUCCESS,
                searchFieldList: action.searchFieldList,
                searchResultMessage: action.searchResultMessage
            };
        case 'GET_SEARCH_FIELDS_FAILURE':
            return {
                status: status.ERROR,
                searchFieldList: state
            };
        default:
            return state;
    }
};
