import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { CarritoProvider } from './context/CarritoContext'
import { ClienteAuthProvider, useClienteAuth } from './context/ClienteAuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Productos from './pages/Productos'
import Producto from './pages/Producto'
import { Carrito, Checkout } from './pages/Carrito'
import LoginCliente from './pages/LoginCliente'
import MisPedidos from './pages/MisPedidos'

// Ruta protegida — redirige al login si no está autenticado
function RutaProtegida({ children }) {
  const { cliente, cargando } = useClienteAuth()
  const location = useLocation()

  if (cargando) return <div style={{ textAlign: 'center', padding: '80px', fontSize: '32px' }}>⏳</div>
  if (!cliente) return <Navigate to="/login" state={{ from: location.pathname }} />
  return children
}

export default function App() {
  return (
    <ClienteAuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/producto/:id" element={<Producto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/login" element={<LoginCliente />} />
            <Route path="/checkout" element={
              <RutaProtegida><Checkout /></RutaProtegida>
            } />
            <Route path="/mis-pedidos" element={
              <RutaProtegida><MisPedidos /></RutaProtegida>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </CarritoProvider>
    </ClienteAuthProvider>
  )
}
