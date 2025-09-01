'use client';

export default function AnalysisResult({ result, isLoading, imageData }) {
  if (isLoading) {
    return (
      <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 dark:text-blue-300">Analizando imagen...</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'buena': return 'text-green-600 dark:text-green-400';
      case 'madura': return 'text-yellow-600 dark:text-yellow-400';
      case 'mala': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'buena': return '✅';
      case 'madura': return '⚠️';
      case 'mala': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Resultado del Análisis
      </h3>
      
      {imageData && (
        <div className="mb-4">
          <img 
            src={imageData} 
            alt="Fruta analizada" 
            className="w-32 h-32 object-cover rounded-lg mx-auto"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className={`text-center p-4 rounded-lg ${getStatusColor(result.estado)} bg-opacity-20`}>
          <div className="text-2xl mb-2">{getStatusIcon(result.estado)}</div>
          <div className="font-semibold">Estado</div>
          <div className="capitalize">{result.estado}</div>
        </div>
        
        <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <div className="text-2xl mb-2">🍎</div>
          <div className="font-semibold">Tipo</div>
          <div className="capitalize">{result.tipo}</div>
        </div>
        
        <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
          <div className="text-2xl mb-2">📊</div>
          <div className="font-semibold">Confianza</div>
          <div>{(result.confianza * 100).toFixed(1)}%</div>
        </div>
      </div>

      {result.recomendaciones && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Recomendaciones:
          </h4>
          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
            {result.recomendaciones.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}