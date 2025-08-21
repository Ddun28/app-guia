'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';

export default function ProfileCompletionCard() {
  const { user } = useAuthStore();
  const router = useRouter();

  const handleCompleteProfile = () => {
    router.push('/user-profile');
  };

  if (!user) return null;

  // Calcular porcentaje de completitud basado en todos los campos requeridos
  const calculateCompletion = () => {
    let completed = 0;
    const totalFields = 10; // Total de campos requeridos
    
    // Campos básicos
    if (user.nombre) completed++;
    if (user.apellido) completed++;
    if (user.email) completed++;
    
    // Campos del perfil
    if (user.profile?.telefono) completed++;
    if (user.profile?.edad) completed++;
    if (user.profile?.estado_civil) completed++;
    if (user.profile?.fecha_nacimiento) completed++;
    if (user.profile?.sexo) completed++;
    if (user.profile?.ubicacion?.ciudad) completed++;
    if (user.profile?.ubicacion?.pais) completed++;

    return Math.round((completed / totalFields) * 100);
  };

  const completionPercentage = calculateCompletion();

  const isProfileComplete = completionPercentage === 100;

  if (isProfileComplete) {
    return null; 
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-white dark:text-gray-100 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 bg-white/20 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-white dark:text-gray-100 text-xl">📝</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-1">
              ¡Perfil Incompleto!
            </h3>
            <p className="text-white dark:text-gray-300">
              Completa tu información personal para disfrutar de todas las funcionalidades correctamente.
            </p>
          </div>
        </div>

        <button
          onClick={handleCompleteProfile}
          className="bg-white/30 dark:bg-gray-700 hover:bg-white/40 dark:hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Completar Perfil
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full bg-white/20 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-white dark:bg-gray-300 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <p className="text-white dark:text-gray-300 text-sm mt-2 text-center">
          {completionPercentage}% completado
        </p>
      </div>

      {/* Campos faltantes */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
        {!user.nombre && (
          <span className="text-white dark:text-gray-300 text-sm bg-white/20 dark:bg-gray-700 px-2 py-1 rounded">
            ✗ Nombre
          </span>
        )}
        {!user.apellido && (
          <span className="text-white dark:text-gray-300 text-sm bg-white/20 dark:bg-gray-700 px-2 py-1 rounded">
            ✗ Apellido
          </span>
        )}
        {!user.email && (
          <span className="text-white dark:text-gray-300 text-sm bg-white/20 dark:bg-gray-700 px-2 py-1 rounded">
            ✗ Email
          </span>
        )}
        {!user.profile?.telefono && (
          <span className="text-white dark:text-gray-300 text-sm bg-white/20 dark:bg-gray-700 px-2 py-1 rounded">
            ✗ Teléfono
          </span>
        )}
        {!user.profile?.edad && (
          <span className="text-white dark:text-gray-300 text-sm bg-white/20 dark:bg-gray-700 px-2 py-1 rounded">
            ✗ Edad
          </span>
        )}
        {!user.profile?.estado_civil && (
          <span className="text-white dark:text-gray-300 text-sm bg-white/20 dark:bg-gray-700 px-2 py-1 rounded">
            ✗ Estado civil
          </span>
        )}
        {!user.profile?.fecha_nacimiento && (
          <span className="text-white dark:text-gray-300 text-sm bg-white/20 dark:bg-gray-700 px-2 py-1 rounded">
            ✗ Fecha nacimiento
          </span>
        )}
        {!user.profile?.sexo && (
          <span className="text-white dark:text-gray-300 text-sm bg-white/20 dark:bg-gray-700 px-2 py-1 rounded">
            ✗ Sexo
          </span>
        )}
        {!user.profile?.ubicacion?.ciudad && (
          <span className="text-white dark:text-gray-300 text-sm bg-white/20 dark:bg-gray-700 px-2 py-1 rounded">
            ✗ Ciudad
          </span>
        )}
        {!user.profile?.ubicacion?.pais && (
          <span className="text-white dark:text-gray-300 text-sm bg-white/20 dark:bg-gray-700 px-2 py-1 rounded">
            ✗ País
          </span>
        )}
      </div>
    </div>
  );
}