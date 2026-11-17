import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

export default function RutaRecepcion({ children }) {
  const { esRecepcion } = useContext(AuthContext);
  if (!esRecepcion) return <Navigate to="/ingresar" replace state={{ aviso: 'Ingresa como recepción para ver esa página.' }} />;
  return children;
}
