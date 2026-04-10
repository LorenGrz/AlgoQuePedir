import React from 'react'
import { PerfilLocal } from './pages/PerfilLocal'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayoutWrapper } from './layouts/MainLayoutWrapper'
import { ProtectedLayout } from './layouts/ProtectedLayout'
import { Home } from './pages/Home'
import { PerfilUsuario } from './pages/PerfilUsuario'
import { DetallePedidos } from './pages/DetallePedidos'
import { DetallePedidoPorId } from './pages/DetallePedidoPorId'
import { Calificaciones } from './pages/Calificaciones'
import { PedidoLayout } from './layouts/PedidoLayout'
import { ListaPlatos } from './components/local/ListaPlatos'
import { ListaResenas } from './components/local/ListaResenas'
import { CheckoutPedido } from './pages/CheckoutPedido'
import { CalificarLocal } from './components/calificaciones/CalificarLocal'
import { PerfilUsuarioLayout } from './layouts/UsuarioLayout'
import { IngredientePanel } from './components/usuario/IngredientePanel'
import { CriteriosPanel } from './components/usuario/CriteriosPanel'
import { AuthForm } from './pages/auth/AuthForm'
import { NotFound } from './pages/NotFound'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Layout wrapper para las rutas de la app (con columna estrecha centrada)
const AppShell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-center bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
    <div className="bg-white dark:bg-gray-800 w-full max-w-2xl shadow-sm transition-colors duration-300">
      {children}
    </div>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" />
      <Routes>
        {/* Rutas de autenticación: pantalla completa, sin la caja estrecha */}
        <Route path="/auth/:mode" element={<AuthForm />} />

        {/* Rutas protegidas: dentro de la caja estrecha centrada */}
        <Route element={<ProtectedLayout />}>
          <Route element={
            <AppShell>
              <MainLayoutWrapper />
            </AppShell>
          }>
            <Route path="/" element={<Navigate to="/auth/login" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<PedidoLayout />}>
              <Route path="perfil-local/:id" element={<PerfilLocal />}>
                <Route path="menu" element={<ListaPlatos />} />
                <Route path="resenas" element={<ListaResenas />} />
              </Route>
              <Route path="checkout" element={<CheckoutPedido />} />
            </Route>
            <Route path="/perfil-usuario" element={<PerfilUsuario />} />
            <Route path="/calificaciones" element={<Calificaciones />} />
            <Route path="calificarlocal/:id" element={<CalificarLocal />} />
            <Route path="detalle-pedidos/estado/:estado" element={<DetallePedidos />} />
            <Route path="detalle-pedidos/:id" element={<DetallePedidoPorId />} />

            <Route path="/usuario" element={<PerfilUsuarioLayout />}>
              <Route path="perfil" element={<PerfilUsuario />} />
              <Route path="criterios" element={<CriteriosPanel />} />
              <Route path="preferidos" element={<IngredientePanel isPreferidos={true} />} />
              <Route path="evitar" element={<IngredientePanel isPreferidos={false} />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
