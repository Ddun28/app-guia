export default function SearchSection({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isSearching,
  showSearchResults,
  setShowSearchResults,
  searchResults,
  addCustomItem
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Buscar alimentos
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Ej: manzana, pollo, arroz..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSearching ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        
        {/* Resultados de búsqueda */}
        {showSearchResults && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-900 dark:text-white">Resultados de búsqueda:</h3>
              <button 
                onClick={() => setShowSearchResults(false)}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Cerrar
              </button>
            </div>
            
            {isSearching ? (
              <div className="text-center py-4">
                <p className="text-gray-600 dark:text-gray-300">Buscando alimentos...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map(food => (
                  <div key={food.fdcId} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded">
                    <div className="flex items-center">
                      <span className="mr-2 text-xl">{food.icon}</span>
                      <div>
                        <div className="text-gray-900 dark:text-white">{food.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {food.category.toLowerCase()}
                          {food.nutrients.calories > 0 && ` • ${food.nutrients.calories} kcal/100g`}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => addCustomItem(food)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      Agregar
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 dark:text-gray-300">No se encontraron resultados</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}