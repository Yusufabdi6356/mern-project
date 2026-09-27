export const extractErrorMessage = (error) => {
  if (!error.response) return 'Cannot reach the server. Check your connection and try again.';
  const data = error.response.data;
  if (data?.errors?.length) return data.errors.map(item => item.message).join('. ');
  return data?.message || 'Something went wrong';
};
