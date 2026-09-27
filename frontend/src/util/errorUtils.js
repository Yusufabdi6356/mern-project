export const extractErrorMessage = (error) => {
  const data = error.response?.data;
  if (data?.errors?.length) return data.errors.map(item => item.message).join('. ');
  return data?.message || error.message || 'Something went wrong';
};
