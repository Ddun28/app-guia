'use client';

export default function CameraView({ videoRef, isActive, onCapture }) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="text-white text-center">
              <div className="text-4xl mb-2">📷</div>
              <p>Cámara desactivada</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay para guía de escaneo */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="border-2 border-white border-dashed rounded-lg w-64 h-64 opacity-60"></div>
      </div>
    </div>
  );
}