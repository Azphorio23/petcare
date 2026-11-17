import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  function ingresar(datos) {
    setUsuario(datos);
  }

  function salir() {
    setUsuario(null);
  }

  const esRecepcion = usuario?.rol === 'recepcion';

  return (
    <AuthContext.Provider value={{ usuario, esRecepcion, ingresar, salir }}>
      {children}
    </AuthContext.Provider>
  );
}
