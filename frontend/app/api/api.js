import axios from "axios";
import { toast } from "react-hot-toast";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL 

const api = axios.create({
  baseURL: baseURL
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const cookieToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1];
    
    if (cookieToken) {
      config.headers.Authorization = `Bearer ${cookieToken}`;
    }

    if (config.headers?.skipInterceptor) {
      config.skipInterceptor = true;
      delete config.headers.skipInterceptor;
    }
  }
  return config;
});

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    error.handledByInterceptor = true;

    if (error.config?.skipInterceptor) {
      return Promise.reject(error);
    }

    if (error.response) {
      const { status, data } = error.response;
      const errorMessage = data?.message || "Error en la solicitud";

      switch (status) {
        case 400: 
          toast.error("Solicitud incorrecta");
          break;

        case 401: 
          if (typeof window !== "undefined") {
            toast.error('Tu sesión ha expirado. Serás redirigido para iniciar sesión', {
              duration: 4000,
              position: 'top-center',
              style: {
                background: '#ef4444',
                color: '#fff',
              },
              icon: '🔒'
            });

            document.cookie = 'access_token=; Max-Age=0; path=/';
            document.cookie = 'user_role=; Max-Age=0; path=/';
            localStorage.removeItem('access_token');
            sessionStorage.clear();

            if (!window.location.pathname.startsWith('/auth/login')) {
              setTimeout(() => {
                window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
              }, 1500);
            }
          }
          break;

        case 403: 
          toast.error("No tienes permisos para esta acción");
          break;

        case 404:
          toast.error("Recurso no encontrado");
          break;

        case 422: 
          const firstError = data.errors 
            ? Object.values(data.errors)[0]?.[0] || "Datos inválidos"
            : "Datos inválidos";
          toast.error(firstError);
          break;

        case 429: 
          toast.error("Demasiadas solicitudes. Por favor espera un momento");
          break;

        case 500: 
          toast.error("Error interno del servidor. Por favor contacta al soporte");
          console.error("Server Error:", data);
          break;

        default:
          toast.error(errorMessage);
      }

      if (data?.error === "Token exchange failed") {
        toast.error("Error temporal de token, se puede reintentar");
      }
    } else if (error.request) {
      toast.error("Error de conexión con el servidor");
      console.error("Network Error:", error.message);
    } else {
      console.error("Request Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;