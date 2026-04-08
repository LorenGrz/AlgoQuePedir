import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Tabs } from '../components/Tabs'
import { CardPedido } from '../components/pedidos/CardPedido'
import type { Estado } from '../models/pedidoModel'
import { ESTADOS_VALIDOS } from '../models/pedidoModel'
import { pedidoService } from '../services/pedidoService'
import type { Pedido } from '../classes/Pedido'
import { useOnInit } from '../utils/hooks'
import { ErrorCard } from '../components/ErrorCard'
import { Spinner } from '../components/Spinner'
import { getMensajeError, type ErrorCustom, type ErrorResponse } from '../utils/errorHandling'
import { authService } from '../services/AuthService'

export const DetallePedidos = () => {
  const { estado: estadoFromUrl } = useParams<{ estado: Estado }>()
  const navigate = useNavigate()

  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<ErrorCustom | null>(null)
  const [activeTab, setActiveTab] = useState<Estado>('pendiente')

  const tabs: { id: Estado; label: string }[] = [
    { id: 'pendiente', label: 'Pendientes' },
    { id: 'entregado', label: 'Completados' },
    { id: 'cancelado', label: 'Cancelados' }
  ]

  const fetchPedidos = async (estado: Estado) => {
    setLoading(true)
    setError(null)
    try {
      let usuario = authService.obtenerIdUsuarioActual()
      if (!usuario) return null
      const data = await pedidoService.obtenerPedidosPorEstado(usuario, estado)
      setPedidos(data)
    } catch (error: unknown) {
      const errorMessage = getMensajeError(error as ErrorResponse)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useOnInit(() => {
    if (!authService.estaAutenticado()) {
      navigate('/auth/login')
    }
    let estadoInicial: Estado = 'pendiente'
    if (estadoFromUrl && ESTADOS_VALIDOS.includes(estadoFromUrl as Estado)) {
      estadoInicial = estadoFromUrl as Estado
    } else {
      navigate('/detalle-pedidos/estado/pendiente', { replace: true })
    }
    setActiveTab(estadoInicial)
    fetchPedidos(estadoInicial)
  })

  const handleTabChange = (id: string) => {
    const nuevoEstado = id as Estado
    setActiveTab(nuevoEstado)
    navigate(`/detalle-pedidos/estado/${nuevoEstado}`)
    fetchPedidos(nuevoEstado)
  }

  const handleCancelSuccess = (pedidoId: number) => {
    setPedidos((prevPedidos) => prevPedidos.filter((pedido) => pedido.id !== pedidoId))
  }

  if (loading) return <Spinner />
  if (error)
    return (
      <ErrorCard
        error={error}
        onRetry={() => window.location.reload()}
        onVolver={() => navigate(-1)}
      />
    )
  return (
    <div className="flex flex-col min-h-screen font-sans p-4 gap-3 bg-gray-50">
      <Header label="Mis Pedidos" />

      <Tabs tabs={tabs} active={activeTab} onChange={handleTabChange} />

      <main className="flex-1">
        {loading && <Spinner />}

        {error && (
          <ErrorCard
            error={error}
            onRetry={() => window.location.reload()}
            onVolver={() => navigate('/home')}
          />
        )}

        {!loading && !error && pedidos.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No hay pedidos {activeTab.toLowerCase()}s.
          </p>
        )}

        {!loading && !error && pedidos.length > 0 && (
          <div className="flex flex-col gap-3">
            {pedidos.map((pedido) => (
              <CardPedido
                key={pedido.id}
                pedido={pedido}
                estadoActivo={activeTab}
                onCancelSuccess={handleCancelSuccess}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
