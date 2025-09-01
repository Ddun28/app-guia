// lib/usda-api.js
const USDA_API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY;

export const searchFoods = async (query) => {
  try {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${query}&pageSize=10`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.foods.map((food) => ({
      fdcId: food.fdcId,
      name: food.description,
      category: food.foodCategory || 'unknown',
      unit: 'g', 
      baseQuantity: 100,
      icon: getFoodIcon(food.foodCategory),
      nutrients: {
        calories: food.foodNutrients?.find((n) => n.nutrientName === 'Energy')?.value || 0,
        protein: food.foodNutrients?.find((n) => n.nutrientName === 'Protein')?.value || 0,
        carbs: food.foodNutrients?.find((n) => n.nutrientName === 'Carbohydrate, by difference')?.value || 0,
        fat: food.foodNutrients?.find((n) => n.nutrientName === 'Total lipid (fat)')?.value || 0,
      }
    }));
  } catch (error) {
    console.error('Error fetching food data:', error);
    return [];
  }
};

// Función helper para icons
const getFoodIcon = (category) => {
  const icons = {
    'Vegetables': '🥦',
    'Fruits': '🍎',
    'Dairy and Egg Products': '🥛',
    'Protein Foods': '🥩',
    'Grains': '🍞',
    'Snacks': '🍿',
  };
  return icons[category] || '🍽️';
};