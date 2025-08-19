import api from '@/app/api/api';

export const login = (credentials) => 
  api.post('/auth/login', credentials, {
    headers: {
      'skipInterceptor': true 
    }
  })
  .then(response => {
    document.cookie = `access_token=${response.data.access_token}; path=/; max-age=86400; Secure; SameSite=Strict`;
    return response.data;
  });

export const logout = () => 
  api.post('/auth/logout', {}, {
    headers: {
      'skipInterceptor': true
    }
  })
  .then(response => {
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    return response.data;
  });

export const getProfile = () => {
  
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('access_token='))
    ?.split('=')[1];
  

  return api.get('/auth/profile')
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error fetching profile:', error);
      throw error;
    })
};