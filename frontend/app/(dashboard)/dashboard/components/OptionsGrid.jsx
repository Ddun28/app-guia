'use client';

import { useRouter } from 'next/navigation';

const options = [
  {
    id: 1,
    title: 'Guía de Alimentación',
    description: 'Consejos y recomendaciones para una alimentación saludable',
    icon: '🍎',
    route: '/nutrition-guide',
    available: true
  },
  {
    id: 2,
    title: 'Calculadora de Porciones',
    description: 'Calcula las porciones necesarias según días y personas',
    icon: '📊',
    route: '/portion-calculator',
    available: true
  },
  {
    id: 3,
    title: 'Planificador de Menús',
    description: 'Crea menús semanales personalizados',
    icon: '📅',
    route: '/meal-planner',
    available: false
  },
  {
    id: 4,
    title: 'Recetario',
    description: 'Explora recetas saludables y deliciosas',
    icon: '📖',
    route: '/recipes',
    available: false
  }
];

export default function OptionsGrid() {
  const router = useRouter();

  const handleNavigation = () => {
    if (!available) {
      alert('Esta funcionalidad estará disponible pronto!');
      return;
    }
    router.push(route);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        ¿Qué te gustaría hacer hoy?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => handleNavigation(option.route, option.available)}
            className={`p-6 rounded-lg border cursor-pointer transition-all duration-200 ${
              option.available
                ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg dark:hover:shadow-lg hover:scale-105'
                : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-600 opacity-70'
            }`}
          >
            <div className="text-4xl mb-4">{option.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {option.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {option.description}
            </p>
            <div className={`text-sm font-medium ${
              option.available 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {option.available ? 'Disponible →' : 'Próximamente'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}