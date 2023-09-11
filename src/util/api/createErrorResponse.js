export default error => {
  const data =  error.response?.data || {};
  const status =  error.response?.status || -1;
  const headers = error.response?.headers || {};
  const dataData = data.data || null;
  const dataErrors = data.errors || [];
  const dataOptions = data.options || {};
  const errorMessage = dataErrors[0]?.message || error.message || 'Oops! Something went wrong. Please try again.';
  const errorResponse = new Error(errorMessage);
  errorResponse.status = status;
  errorResponse.headers = headers;
  errorResponse.data = dataData;
  errorResponse.errors = dataErrors;
  errorResponse.options = dataOptions;
  return errorResponse
};