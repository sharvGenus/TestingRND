export default {
  requestHandler(request) {
    return request;
  },
  errorHandler(error) {
    if (error && error?.response?.status && error.response.status === 401) {
      // call sign out here
      // AuthService.signOut();
    }
    return {
      error: {
        ...(error.response?.data || error.response || error),
        msg: error.response?.data?.message || error.response?.errors?.[0]?.message || error.response?.message || 'Something Went Wrong'
      },
      status: false
    };
  },
  successHandler(response) {
    return {
      status: true,
      data: response.data.data,
      ...(response.data.message && { message: response.data.message })
    };
  }
};
