import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { pedidoService } from '../services/pedidoService'
import volverIcon from '../assets/icons/arrow-left.svg'
import { Header } from '../components/Header'
import type {} from '../models/pedidoModel'
import type { Pedido } from '../classes/Pedido'
import { useOnInit } from '../utils/hooks'
import { getMensajeError, type ErrorCustom, type ErrorResponse } from '../utils/errorHandling'
import { ErrorCard } from '../components/ErrorCard'
import { Spinner } from '../components/Spinner'
import { RestauranteInfo } from '../components/pedidos/RestauranteInfo'
import { ArticulosPedido } from '../components/pedidos/ArticulosPedido'
import { FormaDePago } from '../components/pedidos/FormaDePago'
import { ResumenPedidoSection } from '../components/pedidos/ResumenPedido'
import { authService } from '../services/AuthService'

export const DetallePedidoPorId = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<ErrorCustom | null>(null)

  const fetchPedido = async () => {
    try {
      const data = await pedidoService.obtenerPedidoPorId(id!)
      setPedido(data)
      setError(null)
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
    fetchPedido()
  })

  if (loading) return <Spinner />

  if (error)
    return (
      <ErrorCard
        error={error}
        onRetry={() => window.location.reload()}
        onVolver={() => navigate(-1)}
      />
    )

  if (!pedido) {
    return (
      <div className="min-h-screen px-5 font-sans">
        <Header icon={volverIcon} label={'Pedido no encontrado'} />
        <p className="mt-4">El pedido con ID: {id} no existe.</p>
      </div>
    )
  }
  return (
    <div className="min-h-screen px-5 font-sans">
      <Header icon={volverIcon} label={'Tu Pedido'} />
      <RestauranteInfo pedido={pedido} />
      <ArticulosPedido pedido={pedido} />
      <ResumenPedidoSection pedido={pedido} />
      <FormaDePago pedido={pedido} valorActual={pedido.formaPago} />
    </div>
  )
}
