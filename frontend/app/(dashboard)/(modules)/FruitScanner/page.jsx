// components/FruitScanner/FruitScanner.jsx
'use client';

import { useState, useCallback } from 'react';
import { useTensorFlow } from '@/hooks/useTensorFlow';
import { useCamera } from '@/hooks/useCamera';
import CameraView from './components/ CameraView';
import ScannerControls from './components/ScannerControls';
import AnalysisResult from './components/AnalysisResult';

// Simulador de análisis de frutas (en producción conectarías con un modelo especializado)
const analyzeFruit = async (predictions) => {
  // Simular procesamiento
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Aquí integrarías con un modelo especializado en frutas
  // Por ahora simulamos resultados basados en MobileNet
  const fruitKeywords = ['apple', 'banana', 'orange', 'fruit', 'food'];
  const isFruit = predictions.some(p => 
    fruitKeywords.some(keyword => p.className.toLowerCase().includes(keyword))
  );

  if (!isFruit) {
    throw new Error('No se detectó una fruta en la imagen');
  }

  // Simular análisis de estado
  const estados = ['buena', 'madura', 'mala'];
  const estado = estados[Math.floor(Math.random() * estados.length)];
  
  const recomendaciones = {
    buena: ['Ideal para consumo inmediato', 'Puede almacenarse por algunos días más'],
    madura: ['Consumir dentro de 24 horas', 'Ideal para batidos o postres'],
    mala: ['No recomendado para consumo', 'Considerar descartar']
  };

  return {
    tipo: predictions[0]?.className || 'Fruta no identificada',
    estado,
    confianza: predictions[0]?.probability || 0.7,
    recomendaciones: recomendaciones[estado] || []
  };
};

export default function FruitScanner() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const { classifyImage, isLoading: modelLoading, error: modelError } = useTensorFlow();
  const { videoRef, isCameraActive, startCamera, stopCamera, switchCamera, capturePhoto } = useCamera();

  const handleCapture = useCallback(async () => {
    try {
      setIsAnalyzing(true);
      setError(null);

      // Capturar foto
      const imageData = capturePhoto();
      setCapturedImage(imageData);

      // Crear elemento de imagen para clasificación
      const img = new Image();
      img.src = imageData;
      await img.decode();

      // Clasificar con MobileNet
      const predictions = await classifyImage(img);
      
      // Analizar específicamente para frutas
      const result = await analyzeFruit(predictions);
      setAnalysisResult(result);

    } catch (err) {
      setError(err.message);
      console.error('Error analyzing image:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [classifyImage, capturePhoto]);

  const handleStartCamera = useCallback(async () => {
    try {
      setError(null);
      await startCamera();
    } catch (err) {
      setError(err.message);
    }
  }, [startCamera]);

  const handleStopCamera = useCallback(() => {
    stopCamera();
    setAnalysisResult(null);
    setCapturedImage(null);
  }, [stopCamera]);

  const handleReset = useCallback(() => {
    handleStopCamera();
    setError(null);
    setAnalysisResult(null);
    setCapturedImage(null);
  }, [handleStopCamera]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Escáner de Frutas
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Analiza el estado de tus frutas usando inteligencia artificial
          </p>
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {modelError && (
          <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
            <p className="text-yellow-700 dark:text-yellow-300">{modelError}</p>
          </div>
        )}

        {/* Cámara */}
        <CameraView 
          videoRef={videoRef} 
          isActive={isCameraActive} 
        />

        {/* Controles */}
        <ScannerControls
          isCameraActive={isCameraActive}
          isAnalyzing={isAnalyzing || modelLoading}
          onStartCamera={handleStartCamera}
          onStopCamera={handleStopCamera}
          onSwitchCamera={switchCamera}
          onCapture={handleCapture}
          onReset={handleReset}
        />

        {/* Resultados */}
        <AnalysisResult
          result={analysisResult}
          isLoading={isAnalyzing}
          imageData={capturedImage}
        />

        {/* Información de uso */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            💡 Cómo usar el escáner:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200">
            <li>Activa la cámara y apunta hacia la fruta</li>
            <li>Asegúrate de que la fruta esté bien iluminada</li>
            <li>Mantén la cámara estable y presiona "Capturar"</li>
            <li>Espera a que el sistema analice la imagen</li>
            <li>Revisa los resultados y recomendaciones</li>
          </ol>
        </div>
      </div>
    </div>
  );
}