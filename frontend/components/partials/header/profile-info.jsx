"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/app/api/auth/auth";
import toast from "react-hot-toast";
import Link from "next/link";

const ProfileInfo = () => {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
  try {
    const logoutPromise = logout(); 

    toast.promise(logoutPromise, {
      loading: 'Cerrando sesión...',
      success: () => {
        clearAuth();
        router.push("/auth/login");
        return '¡Sesión cerrada con éxito!';
      },
      error: (error) => {
        console.error("Logout error:", error);
        return error.message || 'Error al cerrar sesión';
      },
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    toast.error('Ocurrió un error inesperado');
  }
};

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon 
              icon="heroicons:user-circle" 
              className="w-6 h-6 text-primary" 
            />
          </div>
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56 p-0" align="end">
        <DropdownMenuLabel className="flex gap-2 items-center mb-1 p-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon 
              icon="heroicons:user-circle" 
              className="w-7 h-7 text-primary" 
            />
          </div>

          <div>
            <div className="text-sm font-medium text-default-800 capitalize">
              {user?.nombre} {user?.apellido}
            </div>
            <div className="text-xs text-default-600 truncate max-w-[180px]">
              {user?.email}
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <Link href="/user-profile">
          <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 px-3 py-1.5 dark:hover:bg-background cursor-pointer">
            <Icon icon="heroicons:user" className="w-4 h-4" />
            Perfil
          </DropdownMenuItem>
        </Link>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-default-600 px-3 py-1.5 dark:hover:bg-background cursor-pointer"
        >
          <Icon icon="heroicons:power" className="w-4 h-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileInfo;