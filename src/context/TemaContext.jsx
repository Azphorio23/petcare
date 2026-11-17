import { createContext, useEffect, useState } from 'react';

export const TemaContext = createContext(null);

export function TemaProvider({ children }) {
  const [tema, setTema] = useState('claro');

  function alternarTema() {
    setTema((anterior) => (anterior === 'claro' ? 'oscuro' : 'claro'));
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', tema === 'oscuro' ? 'dark' : 'light');
  }, [tema]);

  return <TemaContext.Provider value={{ tema, alternarTema }}>{children}</TemaContext.Provider>;
}
