"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { verifyEmailToken } from "@/app/api/users/user";

const VerifyPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerification = async () => {
    if (!token) {
      toast.error('Token de verificación no encontrado');
      return;
    }

    try {
      setIsVerifying(true);
      const result = await verifyEmailToken(token);
      toast.success(result.message);
      
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al verificar el email');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Verificación de Email</h1>
        
        {token ? (
          <>
            <p className="mb-6">
              Haz clic en el botón para completar la verificación de tu cuenta.
            </p>
            <Button
              onClick={handleVerification}
              disabled={isVerifying}
              className="w-full"
            >
              {isVerifying ? 'Verificando...' : 'Verificar Mi Cuenta'}
            </Button>
          </>
        ) : (
          <>
            <p className="mb-6 text-destructive">
              Token de verificación no encontrado. Por favor usa el enlace que te enviamos por email.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/auth/login')}
            >
              Volver al Login
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;