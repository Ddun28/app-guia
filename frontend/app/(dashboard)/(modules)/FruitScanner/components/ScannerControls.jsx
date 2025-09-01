'use client';

export default function ScannerControls({
  isCameraActive,
  isAnalyzing,
  onStartCamera,
  onStopCamera,
  onSwitchCamera,
  onCapture,
  onReset
}) {
  return (
    <div className="flex flex-wrap gap-4 justify-center mt-6">
      {!isCameraActive ? (
        <button
          onClick={onStartCamera}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          🎥 Activar Cámara
        </button>
      ) : (
        <>
          <button
            onClick={onCapture}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
          >
            {isAnalyzing ? '🔍 Analizando...' : '📸 Capturar'}
          </button>
          <button
            onClick={onSwitchCamera}
            className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            🔄 Cambiar Cámara
          </button>
          <button
            onClick={onStopCamera}
            className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            ⏹️ Detener
          </button>
        </>
      )}
      
      <button
        onClick={onReset}
        className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
      >
        🔄 Reiniciar
      </button>
    </div>
  );
}