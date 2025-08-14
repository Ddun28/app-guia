"use client";
import { Fragment } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import background from "@/public/images/auth/line.png";

const VerifyPage = () => {
  const handleVerification = () => {
    // Aquí irá la lógica de verificación con el backend
    console.log("Verificación iniciada");
    // Ejemplo: llamada a API de verificación
  };

  return (
    <Fragment>
      <div className="min-h-screen bg-card flex items-center overflow-hidden w-full">
        <div className="lg-inner-column flex w-full flex-wrap justify-center overflow-y-auto">
          <div
            className="basis-1/2 bg-primary w-full relative hidden xl:flex justify-center items-center bg-linear-to-br
          from-primary-600 via-primary-400 to-primary-600"
          >
            <Image
              src={background}
              alt="image"
              className="absolute top-0 left-0 w-full h-full"
              priority
            />
            <div className="relative z-10 backdrop-blur-sm bg-primary-foreground/40 p-16 rounded max-w-xl">
              <h1 className="text-6xl font-bold text-white mb-4">
                Verifica tu cuenta
              </h1>
              <p className="text-xl text-white">
                Estás a un paso de acceder a tu cuenta
              </p>
            </div>
          </div>

          <div className="min-h-screen basis-full md:basis-1/2 w-full px-4 flex justify-center items-center">
            <div className="w-full max-w-md text-center">
              <h2 className="text-3xl font-bold mb-6">Verificación requerida</h2>
              <p className="mb-8 text-gray-600">
                Por favor haz clic en el botón para verificar tu identidad
              </p>
              
              <Button 
                onClick={handleVerification}
                className="w-full py-6 text-lg"
                size="lg"
              >
                Verificar mi cuenta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default VerifyPage;