import { create } from 'zustand';
import { getProfile } from '@/app/api/auth/auth'; 
import { updateUserProfile } from '@/app/api/users/user'; 

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  loadUserProfile: async (token) => {
    try {
      set({ isLoading: true, error: null });
      const profile = await getProfile(token); 
      set({ user: profile, token, isLoading: false });
      return profile;
    } catch (error) {
      if (error.response?.status === 401) {
        set({ user: null, token: null, isLoading: false, error: null });
        return null; 
      }
      
      set({ isLoading: false, error: error.message });
      throw error; 
    }
  },

  updateProfile: async (payload) => {
    try {
      set({ isLoading: true });

      const requestData = {
        nombre: payload.userData?.nombre,
        apellido: payload.userData?.apellido,
        email: payload.userData?.email,
        new_password: payload.userData?.new_password || undefined,
        new_password_confirmation: payload.userData?.new_password_confirmation || undefined,
        ...payload.profileData,
        ubicacion: {
          ciudad: payload.profileData?.ubicacion?.ciudad || undefined,
          pais: payload.profileData?.ubicacion?.pais || undefined
        }
      };

      Object.keys(requestData).forEach(key => {
        if (requestData[key] === undefined) {
          delete requestData[key];
        }
      });

      const response = await updateUserProfile(requestData);
  
      const updatedUser = response.data?.user || response.user || response;
      const updatedProfile = response.data?.profile || response.profile || response;
      
      set(state => ({
        user: {
          ...state.user, 
          ...updatedUser,
          profile: {
            ...state.user?.profile, 
            ...updatedProfile
          }
        },
        isLoading: false,
        error: null
      }));
      
      return { success: true, data: response.data || response };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.data?.message || 
                          error.message || 
                          'Error al actualizar el perfil';
      
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  clearAuth: () => set({ user: null, token: null, error: null }),
}));