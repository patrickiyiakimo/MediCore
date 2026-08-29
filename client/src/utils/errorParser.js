export const getErrorMessage = (error, fallback = "Something went wrong") => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return fallback;
};

export const getValidationErrors = (error) => {
  if (error?.response?.data?.details) {
    return error.response.data.details;
  }
  return {};
};