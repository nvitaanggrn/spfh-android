export default response => {
  const data =  response.data;
  const status =  response.status;
  const headers = response.headers;
  const dataData = data.data || null;
  const dataErrors = data.errors || [];
  const dataOptions = data.options || {};
  const successResponse = Object.create(null);
  successResponse.status = status;
  successResponse.headers = headers;
  successResponse.data = dataData;
  successResponse.errors = dataErrors;
  successResponse.options = dataOptions;
  return successResponse;
};