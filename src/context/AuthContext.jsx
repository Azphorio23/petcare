import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

const CLAVE_SESION = 'petcare-usuario';

function leerSesion() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_SESION)) ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesion);

  function ingresar(datos) {
    setUsuario(datos);
    try { sessionStorage.setItem(CLAVE_SESION, JSON.stringify(datos)); } catch {}
  }

  function salir() {
    setUsuario(null);
    try { sessionStorage.removeItem(CLAVE_SESION); } catch {}
  }

  const esRecepcion = usuario?.rol === 'recepcion';

  return (
    <AuthContext.Provider value={{ usuario, esRecepcion, ingresar, salir }}>
      {children}
    </AuthContext.Provider>
  );
}
