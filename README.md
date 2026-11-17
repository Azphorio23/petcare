# PetCare

Aplicación web para gestionar las citas de una veterinaria. Los clientes reservan citas para sus mascotas y la recepción las confirma, marca como atendidas o cancela.

Proyecto del curso **JavaScript Avanzado** (UTP).

## Funcionalidades

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
- PostgreSQL en ejecución

## Instalación

```bash
npm install
cp .env.example .env    # en Windows: copy .env.example .env
```

Editar `.env` con los datos de conexión a PostgreSQL (al menos `PGPASSWORD`).

## Ejecución

En dos terminales:

```bash
npm run api   # API en http://127.0.0.1:3001
npm run dev   # App en http://127.0.0.1:5173
```

Al iniciar, la API crea la base de datos `petcare`, sus tablas y datos de ejemplo si no existen.

Otros comandos:

| Comando | Descripción |
|---|---|
| `npm run build` | Compila la aplicación |
| `npm run db:reiniciar` | Restablece la base de datos con los datos de ejemplo |

## API

| Método | Ruta | Descripción |
|---|---|---|
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

El ingreso no requiere contraseña:

- **Cliente:** cualquier nombre con el correo `lucia@correo.com`
- **Recepción:** cualquier nombre y correo, eligiendo el rol *Recepción*
