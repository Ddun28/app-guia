"use client";
import React, { useEffect, useState } from "react";
import { getAlerts, getPlaces, getSafeRoutes, getRecommendedPlaces } from "@/app/api/maps/maps";
import { useAuthStore } from "@/store/auth.store";
import L from "leaflet";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, AlertTriangle, Router, Navigation, Filter, RefreshCw } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import AlertPlaceForm from "@/components/AlertPlaceForm";

// Función para crear iconos personalizados
const createCustomIcon = (color) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
    className: "custom-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export default function ViewMaps() {
  const { user } = useAuthStore();
  const [alerts, setAlerts] = useState([]);
  const [places, setPlaces] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("map");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [mapReady, setMapReady] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  // Componente para centrar el mapa y abrir el popup
  function FlyToPlace({ place }) {
    const map = useMap();
    useEffect(() => {
      if (place && map) {
        map.flyTo([place.latitude, place.longitude], 17, { duration: 1 });
      }
    }, [place, map]);
    return null;
  }
  // Componente para centrar el mapa y abrir el popup de alerta
  function FlyToAlert({ alert }) {
    const map = useMap();
    useEffect(() => {
      if (alert && map) {
        map.flyTo([alert.latitude, alert.longitude], 17, { duration: 1 });
      }
    }, [alert, map]);
    return null;
  }

  const ciudad = user?.profile?.ubicacion?.ciudad || "Caracas";
  const pais = user?.profile?.ubicacion?.pais || "Venezuela";

  useEffect(() => {
    fetchData();
    setMapReady(true);
    fetchRecommended();
  }, [ciudad, selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [alertsData, placesData, routesData] = await Promise.all([
        getAlerts({ ciudad }),
        getPlaces({ ciudad, type: selectedCategory === "all" ? undefined : selectedCategory }),
        getSafeRoutes({ origin: ciudad, destination: "Centro" })
      ]);
      setAlerts(alertsData);
      setPlaces(placesData);
      setRoutes(routesData);
    } catch (error) {
      console.error("Error cargando datos urbanos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommended = async () => {
    try {
      const data = await getRecommendedPlaces({ ciudad, pais });
      setRecommendedPlaces(data);
    } catch (error) {
      setRecommendedPlaces([]);
    }
  };

  const cityCoords = {
    Caracas: { lat: 10.4806, lng: -66.9036 },
    Maracaibo: { lat: 10.6427, lng: -71.6125 },
    Valencia: { lat: 10.1620, lng: -68.0076 },
    Barquisimeto: { lat: 10.0731, lng: -69.3227 },
    "Ciudad Guayana": { lat: 8.3533, lng: -62.6419 }
  };

  const center = cityCoords[ciudad] || { lat: 10.4806, lng: -66.9036 };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getPlaceColor = (type) => {
    switch (type) {
      case 'restaurant': return '#ef4444';
      case 'cafe': return '#f59e0b';
      case 'park': return '#22c55e';
      case 'museum': return '#8b5cf6';
      case 'transport': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Mapa Urbano Inteligente
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explorando {ciudad}, {pais} • Tu seguridad es nuestra prioridad
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Botón para mostrar el formulario */}
            <div className="mb-4">
              <Button variant="success" className="w-full" onClick={() => setShowForm((v) => !v)}>
                {showForm ? "Cerrar formulario" : "Crear alerta/lugar"}
              </Button>
            </div>

            {/* Formulario de creación */}
            {showForm && (
              <AlertPlaceForm onCreated={() => { setShowForm(false); fetchData(); }} />
            )}
            {/* Filtros */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Categorías</label>
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border rounded-md bg-white dark:bg-slate-700"
                    >
                      <option value="all">Todos los lugares</option>
                      <option value="restaurant">Restaurantes</option>
                      <option value="cafe">Cafés</option>
                      <option value="park">Parques</option>
                      <option value="museum">Museos</option>
                      <option value="transport">Transporte</option>
                    </select>
                  </div>
                  <Button onClick={fetchData} className="w-full" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualizar datos
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas rápidas */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Lugares cercanos</span>
                  <Badge variant="secondary">{places.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Alertas activas</span>
                  <Badge variant="secondary">{alerts.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Rutas seguras</span>
                  <Badge variant="secondary">{routes.length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Alertas recientes */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Alertas Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : alerts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay alertas recientes</p>
                ) : (
                  <div className="space-y-3">
                    {alerts.slice(0, 3).map((alert) => (
                      <div
                        key={alert._id}
                        className={`p-3 rounded-lg border cursor-pointer transition ${selectedAlert?._id === alert._id ? 'border-red-500 bg-red-50 dark:bg-red-900/30' : ''}`}
                        style={{ borderLeft: `4px solid ${getAlertColor(alert.type)}` }}
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <div className="font-medium">{alert.title}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{alert.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Lugares recomendados */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Lugares recomendados</CardTitle>
              </CardHeader>
              <CardContent>
                {recommendedPlaces.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No hay recomendaciones disponibles
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {recommendedPlaces.map((place) => (
                    <div key={place.fsq_id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{place.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {place.categories?.[0]?.name}
                        </p>
                        <p className="text-sm mt-1">{place.location?.formatted_address}</p>
                        
                        {/* Mostrar rating si existe */}
                        {place.rating && (
                          <div className="flex items-center mt-2">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm ml-1">{place.rating}</span>
                          </div>
                        )}
                      </div>
                      
                    </div>
                  ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Mapa y contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mapa */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-6 h-6" />
                  Mapa Interactivo
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Explora lugares y alertas en tiempo real
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full h-96">
                  {mapReady ? (
                    <MapContainer 
                      center={center} 
                      zoom={13} 
                      style={{ height: "100%", width: "100%" }}
                      className="rounded-b-lg"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      
                      {places.map((place) => (
                        <Marker 
                          key={place._id} 
                          position={[place.latitude, place.longitude]}
                          icon={createCustomIcon(getPlaceColor(place.type))}
                          eventHandlers={{
                            popupopen: () => setSelectedPlace(place)
                          }}
                        >
                          <Popup autoPan>
                            <div className="p-2">
                              <h3 className="font-bold">{place.name}</h3>
                              <p className="text-sm capitalize">{place.type}</p>
                              <p className="text-xs text-gray-600">{place.description}</p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                      {selectedPlace && <FlyToPlace place={selectedPlace} />}
                      
                      {alerts.map((alert) => (
                        <CircleMarker
                          key={alert._id}
                          center={[alert.latitude, alert.longitude]}
                          radius={15}
                          color={getAlertColor(alert.type)}
                          fillColor={getAlertColor(alert.type)}
                          fillOpacity={0.6}
                          eventHandlers={{
                            popupopen: () => setSelectedAlert(alert)
                          }}
                        >
                          <Popup autoPan>
                            <div className="p-2">
                              <h3 className="font-bold">{alert.title}</h3>
                              <p className="text-sm">{alert.description}</p>
                              <Badge 
                                className="mt-2 capitalize"
                                style={{ backgroundColor: getAlertColor(alert.type) }}
                              >
                                {alert.type}
                              </Badge>
                            </div>
                          </Popup>
                        </CircleMarker>
                      ))}
                      {selectedAlert && <FlyToAlert alert={selectedAlert} />}
                    </MapContainer>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100">
                      <p>Cargando mapa...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resto del código permanece igual */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="places" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Lugares
                </TabsTrigger>
                <TabsTrigger value="routes" className="flex items-center gap-2">
                  <Router className="w-4 h-4" />
                  Rutas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="places">
                <Card>
                  <CardHeader>
                    <CardTitle>Lugares Destacados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <Skeleton key={i} className="h-20 w-full" />
                        ))}
                      </div>
                    ) : places.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        No hay lugares disponibles
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {places.map((place) => (
                          <div key={place._id} className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition ${selectedPlace?._id === place._id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : ''}`}
                            onClick={() => setSelectedPlace(place)}
                          >
                            <div 
                              className="w-4 h-4 rounded-full mt-2 flex-shrink-0"
                              style={{ backgroundColor: getPlaceColor(place.type) }}
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold">{place.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{place.type}</p>
                              <p className="text-sm mt-1">{place.description}</p>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {place.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="routes">
                <Card>
                  <CardHeader>
                    <CardTitle>Rutas Seguras</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2].map(i => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))}
                      </div>
                    ) : routes.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Router className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        No hay rutas disponibles
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {routes.map((route) => (
                          <div key={route._id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{route.origin} → {route.destination}</h3>
                              <Badge variant="success">Segura</Badge>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Duración: {route.duration} min • Distancia: {(route.distance / 1000).toFixed(1)} km
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .leaflet-container {
          font-family: inherit;
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}