// authUtils.js

export const getAuthConfig = (getState) => {
  const userToken = localStorage.getItem('token');
  const token = userToken ? userToken : getState().auth.token;
  // console.log('authUtils:', token);
  if (!token) {
    throw new Error('No token found');
  }

  return {
    headers: {
      'Authorization': `Bearer ${token}`  // Pass token in header
    }
  };
};
