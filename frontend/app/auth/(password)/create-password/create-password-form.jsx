"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { SiteLogo } from "@/components/svg";
import { useMediaQuery } from "@/hooks/use-media-query";
import { resetPassword, verifyResetToken } from "@/api/users/user"; 

// Esquema de validación
const schema = z.object({
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
  confirmPassword: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

const ResetPasswordForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const [newPasswordType, setNewPasswordType] = React.useState(false);
  const [confirmPasswordType, setConfirmPasswordType] = React.useState(false);
  const [token, setToken] = React.useState(null);
  const [tokenValid, setTokenValid] = React.useState(null);
  
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
  });

  // Verificar token al cargar el componente
  React.useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      verifyToken(tokenFromUrl);
    } else {
      setTokenValid(false);
      toast.error('Token de restablecimiento no válido');
    }
  }, [searchParams]);

  // Función para verificar el token usando el servicio
  const verifyToken = async (token) => {
    try {
      const response = await verifyResetToken(token);
      if (response.message === 'Token válido') {
        setTokenValid(true);
      } else {
        setTokenValid(false);
        toast.error('El enlace de restablecimiento ha expirado o no es válido');
      }
    } catch (error) {
      setTokenValid(false);
      toast.error(error.response?.data?.message || 'Error al verificar el enlace');
    }
  };

  const onSubmit = (data) => {
    if (!token) {
      toast.error('Token no válido');
      return;
    }

    startTransition(async () => {
      try {
        await resetPassword(token, data.password);
        toast.success('Contraseña restablecida exitosamente');
        reset();
        router.push('/auth/login');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error al restablecer la contraseña');
      }
    });
  };

  if (tokenValid === null) {
    return (
      <div className="w-full text-center">
        <div className="flex justify-center mb-6">
          <SiteLogo className="h-10 w-10 2xl:w-14 2xl:h-14 text-primary" />
        </div>
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-default-600">Verificando enlace...</p>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="w-full text-center">
        <div className="flex justify-center mb-6">
          <SiteLogo className="h-10 w-10 2xl:w-14 2xl:h-14 text-primary" />
        </div>
        <div className="text-destructive text-2xl font-bold mb-4">
          Enlace Inválido
        </div>
        <p className="text-default-600 mb-4">
          El enlace de restablecimiento ha expirado o no es válido.
        </p>
        <Link href="/auth/forgot-password" className="text-primary hover:underline">
          Solicitar nuevo enlace
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Link href="/" className="inline-block">
        <SiteLogo className="h-10 w-10 2xl:w-14 2xl:h-14 text-primary" />
      </Link>
      <div className="2xl:mt-8 mt-6 2xl:text-3xl lg:text-2xl text-xl font-bold text-default-900">
        Crear Nueva Contraseña
      </div>
      <div className="2xl:text-lg text-base text-default-600 mt-2 leading-6">
        Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta.
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 xl:mt-7">
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="password"
              className="mb-2 font-medium text-default-600"
            >
              Nueva Contraseña
            </Label>
            <div className="relative">
              <Input
                disabled={isPending}
                {...register("password")}
                type={newPasswordType ? "text" : "password"}
                id="password"
                size={!isDesktop2xl ? "xl" : "lg"}
                className={cn("", {
                  "border-destructive": errors.password,
                })}
                placeholder="Mínimo 6 caracteres"
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
                onClick={() => setNewPasswordType(!newPasswordType)}
              >
                {newPasswordType ? (
                  <Icon
                    icon="heroicons:eye"
                    className="w-5 h-5 text-default-400"
                  />
                ) : (
                  <Icon
                    icon="heroicons:eye-slash"
                    className="w-5 h-5 text-default-400"
                  />
                )}
              </div>
            </div>
            {errors.password && (
              <div className="text-destructive mt-2 text-sm">
                {errors.password.message}
              </div>
            )}
          </div>
          <div>
            <Label
              htmlFor="confirmPassword"
              className="mb-2 font-medium text-default-600"
            >
              Confirmar Contraseña
            </Label>
            <div className="relative">
              <Input
                disabled={isPending}
                {...register("confirmPassword")}
                type={confirmPasswordType ? "text" : "password"}
                id="confirmPassword"
                className={cn("", {
                  "border-destructive": errors.confirmPassword,
                })}
                size={!isDesktop2xl ? "xl" : "lg"}
                placeholder="Repite tu contraseña"
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
                onClick={() => setConfirmPasswordType(!confirmPasswordType)}
              >
                {confirmPasswordType ? (
                  <Icon
                    icon="heroicons:eye"
                    className="w-5 h-5 text-default-400"
                  />
                ) : (
                  <Icon
                    icon="heroicons:eye-slash"
                    className="w-5 h-5 text-default-400"
                  />
                )}
              </div>
            </div>
            {errors.confirmPassword && (
              <div className="text-destructive mt-2 text-sm">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center gap-1.5 mt-5 ">
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
            Acepto los Términos y Condiciones
          </Label>
        </div>
        <Button 
          className="w-full mt-8" 
          size="lg"
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Restableciendo..." : "Restablecer Contraseña"}
        </Button>
      </form>
      <div className="mt-5 2xl:mt-8 text-center text-base text-default-600">
        ¿Volver al?{" "}
        <Link href="/auth/login" className="text-primary hover:underline">
          Inicio de Sesión
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordForm;