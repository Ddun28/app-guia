"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertTriangle, PlusCircle } from "lucide-react";
import { createAlert, createPlace } from "@/app/api/maps/maps";

const initialState = {
  type: "alert", // "alert" or "place"
  category: "critical", // for alert: critical/warning/info, for place: restaurant/cafe/park/museum/transport
  name: "",
  description: "",
  latitude: "",
  longitude: ""
};

const alertCategories = [
  { value: "critical", label: "Crítica" },
  { value: "warning", label: "Advertencia" },
  { value: "info", label: "Información" }
];
const placeCategories = [
  { value: "restaurant", label: "Restaurante" },
  { value: "cafe", label: "Café" },
  { value: "park", label: "Parque" },
  { value: "museum", label: "Museo" },
  { value: "transport", label: "Transporte" }
];

export default function AlertPlaceForm({ onCreated }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [locating, setLocating] = useState(false);
  // Obtener ubicación del navegador
  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError("La geolocalización no está soportada en este navegador.");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({
          ...form,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString()
        });
        setLocating(false);
      },
      (err) => {
        setError("No se pudo obtener la ubicación. Permiso denegado o error.");
        setLocating(false);
      }
    );
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (!form.name || !form.description || !form.latitude || !form.longitude) {
        setError("Todos los campos son obligatorios.");
        setLoading(false);
        return;
      }
      let payload;
      if (form.type === "alert") {
        payload = {
          title: form.name,
          description: form.description,
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
          type: form.category
        };
        await createAlert(payload);
        setSuccess("Alerta creada exitosamente.");
      } else {
        payload = {
          name: form.name,
          description: form.description,
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
          type: form.category
        };
        await createPlace(payload);
        setSuccess("Lugar creado exitosamente.");
      }
      setForm(initialState);
      if (onCreated) onCreated();
    } catch (err) {
      setError("Error al crear. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/90 dark:bg-slate-900/90 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Crear Alerta/Lugar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="alert"
                checked={form.type === "alert"}
                onChange={handleChange}
              />
              <AlertTriangle className="w-4 h-4" /> Alerta
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="place"
                checked={form.type === "place"}
                onChange={handleChange}
              />
              <MapPin className="w-4 h-4" /> Lugar
            </label>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Categoría</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-slate-800"
            >
              {(form.type === "alert" ? alertCategories : placeCategories).map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Nombre</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={form.type === "alert" ? "Título de la alerta" : "Nombre del lugar"}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Descripción</label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descripción breve"
              rows={3}
            />
          </div>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Latitud</label>
              <Input
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="Ej: 10.4806"
                type="number"
                step="any"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Longitud</label>
              <Input
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="Ej: -66.9036"
                type="number"
                step="any"
              />
            </div>
            <Button type="button" variant="outline" onClick={handleLocate} disabled={locating} className="whitespace-nowrap">
              {locating ? "Obteniendo..." : "Usar mi ubicación"}
            </Button>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creando..." : "Crear"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
