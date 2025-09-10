import api from '@/app/api/api';

export const getAlerts = async (params = {}) => {
	const response = await api.get('/urban-knowledge/alerts', { params });
	return response.data;
};

export const createAlert = async (alertData) => {
	const response = await api.post('/urban-knowledge/alerts', alertData);
	return response.data;
};

export const getPlaces = async (params = {}) => {
	const response = await api.get('/urban-knowledge/places', { params });
	return response.data;
};

export const createPlace = async (placeData) => {
	const response = await api.post('/urban-knowledge/places', placeData);
	return response.data;
};

export const getSafeRoutes = async (params = {}) => {
	const response = await api.get('/urban-knowledge/routes', { params });
	return response.data;
};

export const getRecommendedPlaces = async (params = {}) => {
  const response = await api.get('/urban-knowledge/recommended-places', { params });
  return response.data;
};
