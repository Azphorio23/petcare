# PetCare

Aplicación web para gestionar las citas de una veterinaria. Los clientes reservan citas para sus mascotas y la recepción las confirma, marca como atendidas o cancela.

Proyecto del curso **JavaScript Avanzado** (UTP).

## Funcionalidades

- Inicio de sesión con contraseña cifrada y registro de clientes.
- Catálogo de servicios con filtro por categoría.
- Reserva de citas con validación de datos y control de horarios ocupados.
- **Cliente:** consulta y cancelación de sus propias citas.
- **Recepción:** agenda completa, confirmación, atención, cancelación y eliminación de citas; panel con el resumen del día.
- Filtros por estado y especie, y búsqueda por mascota o dueño.
- Modo claro y oscuro.

## Tecnologías

- React 19 + Vite
- React Router
- Bootstrap 5
- Node.js (API REST)
- PostgreSQL

## Requisitos

- Node.js 20.19 o superior
- PostgreSQL en ejecución, o un proyecto de Supabase

## Instalación

```bash
npm install
cp .env.example .env    # en Windows: copy .env.example .env
```

Editar `.env` con una de estas opciones:

- **PostgreSQL local:** completar `PGPASSWORD` (y el resto de variables `PG*` si cambian).
- **Base en la nube (Supabase):** activar `DATABASE_URL` con la cadena del *Session pooler* (Supabase → **Connect**). No requiere instalar PostgreSQL y todos los integrantes comparten los mismos datos.

## Ejecución

En dos terminales:

```bash
npm run api   # API en http://127.0.0.1:3001
npm run dev   # App en http://127.0.0.1:5173
```

Al iniciar, la API crea las tablas y los datos de ejemplo si no existen (en modo local también crea la base `petcare`).

Otros comandos:

| Comando | Descripción |
|---|---|
| `npm run build` | Compila la aplicación |
| `npm run db:reiniciar` | Restablece la base de datos con los datos de ejemplo |

## API

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/login` | Inicio de sesión |
| POST | `/api/registro` | Registro de un cliente |
| GET | `/api/servicios` | Lista de servicios |
| GET | `/api/citas` | Lista de citas (`?email=` filtra por cliente) |
| GET | `/api/citas/:id` | Detalle de una cita |
| POST | `/api/citas` | Registra una cita |
| PATCH | `/api/citas/:id` | Cambia el estado de una cita |
| DELETE | `/api/citas/:id` | Elimina una cita |

## Estructura

```
server/          API REST y conexión a PostgreSQL
src/
  components/    Componentes reutilizables
  context/       Tema y usuario
  data/          Constantes
  pages/         Páginas de la aplicación
  services/      Peticiones a la API
```

## Usuarios de prueba

Se crean automáticamente la primera vez que se inicia la API:

| Rol | Correo | Contraseña |
|---|---|---|
| Recepción | `recepcion@petcare.pe` | `recepcion123` |
| Cliente | `lucia@correo.com` | `lucia123` |
| Cliente | `ana@correo.com` | `ana123` |

También se puede crear una cuenta de cliente desde **Ingresar → Crear cuenta**.
