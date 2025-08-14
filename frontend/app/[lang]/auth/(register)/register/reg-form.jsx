"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
// import { addUser } from "@/action/auth-action";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { SiteLogo } from "@/components/svg";
import { useMediaQuery } from "@/hooks/use-media-query";

// Esquema de validación actualizado
const schema = z.object({
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  apellido: z.string().min(3, { message: "El apellido debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "El email no es válido." }),
  password: z.string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." })
    .regex(/[A-Z]/, { message: "Debe contener al menos una mayúscula" })
    .regex(/[0-9]/, { message: "Debe contener al menos un número" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});

const RegForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const togglePasswordType = () => {
    setPasswordType(prev => prev === "text" ? "password" : "text");
  };

  const toggleConfirmPasswordType = () => {
    setConfirmPasswordType(prev => prev === "text" ? "password" : "text");
  };

  const onSubmit = (data) => {
    startTransition(async () => {
      try {
        // Eliminamos confirmPassword antes de enviar
        const { confirmPassword, ...userData } = data;
        const response = await addUser(userData);
        
        if (response?.status === "success") {
          toast.success(response?.message);
          reset();
          router.push("/");
        } else {
          toast.error(response?.message || "Error al registrar el usuario");
        }
      } catch (error) {
        toast.error("Error al conectar con el servidor");
      }
    });
  };

  return (
    <div className="w-full">
      <Link href="/dashboard" className="inline-block">
        <SiteLogo className="h-10 w-10 2xl:w-14 2xl:h-14 text-primary" />
      </Link>
      
      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        Hola 👋
      </div>
      <div className="2xl:text-lg text-base text-default-600 mt-2 leading-6">
        Crea una cuenta para comenzar
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 xl:mt-7">
        <div className="space-y-4">
          {/* Campo Nombre */}
          <div>
            <Label htmlFor="nombre" className="mb-2 font-medium text-default-600">
              Nombre
            </Label>
            <Input
              disabled={isPending}
              {...register("nombre")}
              type="text"
              id="nombre"
              className={cn("", { "border-destructive": errors.nombre })}
              size={!isDesktop2xl ? "xl" : "lg"}
            />
            {errors.nombre && (
              <div className="text-destructive mt-2 mb-4">
                {errors.nombre.message}
              </div>
            )}
          </div>

          {/* Campo Apellido */}
          <div>
            <Label htmlFor="apellido" className="mb-2 font-medium text-default-600">
              Apellido
            </Label>
            <Input
              disabled={isPending}
              {...register("apellido")}
              type="text"
              id="apellido"
              className={cn("", { "border-destructive": errors.apellido })}
              size={!isDesktop2xl ? "xl" : "lg"}
            />
            {errors.apellido && (
              <div className="text-destructive mt-2 mb-4">
                {errors.apellido.message}
              </div>
            )}
          </div>

          {/* Campo Email */}
          <div>
            <Label htmlFor="email" className="mb-2 font-medium text-default-600">
              Email
            </Label>
            <Input
              disabled={isPending}
              {...register("email")}
              type="email"
              id="email"
              className={cn("", { "border-destructive": errors.email })}
              size={!isDesktop2xl ? "xl" : "lg"}
            />
            {errors.email && (
              <div className="text-destructive mt-2 mb-4">
                {errors.email.message}
              </div>
            )}
          </div>

          {/* Campo Contraseña */}
          <div>
            <Label htmlFor="password" className="mb-2 font-medium text-default-600">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                type={passwordType}
                id="password"
                size={!isDesktop2xl ? "xl" : "lg"}
                disabled={isPending}
                {...register("password")}
                className={cn("", { "border-destructive": errors.password })}
              />
              <button
                type="button"
                className="absolute top-1/2 -translate-y-1/2 right-4"
                onClick={togglePasswordType}
              >
                {passwordType === "password" ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && (
              <div className="text-destructive mt-2">
                {errors.password.message}
              </div>
            )}
          </div>

          {/* Campo Confirmar Contraseña */}
          <div>
            <Label htmlFor="confirmPassword" className="mb-2 font-medium text-default-600">
              Confirmar Contraseña
            </Label>
            <div className="relative">
              <Input
                type={confirmPasswordType}
                id="confirmPassword"
                size={!isDesktop2xl ? "xl" : "lg"}
                disabled={isPending}
                {...register("confirmPassword")}
                className={cn("", { "border-destructive": errors.confirmPassword })}
              />
              <button
                type="button"
                className="absolute top-1/2 -translate-y-1/2 right-4"
                onClick={toggleConfirmPasswordType}
              >
                {confirmPasswordType === "password" ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="text-destructive mt-2">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-1.5 mb-8">
          <Checkbox
            size="sm"
            className="border-default-300 mt-[1px]"
            id="terms"
            required
          />
          <Label
            htmlFor="terms"
            className="text-sm text-default-600 cursor-pointer whitespace-nowrap"
          >
            Aceptas nuestros Términos y Condiciones
          </Label>
        </div>

        <Button
          className="w-full"
          disabled={isPending}
          size={!isDesktop2xl ? "lg" : "md"}
          type="submit"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Registrando..." : "Crear Cuenta"}
        </Button>
      </form>

      <div className="mt-5 2xl:mt-8 text-center text-base text-default-600">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/auth/login" className="text-primary">
          Inicia Sesión
        </Link>
      </div>
    </div>
  );
};

export default RegForm;