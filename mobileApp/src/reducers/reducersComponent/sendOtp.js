import status from '../../actions/actionStatus';

export default (
    state = {
        sendOtpResponseList: []
    },
    action = {}
) => {
    switch (action.type) {
        case 'GET_SEND_OTP_RESPONSE_REQUEST':
            return {
                status: status.PENDING,
                sendOtpResponseList: {}
            };
        case 'GET_SEND_OTP_RESPONSE_SUCCESS':
            return {
                status: status.SUCCESS,
                sendOtpResponseList: action.sendOtpResponseList
            };
        case 'GET_SEND_OTP_RESPONSE_FAILURE':
            return {
                status: status.ERROR,
                sendOtpResponseList: state
            };
        default:
            return state;
    }
};
