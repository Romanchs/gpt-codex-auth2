export const saveTokens = (data) => {
  localStorage.setItem('auth_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
};

export const getAccessToken = () => {
  return localStorage.getItem('auth_token');
};

export const getRefreshToken = () => {
  if (localStorage.getItem('refresh_token')) {
    return localStorage.getItem('refresh_token');
  }
  return '';
};
