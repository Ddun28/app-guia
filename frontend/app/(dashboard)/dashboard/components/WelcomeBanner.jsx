// components/dashboard/WelcomeBanner.tsx
import { useAuthStore } from '@/store/auth.store';

export default function WelcomeBanner() {
  const { user } = useAuthStore();

  const currentHour = new Date().getHours();
  let greeting = '¡Buenos días!';

  if (currentHour >= 12 && currentHour < 18) {
    greeting = '¡Buenas tardes!';
  } else if (currentHour >= 18) {
    greeting = '¡Buenas noches!';
  }

  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 text-white dark:text-gray-100 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.nombre} ${user.apellido}`}
                className="h-20 w-20 rounded-full border-4 border-white/20 dark:border-gray-600 object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-white/20 dark:bg-gray-700 flex items-center justify-center border-4 border-white/20 dark:border-gray-600">
                <span className="text-2xl font-bold text-white dark:text-gray-100">
                  {user.nombre?.charAt(0)}{user.apellido?.charAt(0)}
                </span>
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {greeting} {user.nombre} {user.apellido}
            </h1>
            <p className="text-blue-100 dark:text-gray-300 text-lg">
              ¡Es genial tenerte de vuelta! Esperamos que tengas un día productivo.
            </p>
            <p className="text-blue-100 dark:text-gray-300 text-sm mt-2">
              {user.email}
            </p>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="bg-white/10 dark:bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">📊</div>
            <p className="text-sm mt-1">Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}