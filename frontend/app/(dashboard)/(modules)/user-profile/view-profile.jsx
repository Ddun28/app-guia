"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";
import { Eye, EyeOff, User, MapPin, Lock, Calendar, Phone } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfilePage() {
  const { user, updateProfile, loadUserProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      new_password: "",
      new_password_confirmation: "",
      edad: "",
      estado_civil: "",
      sexo: "",
      fecha_nacimiento: "",
      telefono: "",
      ubicacion_ciudad: "",
      ubicacion_pais: ""
    }
  });

  const newPassword = watch("new_password");

  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true);
        const profileData = await loadUserProfile();
        resetForm(profileData);
      } catch (error) {
        toast.error("Error al cargar el perfil");
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [loadUserProfile]);

  const resetForm = (data) => {
    reset({
      nombre: data?.nombre || "",
      apellido: data?.apellido || "",
      email: data?.email || "",
      new_password: "",
      new_password_confirmation: "",
      edad: data?.profile?.edad || "",
      estado_civil: data?.profile?.estado_civil || "",
      sexo: data?.profile?.sexo || "",
      fecha_nacimiento: data?.profile?.fecha_nacimiento?.split('T')[0] || "",
      telefono: data?.profile?.telefono || "",
      ubicacion_ciudad: data?.profile?.ubicacion?.ciudad || "",
      ubicacion_pais: data?.profile?.ubicacion?.pais || ""
    });
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    
    try {
      const payload = {
        userData: {
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          new_password: formData.new_password,
          new_password_confirmation: formData.new_password_confirmation
        },
        profileData: {
          edad: formData.edad ? parseInt(formData.edad) : undefined,
          estado_civil: formData.estado_civil,
          sexo: formData.sexo,
          fecha_nacimiento: formData.fecha_nacimiento,
          telefono: formData.telefono,
          ubicacion: {
            ciudad: formData.ubicacion_ciudad,
            pais: formData.ubicacion_pais
          }
        }
      };

      await updateProfile(payload);
      toast.success("Perfil actualizado correctamente");
      reset({
        ...formData,
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (error) {
      toast.error(error.message || "Error al actualizar perfil");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Actualiza tu información personal y preferencias
        </p>
      </div>

      <Card className="shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">
                Información Personal
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Gestiona tus datos básicos y preferencias
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
            {/* Sección de datos básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Datos Personales
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nombre" className="text-sm font-medium text-gray-900 dark:text-white">
                      Nombre *
                    </Label>
                    <Input
                      id="nombre"
                      type="text"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      {...register("nombre", { required: "El nombre es requerido." })}
                      aria-invalid={errors.nombre ? "true" : "false"}
                    />
                    {errors.nombre && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nombre.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="apellido" className="text-sm font-medium text-gray-900 dark:text-white">
                      Apellido *
                    </Label>
                    <Input
                      id="apellido"
                      type="text"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      {...register("apellido", { required: "El apellido es requerido." })}
                      aria-invalid={errors.apellido ? "true" : "false"}
                    />
                    {errors.apellido && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.apellido.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-white">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      className="mt-1 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                      disabled
                      {...register("email", { 
                        required: "El email es requerido.",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email inválido"
                        }
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Sección de perfil */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-500 dark:text-green-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Información Adicional
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edad" className="text-sm font-medium text-gray-900 dark:text-white">
                      Edad
                    </Label>
                    <Input
                      id="edad"
                      type="number"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      min="13"
                      max="120"
                      {...register("edad", {
                        min: { value: 13, message: "Edad mínima 13 años" },
                        max: { value: 120, message: "Edad máxima 120 años" }
                      })}
                    />
                    {errors.edad && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.edad.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sexo" className="text-sm font-medium text-gray-900 dark:text-white">
                        Sexo
                      </Label>
                      <Controller
                        name="sexo"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                              <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                              <SelectItem value="masculino" className="dark:hover:bg-gray-700">
                                Masculino
                              </SelectItem>
                              <SelectItem value="femenino" className="dark:hover:bg-gray-700">
                                Femenino
                              </SelectItem>
                              <SelectItem value="otro" className="dark:hover:bg-gray-700">
                                Otro
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div>
                      <Label htmlFor="estado_civil" className="text-sm font-medium text-gray-900 dark:text-white">
                        Estado Civil
                      </Label>
                      <Controller
                        name="estado_civil"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                              <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                              <SelectItem value="soltero" className="dark:hover:bg-gray-700">
                                Soltero/a
                              </SelectItem>
                              <SelectItem value="casado" className="dark:hover:bg-gray-700">
                                Casado/a
                              </SelectItem>
                              <SelectItem value="divorciado" className="dark:hover:bg-gray-700">
                                Divorciado/a
                              </SelectItem>
                              <SelectItem value="viudo" className="dark:hover:bg-gray-700">
                                Viudo/a
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fecha_nacimiento" className="text-sm font-medium text-gray-900 dark:text-white">
                      Fecha de Nacimiento
                    </Label>
                    <Input
                      id="fecha_nacimiento"
                      type="date"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      {...register("fecha_nacimiento")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefono" className="text-sm font-medium text-gray-900 dark:text-white">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Teléfono
                    </Label>
                    <Input
                      id="telefono"
                      type="tel"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      {...register("telefono", {
                        pattern: {
                          value: /^[0-9+\- ]+$/,
                          message: "Teléfono inválido"
                        }
                      })}
                    />
                    {errors.telefono && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.telefono.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="dark:bg-gray-700" />

            {/* Sección de ubicación */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ubicación</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="ubicacion_ciudad" className="text-sm font-medium text-gray-900 dark:text-white">
                    Ciudad
                  </Label>
                  <Input
                    id="ubicacion_ciudad"
                    type="text"
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Ej: Caracas"
                    {...register("ubicacion_ciudad")}
                  />
                </div>
                <div>
                  <Label htmlFor="ubicacion_pais" className="text-sm font-medium text-gray-900 dark:text-white">
                    País
                  </Label>
                  <Input
                    id="ubicacion_pais"
                    type="text"
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Ej: Venezuela"
                    {...register("ubicacion_pais")}
                  />
                </div>
              </div>
            </div>

            <Separator className="dark:bg-gray-700" />

            {/* Sección de contraseña */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-red-500 dark:text-red-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Seguridad</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new_password" className="text-sm font-medium text-gray-900 dark:text-white">
                    Nueva contraseña (opcional)
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="new_password"
                      type={showPassword ? "text" : "password"}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Mínimo 6 caracteres"
                      {...register("new_password", {
                        minLength: {
                          value: 6,
                          message: "Mínimo 6 caracteres",
                        },
                      })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.new_password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.new_password.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="new_password_confirmation" className="text-sm font-medium text-gray-900 dark:text-white">
                    Confirmar contraseña
                  </Label>
                  <Input
                    id="new_password_confirmation"
                    type={showPassword ? "text" : "password"}
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Repite tu contraseña"
                    {...register("new_password_confirmation", {
                      validate: (value) =>
                        value === newPassword || "Las contraseñas no coinciden",
                    })}
                  />
                  {errors.new_password_confirmation && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.new_password_confirmation.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => resetForm(user)}
                disabled={loading}
                className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || (!isDirty && !newPassword)}
                className="min-w-32 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}