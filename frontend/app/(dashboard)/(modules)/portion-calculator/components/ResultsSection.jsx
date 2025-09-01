export default function ResultsSection({
  numberOfPeople,
  numberOfDays,
  selectedItems,
  setSelectedItems,
  filteredResults,
  toggleItemSelection
}) {
  return (
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
          onClick={() => {
            const allItemIds = filteredResults.map(r => r.item.id);
            setSelectedItems(allItemIds);
          }}
          className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Seleccionar todos
        </button>
        {selectedItems.length > 0 && (
          <button
            onClick={() => setSelectedItems([])}
            className="px-3 py-1 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700"
          >
            Deseleccionar todos ({selectedItems.length})
          </button>
        )}
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 self-center">
          {selectedItems.length} seleccionados
        </span>
      </div>

      {filteredResults.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResults.map((result) => (
              <div
                key={result.item.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
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
                    <span className="text-blue-600 dark:text-blue-400 text-xl">✓</span>
                  )}
                </div>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {result.totalQuantity} {result.calculatedUnit}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {result.item.category}
                </p>
              </div>
            ))}
          </div>
          
          {/* Mensaje cuando hay selecciones */}
          {selectedItems.length > 0 && (
            <div className="mt-6 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                ✅ <strong>{selectedItems.length} producto(s) seleccionado(s)</strong> - 
                Puedes imprimir, copiar o exportar como PDF solo los items seleccionados.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No hay alimentos en la lista. Agrega algunos usando la búsqueda de USDA.</p>
        </div>
      )}
    </div>
  );
}