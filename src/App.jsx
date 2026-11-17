import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { TemaProvider } from './context/TemaContext.jsx';
import Layout from './components/Layout.jsx';
import RutaRecepcion from './components/RutaRecepcion.jsx';
import InicioPage from './pages/InicioPage.jsx';
import ServiciosPage from './pages/ServiciosPage.jsx';
import ReservarPage from './pages/ReservarPage.jsx';
import CitasPage from './pages/CitasPage.jsx';
import CitaDetallePage from './pages/CitaDetallePage.jsx';
import RecepcionPage from './pages/RecepcionPage.jsx';
import IngresarPage from './pages/IngresarPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <TemaProvider>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<InicioPage />} />
            <Route path="/servicios" element={<ServiciosPage />} />
            <Route path="/reservar" element={<ReservarPage />} />
            <Route path="/citas" element={<CitasPage />} />
            <Route path="/citas/:id" element={<CitaDetallePage />} />
            <Route path="/ingresar" element={<IngresarPage />} />
            <Route
              path="/recepcion"
              element={
                <RutaRecepcion>
                  <RecepcionPage />
                </RutaRecepcion>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </TemaProvider>
  );
}
