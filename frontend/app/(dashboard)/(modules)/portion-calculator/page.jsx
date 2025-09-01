'use client';

import { useState, useEffect } from 'react';
import { searchFoods } from '@/api/food/food';
import CalculatorControls from './components/CalculatorControls'; 
import SearchSection from './components/SearchSection';
import ResultsSection from './components/ResultsSection';
import ActionsSection from './components/ActionsSection';

// Datos de ejemplo para categorías
const categories = [
  { id: 'vegetables', name: 'Vegetales', icon: '🥦' },
  { id: 'fruits', name: 'Frutas', icon: '🍎' },
  { id: 'dairy', name: 'Lácteos', icon: '🥛' },
  { id: 'protein', name: 'Proteínas', icon: '🥩' },
  { id: 'grains', name: 'Granos', icon: '🍞' },
];

// Alimentos predefinidos
const foodItems = [
  { id: 1, name: 'Arroz', category: 'grains', icon: '🍚', baseQuantity: 0.1, unit: 'kg' },
  { id: 2, name: 'Frijoles', category: 'grains', icon: '🫘', baseQuantity: 0.08, unit: 'kg' },
  { id: 3, name: 'Pollo', category: 'protein', icon: '🍗', baseQuantity: 0.2, unit: 'kg' },
  { id: 4, name: 'Carne', category: 'protein', icon: '🥩', baseQuantity: 0.15, unit: 'kg' },
  { id: 5, name: 'Leche', category: 'dairy', icon: '🥛', baseQuantity: 0.25, unit: 'litros' },
  { id: 6, name: 'Huevos', category: 'protein', icon: '🥚', baseQuantity: 1, unit: 'unidades' },
  { id: 7, name: 'Pan', category: 'grains', icon: '🍞', baseQuantity: 0.05, unit: 'kg' },
  { id: 8, name: 'Queso', category: 'dairy', icon: '🧀', baseQuantity: 0.05, unit: 'kg' },
  { id: 9, name: 'Manzanas', category: 'fruits', icon: '🍎', baseQuantity: 0.1, unit: 'kg' },
  { id: 10, name: 'Plátanos', category: 'fruits', icon: '🍌', baseQuantity: 0.1, unit: 'kg' },
  { id: 11, name: 'Zanahorias', category: 'vegetables', icon: '🥕', baseQuantity: 0.05, unit: 'kg' },
  { id: 12, name: 'Papas', category: 'vegetables', icon: '🥔', baseQuantity: 0.1, unit: 'kg' },
];

// Función helper para icons
const getFoodIcon = (category) => {
  const icons = {
    'Vegetables': '🥦',
    'Fruits': '🍎',
    'Dairy': '🥛',
    'Protein Foods': '🥩',
    'Grains': '🍞',
    'Snacks': '🍿',
    'vegetables': '🥦',
    'fruits': '🍎',
    'dairy': '🥛',
    'protein': '🥩',
    'grains': '🍞',
  };
  return icons[category] || '🍽️';
};

export default function PortionCalculator() {
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [numberOfDays, setNumberOfDays] = useState(7);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [customItems, setCustomItems] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Calcular cantidades
  const calculateQuantities = () => {
    const filteredItems = selectedCategory === 'all' 
      ? [...foodItems, ...customItems]
      : [...foodItems, ...customItems].filter(item => item.category === selectedCategory);

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
        displayQuantity = Math.ceil(totalQuantity); 
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
  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Buscar alimentos en la API del USDA
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setShowSearchResults(true);
    
    try {
      const foods = await searchFoods(searchQuery);
      setSearchResults(foods);
    } catch (error) {
      console.error('Error searching foods:', error);
      setSearchResults([]);
    }
    
    setIsSearching(false);
  };

  // Agregar alimento desde la búsqueda
  const addCustomItem = (food) => {
    // Convertir la categoría de la API a nuestro formato
    const categoryMap = {
      'Vegetables': 'vegetables',
      'Fruits': 'fruits',
      'Dairy and Egg Products': 'dairy',
      'Protein Foods': 'protein',
      'Grains': 'grains',
      'Snacks': 'snacks'
    };
    
    const category = categoryMap[food.category] || 'unknown';
    
    const newItem = {
      id: `usda-${food.fdcId}`,
      name: food.name,
      category: category,
      icon: getFoodIcon(category),
      baseQuantity: food.baseQuantity / 100, // Convertir de porción de 100g a porción individual
      unit: food.unit
    };
    
    setCustomItems(prev => [...prev, newItem]);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    
    // Recalcular después de agregar
    setTimeout(calculateQuantities, 100);
  };

  // Calcular automáticamente cuando cambian los parámetros
  useEffect(() => {
    calculateQuantities();
  }, [numberOfPeople, numberOfDays, selectedCategory, customItems]);

  const filteredResults = results;

  // Función para resetear todo
  const handleReset = () => {
    setNumberOfPeople(2);
    setNumberOfDays(7);
    setSelectedCategory('all');
    setSelectedItems([]);
    setCustomItems([]);
    setSearchResults([]);
    setShowSearchResults(false);
  };

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
        <CalculatorControls
          numberOfPeople={numberOfPeople}
          setNumberOfPeople={setNumberOfPeople}
          numberOfDays={numberOfDays}
          setNumberOfDays={setNumberOfDays}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

        {/* Búsqueda de alimentos USDA */}
        <SearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          isSearching={isSearching}
          showSearchResults={showSearchResults}
          setShowSearchResults={setShowSearchResults}
          searchResults={searchResults}
          addCustomItem={addCustomItem}
        />

        {/* Resultados */}
        <ResultsSection
          numberOfPeople={numberOfPeople}
          numberOfDays={numberOfDays}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          filteredResults={filteredResults}
          toggleItemSelection={toggleItemSelection}
        />

        {/* Acciones */}
        <ActionsSection
          filteredResults={filteredResults}
          selectedItems={selectedItems}
          handleReset={handleReset}
        />
      </div>
    </div>
  );
}