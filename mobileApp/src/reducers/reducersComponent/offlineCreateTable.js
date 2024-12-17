import status from '../../actions/actionStatus';

export default (
    state = {
        tableDataList: []
    },
    action = {}
) => {
    switch (action.type) {
        case 'GET_TABLE_DATA_REQUEST':
            return {
                status: status.PENDING,
                tableDataList: []
            };
        case 'GET_TABLE_DATA_SUCCESS':
            return {
                status: status.SUCCESS,
                tableDataList: action.tableDataList
            };
        case 'GET_TABLE_DATA_FAILURE':
            return {
                status: status.ERROR,
                tableDataList: state
            };
        default:
            return state;
    }
};
