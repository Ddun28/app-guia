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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { SiteLogo } from "@/components/svg";
import { forgotPassword } from "@/api/users/user"; 

const schema = z.object({
  email: z.string().email({ message: "El email no es válido." }),
});

const ForgotForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
  });

  const onSubmit = (data) => {
    startTransition(async () => {
      try {
        await forgotPassword(data.email);
        toast.success("Si el email existe, recibirás un enlace para restablecer tu contraseña");
        reset();
        router.push("/auth/login");
      } catch (errory) {
        toast.error(error.response?.data?.message || 'Error al enviar el email de recuperación');
      }
    });
  };

  return (
    <div className="w-full">
      <Link href="/" className="inline-block">
        <SiteLogo className="h-10 w-10 2xl:w-14 2xl:h-14 text-primary" />
      </Link>
      
      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        ¿Olvidaste tu Contraseña?
      </div>
      
      <div className="2xl:text-lg text-base text-default-600 mt-2 leading-6">
        Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 xl:mt-7">
        <div>
          <Label htmlFor="email" className="mb-2 font-medium text-default-600">
            Email
          </Label>
          <Input
            disabled={isPending}
            {...register("email")}
            type="email"
            id="email"
            className={cn("", {
              "border-destructive": errors.email,
            })}
            size={!isDesktop2xl ? "xl" : "lg"}
            placeholder="tu@email.com"
          />
          {errors.email && (
            <div className="text-destructive mt-2 text-sm">
              {errors.email.message}
            </div>
          )}
        </div>

        <Button 
          className="w-full mt-6" 
          size={!isDesktop2xl ? "lg" : "md"}
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Enviando..." : "Enviar Email de Recuperación"}
        </Button>
      </form>
      
      <div className="mt-5 2xl:mt-8 text-center text-base text-default-600">
        ¿Recordaste tu contraseña?{" "}
        <Link href="/auth/login" className="text-primary hover:underline">
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
};

export default ForgotForm;