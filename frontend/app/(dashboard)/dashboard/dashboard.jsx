'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import WelcomeBanner from './components/WelcomeBanner'; 
import ProfileCompletionCard from './components/ProfileCompletionCard';
import OptionsGrid from './components/OptionsGrid';

export default function Dashboard() {
  const { user, loadUserProfile, isLoading } = useAuthStore(); // Corregido aquí
  const router = useRouter();

  useEffect(() => {
    // Cargar el perfil si no está en el store
    if (!user) {
      loadUserProfile(); // Asegúrate de pasar el token si es necesario
    }
  }, [user, loadUserProfile]);

  // Redirigir si no hay usuario y no está cargando
  useEffect(() => {
    if (!isLoading && !user) {
      // router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Verificar si hay campos faltantes en el perfil
  const hasMissingFields = !(
    user.nombre && 
    user.apellido && 
    user.email && 
    user.profile?.telefono && 
    user.profile?.edad && 
    user.profile?.estado_civil && 
    user.profile?.fecha_nacimiento && 
    user.profile?.sexo && 
    user.profile?.ubicacion?.ciudad && 
    user.profile?.ubicacion?.pais
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner de bienvenida */}
        <WelcomeBanner user={user} />
        
        {/* Card de completitud de perfil solo si hay campos faltantes */}
        {hasMissingFields && (
          <div className="mt-8">
            <ProfileCompletionCard />
          </div>
        )}

        <OptionsGrid />
      </div>
    </div>
  );
}
