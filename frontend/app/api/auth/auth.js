import api from '@/app/api/api';

export const login = (credentials) => 
  api.post('/auth/login', credentials, {
    headers: {
      'skipInterceptor': true 
    }
  })
  .then(response => {
    document.cookie = `auth_token=${response.data.access_token}; path=/; max-age=86400; Secure; SameSite=Strict`;
    return response.data;
  });

export const logout = () => 
  api.post('/auth/logout', {}, {
    headers: {
      'skipInterceptor': true
    }
  })
  .then(response => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    return response.data;
  });

export const getProfile = () => 
  api.get('/auth/profile')
  .then(response => response.data);