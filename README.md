# app-guia

## Descripción del proyecto

app-guia es un proyecto que busca proporcionar una plataforma para la gestión de alertas y lugares recomendados. El proyecto utiliza tecnologías como React, Node.js y Docker para proporcionar una experiencia de usuario fluida y escalable.

## Tecnologías utilizadas

* **Frontend**: React, Next.js, Javascript
* **Backend**: Node.js, Nest.js, MongoDB, TypeScript
* **Infraestructura**: Docker, Kubernetes

## Lo más nuevo y destacado

* **Arquitectura de microservicios**: La aplicación está diseñada como una arquitectura de microservicios, lo que permite una mayor escalabilidad y flexibilidad.
* **Uso de contenedores**: La aplicación utiliza contenedores de Docker para garantizar una mayor portabilidad y consistencia en el entorno de ejecución.
* **Despliegue en la nube**: La aplicación se despliega en la nube utilizando Kubernetes, lo que permite una mayor escalabilidad y disponibilidad.

## Escalabilidad y rendimiento

* **Escalabilidad horizontal**: La aplicación está diseñada para escalar horizontalmente, lo que permite agregar más instancias de la aplicación para manejar un mayor tráfico.
* **Caching**: La aplicación utiliza caching para reducir la carga en la base de datos y mejorar el rendimiento.
* **Optimización de la base de datos**: La base de datos está optimizada para mejorar el rendimiento y la escalabilidad.

## Instalación

### Requisitos previos

* Docker instalado en tu sistema
* Node.js instalado en tu sistema (opcional)

### Pasos de instalación

1. Clona el repositorio del proyecto:
```bash
git clone [https://github.com/Ddun28/app-guia.git](https://github.com/Ddun28/app-guia.git)
```
2. Cambia al directorio del proyecto:

```bash
cd app-guia
```

3. Crea un archivo .env con las variables de entorno necesarias en cada carpeta:
```bash
cd backend
cp .env.example .env

cd frontend
cp .env.example .env
```
 
 4. Edita el archivo .env y configura las variables de entorno según tus necesidades.

5.Construye la imagen de Docker:

 ```bash
 docker-compose build
 ```

 6. Inicia el contenedor de Docker:

 ```bash
 docker-compose up -d
  ```
  
Ruta del Frontend http://localhost:3000

Ruta del backend http://localhost:3001