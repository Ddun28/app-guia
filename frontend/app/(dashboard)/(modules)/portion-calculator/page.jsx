// app/portion-calculator/page.tsx
'use client';

import { useState, useEffect } from 'react';

// Datos de alimentos con cantidades base por persona por día
const foodItems = [
  // Proteínas
  { id: '1', name: 'Pollo', category: 'proteínas', unit: 'kg', baseQuantity: 0.15, icon: '🍗' },
  { id: '2', name: 'Carne de res', category: 'proteínas', unit: 'kg', baseQuantity: 0.12, icon: '🥩' },
  { id: '3', name: 'Pescado', category: 'proteínas', unit: 'kg', baseQuantity: 0.15, icon: '🐟' },
  { id: '4', name: 'Huevos', category: 'proteínas', unit: 'unidades', baseQuantity: 1, icon: '🥚' },
  { id: '5', name: 'Tofu', category: 'proteínas', unit: 'kg', baseQuantity: 0.1, icon: '🧈' },
  
  // Carbohidratos
  { id: '6', name: 'Arroz', category: 'carbohidratos', unit: 'kg', baseQuantity: 0.1, icon: '🍚' },
  { id: '7', name: 'Pasta', category: 'carbohidratos', unit: 'kg', baseQuantity: 0.08, icon: '🍝' },
  { id: '8', name: 'Papas', category: 'carbohidratos', unit: 'kg', baseQuantity: 0.2, icon: '🥔' },
  { id: '9', name: 'Pan', category: 'carbohidratos', unit: 'unidades', baseQuantity: 0.5, icon: '🍞' },
  { id: '10', name: 'Avena', category: 'carbohidratos', unit: 'kg', baseQuantity: 0.05, icon: '🌾' },
  
  // Verduras
  { id: '11', name: 'Tomate', category: 'verduras', unit: 'kg', baseQuantity: 0.1, icon: '🍅' },
  { id: '12', name: 'Cebolla', category: 'verduras', unit: 'kg', baseQuantity: 0.08, icon: '🧅' },
  { id: '13', name: 'Zanahoria', category: 'verduras', unit: 'kg', baseQuantity: 0.07, icon: '🥕' },
  { id: '14', name: 'Lechuga', category: 'verduras', unit: 'unidades', baseQuantity: 0.2, icon: '🥬' },
  { id: '15', name: 'Brócoli', category: 'verduras', unit: 'kg', baseQuantity: 0.1, icon: '🥦' },
  
  // Frutas
  { id: '16', name: 'Manzanas', category: 'frutas', unit: 'kg', baseQuantity: 0.15, icon: '🍎' },
  { id: '17', name: 'Plátanos', category: 'frutas', unit: 'kg', baseQuantity: 0.1, icon: '🍌' },
  { id: '18', name: 'Naranjas', category: 'frutas', unit: 'kg', baseQuantity: 0.12, icon: '🍊' },
  { id: '19', name: 'Fresas', category: 'frutas', unit: 'kg', baseQuantity: 0.08, icon: '🍓' },
  
  // Lácteos
  { id: '20', name: 'Leche', category: 'lácteos', unit: 'litros', baseQuantity: 0.25, icon: '🥛' },
  { id: '21', name: 'Queso', category: 'lácteos', unit: 'kg', baseQuantity: 0.03, icon: '🧀' },
  { id: '22', name: 'Yogurt', category: 'lácteos', unit: 'unidades', baseQuantity: 0.5, icon: '🥣' },
];

const categories = [
  { id: 'proteínas', name: 'Proteínas', icon: '🥩' },
  { id: 'carbohidratos', name: 'Carbohidratos', icon: '🍚' },
  { id: 'verduras', name: 'Verduras', icon: '🥦' },
  { id: 'frutas', name: 'Frutas', icon: '🍎' },
  { id: 'lácteos', name: 'Lácteos', icon: '🥛' },
];

export default function PortionCalculator() {
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [numberOfDays, setNumberOfDays] = useState(7);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [results, setResults] = useState([]);

  // Calcular cantidades
  const calculateQuantities = () => {
    const filteredItems = selectedCategory === 'all' 
      ? foodItems 
      : foodItems.filter(item => item.category === selectedCategory);

    const calculatedResults = filteredItems.map(item => {
      const totalQuantity = item.baseQuantity * numberOfPeople * numberOfDays;
      
      // Convertir unidades para mejor visualización
      let calculatedUnit = item.unit;
      let displayQuantity = totalQuantity;

      if (item.unit === 'kg' && totalQuantity >= 1) {
        displayQuantity = totalQuantity;
      } else if (item.unit === 'kg' && totalQuantity < 1) {
        displayQuantity = totalQuantity * 1000;
        calculatedUnit = 'g';
      } else if (item.unit === 'litros' && totalQuantity >= 1) {
        displayQuantity = totalQuantity;
      } else if (item.unit === 'litros' && totalQuantity < 1) {
        displayQuantity = totalQuantity * 1000;
        calculatedUnit = 'ml';
      } else if (item.unit === 'unidades') {
        displayQuantity = Math.ceil(totalQuantity); // Redondear hacia arriba unidades
      }

      return {
        item,
        totalQuantity: parseFloat(displayQuantity.toFixed(2)),
        calculatedUnit
      };
    });

    setResults(calculatedResults);
  };

  // Toggle selección de items
  const toggleItemSelection = () => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Calcular automáticamente cuando cambian los parámetros
  useEffect(() => {
    calculateQuantities();
  }, [numberOfPeople, numberOfDays, selectedCategory]);

  const filteredResults = selectedItems.length > 0
    ? results.filter(result => selectedItems.includes(result.item.id))
    : results;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Calculadora de Porciones
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Calcula las cantidades exactas que necesitas comprar según el número de personas y días.
          </p>
        </div>

        {/* Controles principales */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número de Personas
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número de Días
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={numberOfDays}
                onChange={(e) => setNumberOfDays(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Lista de Mercado ({numberOfPeople} persona{numberOfPeople !== 1 ? 's' : ''} × {numberOfDays} día{numberOfDays !== 1 ? 's' : ''})
          </h2>

          {/* Filtros rápidos */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedItems([])}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedItems.length === 0
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Mostrar todos
            </button>
            <button
              onClick={() => setSelectedItems([])}
              className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Solo seleccionados
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResults.map((result, index) => (
              <div
                key={result.item.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedItems.includes(result.item.id)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => toggleItemSelection(result.item.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{result.item.icon}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {result.item.name}
                    </h3>
                  </div>
                  {selectedItems.includes(result.item.id) && (
                    <span className="text-blue-600 dark:text-blue-400">✓</span>
                  )}
                </div>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {result.totalQuantity} {result.calculatedUnit}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {result.item.category}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Acciones
          </h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              📄 Imprimir Lista
            </button>
            <button
              onClick={() => {
                const selected = filteredResults.filter(r => selectedItems.includes(r.item.id));
                const text = selected.map(r => 
                  `${r.item.icon} ${r.item.name}: ${r.totalQuantity} ${r.calculatedUnit}`
                ).join('\n');
                navigator.clipboard.writeText(text);
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              📋 Copiar Selección
            </button>
            <button
              onClick={() => {
                setNumberOfPeople(2);
                setNumberOfDays(7);
                setSelectedCategory('all');
                setSelectedItems([]);
              }}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🔄 Reiniciar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}