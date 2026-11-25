# Mercado Seguro · Grupo 4

Aplicación integrada de Mercado Mayorista, PNP y EsSalud. La SPA única conserva los módulos y rutas del Grupo 4; la API Node/Express es el único acceso a PostgreSQL.

## Arquitectura

```text
mi-app-grupo4/
├── backend/                       # API Express :3000 (Render)
│   ├── database/init.sql          # PostgreSQL para Neon
│   └── src/                       # config, routes, controllers, services,
│                                  # repositories, middlewares y utils
└── frontend/                      # SPA React/Vite :5173 (Vercel)
    ├── public/images/             # Imágenes y escudo de los proyectos originales
    └── src/                       # api, context, components, modulos,
                                   # integraciones y estilos
```

La SPA única incluye cliente, administrador y empleados, según los roles de `usuario_rol`. Esto aplica la arquitectura React del Grupo 4 y mantiene la separación API/cliente de Semana 13, sin exponer credenciales de Neon en el navegador.

## Requisitos

- Node.js 20.19 o superior.
- PostgreSQL en Neon (o una instancia local).
- Ejecuta `backend/database/init.sql` una vez en la consola SQL de Neon.
- Si la base de datos ya existe, ejecuta también `backend/database/migrations/002_pagos_mercado_demo.sql` en Neon para habilitar el registro de pagos de demostración del mercado.
- Configura `DATABASE_URL` y `JWT_SECRET` a partir de `backend/.env.example`.
- Copia `frontend/.env.example` a `.env` si la API no está en `http://localhost:3000`.

## Ejecución local

En una terminal:

```powershell
cd backend
npm install
npm run dev
```

En otra terminal:

```powershell
cd frontend
npm install
npm run dev
```

Abre la dirección que indique Vite (por defecto `http://localhost:5173`). La API comprueba su disponibilidad en `GET /api/health`.

## Cuentas de prueba

Todas usan la contraseña `Mercado2026!`:

- Clientes: `cliente1@correo.com` a `cliente10@correo.com`.
- Administrador de Mercado: `admin@mercado.pe`.
- Empleados: `empleado.mercado@mercado.pe`, `empleado.pnp@pnp.gob.pe`, `empleado.essalud@essalud.pe`.

La base de datos crea tres puestos, cuatro denuncias y cuatro citas por cliente. Tres denuncias y las citas están enlazadas entre módulos; una denuncia con lesionados queda sin cita para demostrar su derivación en vivo. Los registros de demostración se pueden volver a cargar sin duplicar códigos.

## Guía de demostración de los portales

1. **Iniciar los servicios:** desde `mi-app-grupo4`, abre una terminal en `backend` y ejecuta `npm run dev`. Abre otra terminal en `frontend` y ejecuta `npm run dev`. La interfaz queda en `http://localhost:5173` y la API en `http://localhost:3000/api`; el estado de conexión a Neon se comprueba en `/api/health`.
2. **Acceder y validar roles:** inicia sesión con una cuenta de prueba de arriba. También puedes crear una cuenta desde **Regístrate**; cada cuenta nueva recibe el rol `cliente` en Mercado, PNP y EsSalud. La sesión se conserva con token y `/api/auth/me`; las rutas de módulos y las operaciones de API requieren sesión y rol permitido.
3. **Mercado Mayorista:** entra en **Portal Mercado** para ver el mapa y las solicitudes del perfil. **Registrar un puesto** envía `POST /api/mercado/comerciantes` y, al guardarlo, abre **Mi puesto**, que vuelve a consultar y muestra el registro. Desde **Mi puesto**, el botón **Actualizar** en una solicitud `registrado` guarda cambios con `PUT /api/mercado/comerciantes/:id`. El importe se calcula en la API y se persiste en PostgreSQL.
4. **PNP:** abre **Denunciar incidente**, selecciona un puesto propio y envía el formulario. La API guarda la denuncia con `POST /api/pnp/denuncias`; luego se abre **Mis denuncias**, que solicita `GET /api/pnp/denuncias` y muestra el código y estado nuevos. Los clientes pueden editar denuncias todavía `registrado`; el empleado PNP usa **Panel PNP** para cambiar su estado y las actualizaciones se vuelven a leer desde la API.
5. **EsSalud:** abre **Solicitar cita**, completa los datos del asegurado y envía. La API guarda la cita con `POST /api/essalud/citas`; luego se abre **Mis citas**, cuya lista viene de `GET /api/essalud/citas` e incluye inmediatamente la nueva solicitud. Las citas de clientes pueden editarse mientras estén registradas y sean solicitudes directas; el empleado EsSalud las confirma o atiende desde **Panel EsSalud**.
6. **Comprobar persistencia:** para probar escrituras, crea registros de presentación con una cuenta dedicada y confirma sus códigos en la lista correspondiente. No se requiere acceder a Neon desde el navegador: las credenciales de base de datos solo se configuran en el backend.

El pago con tarjeta de Mercado Mayorista está identificado como demostración: no pide ni almacena número de tarjeta, vencimiento o CVV, no realiza cargos y no cambia el estado de pago real del puesto. Para aceptar pagos reales se debe integrar una pasarela de pago.

## Despliegue (Semana 14)

1. **Neon:** ejecuta `database/init.sql` y guarda la URL de PostgreSQL solo como secreto del backend.
2. **Render:** publica `backend`, define `DATABASE_URL`, `JWT_SECRET`, `CLIENT_ORIGIN` y `NODE_ENV=production`. El comando de inicio es `npm start`.
3. **Vercel:** publica `frontend`, define `VITE_API_URL` con la URL pública de Render y ejecuta `npm run build`.
4. Configura `CLIENT_ORIGIN` en Render con el dominio Vercel y valida `GET /api/health` y los flujos desde el navegador/Postman.

Los valores secretos no se deben subir a GitHub. El archivo SQL contiene hashes de las contraseñas de demostración; no contiene credenciales de base de datos.
