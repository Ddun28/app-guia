'use client';

import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet'; 

const FRUIT_CLASSES = [
  'manzana', 'banana', 'naranja', 'uva', 'fresa', 
  'limon', 'mango', 'piña', 'sandia', 'melon',
  'kiwi', 'pera', 'durazno', 'cereza', 'arandano'
];

export function useTensorFlow() {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFoodModel() {
      try {
        // Cargar modelo especializado en alimentos
        const model = await tf.loadGraphModel(
          'https://tfhub.dev/google/tfjs-model/aiy/food_V1/1/default/1', 
          { fromTFHub: true }
        );
        
        setModel(model);
      } catch (error) {
        console.warn('Modelo de comida no disponible, usando MobileNet:', error);
        // Fallback a MobileNet
        const mobilenetModel = await mobilenet.load();
        setModel(mobilenetModel);
      } finally {
        setIsLoading(false);
      }
    }

    loadFoodModel();
  }, []);

  return { model, isLoading };
}