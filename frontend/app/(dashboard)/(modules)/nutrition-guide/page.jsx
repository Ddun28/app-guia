// app/nutrition-guide/page.tsx
'use client';

import { useState } from 'react';

// Definir categorías primero
const categories = [
  { id: 'basics', name: 'Conceptos Básicos', icon: '📚' },
  { id: 'macronutrients', name: 'Macronutrientes', icon: '⚖️' },
  { id: 'micronutrients', name: 'Micronutrientes', icon: '🔬' },
  { id: 'meal-planning', name: 'Planificación de Comidas', icon: '📅' },
  { id: 'special-diets', name: 'Dietas Especiales', icon: '⭐' },
  { id: 'myths', name: 'Mitos y Verdades', icon: '💡' },
];

const articles = [
  {
    id: 1,
    title: 'Introducción a la Nutrición',
    description: 'Aprende los fundamentos básicos de una alimentación saludable',
    content: 'La nutrición es el proceso biológico mediante el cual los organismos asimilan los alimentos y los líquidos necesarios para el funcionamiento, el crecimiento y el mantenimiento de sus funciones vitales...',
    category: 'basics',
    readTime: 5
  },
  {
    id: 2,
    title: 'Importancia de las Proteínas',
    description: 'Descubre por qué las proteínas son esenciales para tu cuerpo',
    content: 'Las proteínas son macromoléculas esenciales para la estructura y función de las células. Son necesarias para el crecimiento, la reparación de tejidos y la producción de enzimas y hormonas...',
    category: 'macronutrients',
    readTime: 7
  },
  {
    id: 3,
    title: 'Planificación de Comidas Semanal',
    description: 'Cómo organizar tus comidas para toda la semana',
    content: 'Planificar tus comidas con anticipación te ayuda a mantener una alimentación equilibrada, ahorrar tiempo y dinero, y reducir el estrés de decidir qué cocinar cada día...',
    category: 'meal-planning',
    readTime: 10
  },
  {
    id: 4,
    title: 'Vitaminas Esenciales',
    description: 'Guía completa de las vitaminas que tu cuerpo necesita',
    content: 'Las vitaminas son compuestos orgánicos esenciales que el cuerpo necesita en pequeñas cantidades para funcionar correctamente. Se dividen en dos grupos: liposolubles e hidrosolubles...',
    category: 'micronutrients',
    readTime: 8
  },
  {
    id: 5,
    title: 'Dieta Mediterránea',
    description: 'Beneficios y principios de la dieta mediterránea',
    content: 'La dieta mediterránea es un patrón alimentario inspirado en los hábitos tradicionales de los países mediterráneos. Se caracteriza por un alto consumo de frutas, verduras, legumbres, cereales integrales, frutos secos y aceite de oliva...',
    category: 'special-diets',
    readTime: 6
  },
  {
    id: 6,
    title: 'Desmitificando los Carbohidratos',
    description: 'Por qué no todos los carbohidratos son malos',
    content: 'Existe la creencia popular de que los carbohidratos engordan y deben evitarse. Sin embargo, los carbohidratos son la principal fuente de energía del cuerpo y esenciales para una dieta equilibrada...',
    category: 'myths',
    readTime: 9
  },
];

export default function NutritionGuide() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Guía de Alimentación
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Descubre información valiosa sobre nutrición, dietas equilibradas y cómo mejorar tus hábitos alimenticios para una vida más saludable.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar artículos..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10 overflow-x-auto">
          <div className="flex space-x-4 pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-medium ${selectedCategory === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              Todas las categorías
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium flex items-center ${selectedCategory === category.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <div key={article.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {categories.find(cat => cat.id === article.category)?.icon} {categories.find(cat => cat.id === article.category)?.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{article.readTime} min lectura</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{article.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{article.description}</p>
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer">
                    Leer más →
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No se encontraron artículos</h3>
            <p className="text-gray-500 dark:text-gray-400">Intenta con otros términos de búsqueda o selecciona otra categoría.</p>
          </div>
        )}

        {/* Featured Article */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 rounded-2xl p-8 text-white shadow-xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Artículo Destacado: Fundamentos de una Alimentación Balanceada</h2>
            <p className="mb-6">Descubre los principios esenciales para mantener una dieta equilibrada que proporcione todos los nutrientes que tu cuerpo necesita para funcionar correctamente.</p>
            <button className="bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg hover:bg-blue-50 transition-colors duration-200">
              Leer artículo completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}