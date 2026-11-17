# PetCare

Aplicación web para gestionar las citas de una veterinaria. Los clientes reservan citas para sus mascotas y la recepción las confirma, marca como atendidas o cancela.

Proyecto del curso **JavaScript Avanzado**.

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

## Temas del curso aplicados

### Semana 11 · Introducción a React

| Tema | Dónde |
|---|---|
| Proyecto con Vite (`npm run dev`, `npm run build`) | `package.json`, `vite.config.js` |
| Punto de entrada y componente raíz | `src/main.jsx`, `src/App.jsx` |
| JSX, `className` y expresiones `{}` | Todos los componentes |
| Listas con `map()` y `key` | `ServiciosPage.jsx`, `TablaCitas.jsx` |
| Contadores calculados con `filter().length` | `RecepcionPage.jsx`, `CitasPage.jsx` |
| Bootstrap en React y clases según el estado | `main.jsx`, `EstadoBadge.jsx` |

### Semana 12 · Componentes, navegación y formularios

| Tema | Dónde |
|---|---|
| Componentes reutilizables y props | `ServicioCard.jsx`, `EstadoBadge.jsx`, `TablaCitas.jsx`, `EstadoCarga.jsx` |
| `BrowserRouter`, `Routes` y `Route` | `main.jsx`, `App.jsx` |
| `NavLink` con sección activa | `NavBar.jsx` |
| Diseño común con `<Outlet />` | `Layout.jsx` |
| Página 404 | `NotFoundPage.jsx` |
| Parámetros de ruta y de consulta (`useParams`, `useSearchParams`) | `CitaDetallePage.jsx`, `ReservarPage.jsx` |
| Formularios con `FormData`, `preventDefault` y validación HTML | `CitaForm.jsx`, `IngresarPage.jsx` |
| Datos del hijo al padre mediante una prop | `CitaForm.jsx` → `ReservarPage.jsx` |

### Semana 13 · Hooks

| Tema | Dónde |
|---|---|
| `useState` (filtros, búsqueda, carga, errores) | `CitasPage.jsx` y demás páginas |
| `createContext` y `useContext` | `TemaContext.jsx` (tema claro/oscuro), `AuthContext.jsx` (usuario y rol) |
| `useRef` | `Buscador.jsx` (enfocar el buscador), `CitaForm.jsx` |
| `use()` con `<Suspense>` y una Promise estable | `data/campana.js`, `CampanaPanel.jsx`, `InicioPage.jsx` |
| `useEffect` con dependencias | Páginas que cargan datos, `TemaContext.jsx` |

### Semana 14 · Servicios REST

| Tema | Dónde |
|---|---|
| Servicios separados de los componentes | `src/services/` |
| Fetch con GET, POST, PATCH y DELETE | `services/http.js`, `citaService.js`, `authService.js` |
| JSON, `Content-Type` y revisión de `response.ok` | `services/http.js` |
| Estados de carga, datos y error, con `finally` y Reintentar | `EstadoCarga.jsx` y la función `cargar()` de cada página |
| Nueva consulta GET después de POST o PATCH | `CitasPage.jsx` |
| API local y proxy de Vite | `server/api.mjs`, `vite.config.js` |
| Cliente HTTP elegido: Fetch | Nativo del navegador, sin dependencias adicionales |

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
