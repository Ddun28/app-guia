"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { SiteLogo } from "@/components/svg";
import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { login } from "@/app/api/auth/auth"; 
import { useAuthStore } from '@/store/auth.store';

// Iconos para login social
import googleIcon from "@/public/images/auth/google.png";
import facebook from "@/public/images/auth/facebook.png";
import twitter from "@/public/images/auth/twitter.png";
import GithubIcon from "@/public/images/auth/github.png";

const schema = z.object({
  email: z.string().email({ message: "El correo electrónico no es válido." }),
  password: z.string().min(4, { message: "La contraseña debe tener al menos 4 caracteres" }),
});

const LogInForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = React.useState("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

      const { loadUserProfile } = useAuthStore();

   const onSubmit = async (data) => {
    startTransition(async () => {
      try {
        const response = await login({
          email: data.email,
          password: data.password,
        });

        if (response?.error) {
          toast.error(response.message || "Error al iniciar sesión");
          return;
        }

        if (response?.access_token) {
          try {
            await loadUserProfile(response.access_token);
            toast.success(response.message || "Inicio de sesión exitoso");
            router.push("/dashboard");
          } catch (profileError) {
            console.error("Error loading profile:", profileError);
            toast.error("Error al cargar el perfil del usuario");
          }
        } else {
          toast.error("Error inesperado al iniciar sesión");
        }
      } catch (error) {
        // Maneja errores de la promesa del login
        if (error.response?.data) {
          const errorData = error.response.data;
          toast.error(errorData.message || "Error al iniciar sesión");
        } else if (error.request) {
          toast.error("Error de conexión con el servidor");
        } else {
          toast.error("Error inesperado");
        }
        console.error("Login error:", error);
      }
    });
  };

  const handleSocialLogin = (provider) => {
    signIn(provider, {
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="w-full py-10">
      <Link href="/dashboard" className="inline-block">
        <SiteLogo className="h-10 w-10 2xl:w-14 2xl:h-14 text-primary" />
      </Link>

      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        ¡Hola! 👋
      </div>
      
      <div className="2xl:text-lg text-base text-default-600 2xl:mt-2 leading-6">
        Ingresa la información que usaste al registrarte.
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7">
        <div>
          <Label htmlFor="email" className="mb-2 font-medium text-default-600">
            Correo electrónico
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
            <div className="text-destructive mt-2">{errors.email.message}</div>
          )}
        </div>

        <div className="mt-3.5">
          <Label htmlFor="password" className="mb-2 font-medium text-default-600">
            Contraseña
          </Label>
          <div className="relative">
            <Input
              disabled={isPending}
              {...register("password")}
              type={passwordType}
              id="password"
              className="peer"
              size={!isDesktop2xl ? "xl" : "lg"}
              placeholder=" "
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer"
              onClick={() => setPasswordType(prev => prev === "password" ? "text" : "password")}
            >
              <Icon
                icon={passwordType === "password" ? "heroicons:eye" : "heroicons:eye-slash"}
                className="w-5 h-5 text-default-400"
              />
            </div>
          </div>
          {errors.password && (
            <div className="text-destructive mt-2">{errors.password.message}</div>
          )}
        </div>

        <div className="mt-5 mb-8 flex flex-wrap gap-2">
          <div className="flex-1 flex items-center gap-1.5">
            <Checkbox
              size="sm"
              className="border-default-300 mt-[1px]"
              id="rememberMe"
            />
            <Label htmlFor="rememberMe" className="text-sm text-default-600 cursor-pointer whitespace-nowrap">
              Recordarme
            </Label>
          </div>
          <Link href="/auth/forgot" className="flex-none text-sm text-primary">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button
          className="w-full"
          disabled={isPending}
          size={!isDesktop2xl ? "lg" : "md"}
          type="submit"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Cargando..." : "Iniciar sesión"}
        </Button>
      </form>

      <div className="mt-6 xl:mt-8 flex flex-wrap justify-center gap-4">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full border-default-300 hover:bg-transparent"
          disabled={isPending}
          onClick={() => handleSocialLogin("google")}
        >
          <Image src={googleIcon} alt="Google" className="w-5 h-5" />
        </Button>
        
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full border-default-300 hover:bg-transparent"
          disabled={isPending}
          onClick={() => handleSocialLogin("github")}
        >
          <Image src={GithubIcon} alt="GitHub" className="w-5 h-5" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full border-default-300 hover:bg-transparent"
          disabled={isPending}
          onClick={() => handleSocialLogin("facebook")}
        >
          <Image src={facebook} alt="Facebook" className="w-5 h-5" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full border-default-300 hover:bg-transparent"
          disabled={isPending}
          onClick={() => handleSocialLogin("twitter")}
        >
          <Image src={twitter} alt="Twitter" className="w-5 h-5" />
        </Button>
      </div>

      <div className="mt-5 2xl:mt-8 text-center text-base text-default-600">
        ¿No tienes una cuenta?{" "}
        <Link href="/auth/register" className="text-primary">
          Regístrate
        </Link>
      </div>
    </div>
  );
};

export default LogInForm;