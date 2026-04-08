import { useNavigate, useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import { Pedido } from '../classes/Pedido' // Importas la clase
import { RestauranteInfo } from '../components/pedidos/RestauranteInfo'
import { ArticulosPedido } from '../components/pedidos/ArticulosPedido'
import { FormaDePago } from '../components/pedidos/FormaDePago'
import { ResumenPedidoSection } from '../components/pedidos/ResumenPedido'
import { getMensajeError, type ErrorCustom, type ErrorResponse } from '../utils/errorHandling'
import { ErrorCard } from '../components/ErrorCard'
import { pedidoService } from '../services/pedidoService'
import { Boton } from '../components/Boton'
import { authService } from '../services/AuthService'
import { Header } from '../components/Header'
import volverIcon from '../assets/icons/arrow-left.svg'
import { OutletContextType } from '../layouts/PedidoLayout'

export const CheckoutPedido = () => {
  const navigate = useNavigate()
  const { pedido, setPedido } = useOutletContext<OutletContextType>()
  const [formaPago, setFormaPago] = useState(pedido?.formaPago || 'Efectivo')
  const [error, setError] = useState<ErrorCustom | null>(null)

  const handleCambiarPago = (nuevaForma: string) => {
    setFormaPago(nuevaForma)
    const pedidoActualizado = pedido.cambiarFormaPago(nuevaForma)
    setPedido(pedidoActualizado)
  }

  const handleQuitarItem = (idPlato: number) => {
    const nuevoPedido = pedido.quitarItem(idPlato)
    setPedido(nuevoPedido)
    if (nuevoPedido.items.length === 0) {
      navigate(-1)
    }
  }

  const handleLimpiarCarrito = () => {
    const pedidoVacio = new Pedido(pedido.local)
    setPedido(pedidoVacio)
    navigate(-1)
  }

  const guardarPedido = async (pedido: Pedido) => {
    try {
      await pedidoService.guardarPedido(pedido)
      setError(null)
    } catch (error: unknown) {
      const errorMessage = getMensajeError(error as ErrorResponse)
      setError(errorMessage)
    } finally {
      navigate('/detalle-pedidos/estado/pendiente')
    }
  }

  const handleConfirmar = () => {
    const pedidoAConfirmar = {
      ...pedido,
      formaPago: formaPago
    }
    guardarPedido(pedidoAConfirmar as Pedido)
  }

  if (!authService.estaAutenticado()) {
    navigate('/auth/login')
  }
  if (error)
    return (
      <ErrorCard
        error={error}
        onRetry={() => window.location.reload()}
        onVolver={() => navigate(-1)}
      />
    )

  return (
    <div className="min-h-screen px-5 font-sans pb-32">
      <Header icon={volverIcon} label={'Tu Pedido'} />
      <RestauranteInfo pedido={pedido} />
      <ArticulosPedido pedido={pedido} onQuitarItem={handleQuitarItem} />
      <ResumenPedidoSection pedido={pedido} />
      <FormaDePago pedido={pedido} valorActual={formaPago} onChangePago={handleCambiarPago} />

      <footer className="bottom-0 left-0 right-0 border-t border-gray-200 shadow-lg flex flex-col gap-2">
        <Boton
          tipo="custom"
          onClick={handleConfirmar}
          className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-md"
        >
          Confirmar pedido
        </Boton>
        <Boton
          tipo="custom"
          onClick={handleLimpiarCarrito}
          className="w-full bg-white text-red-600 font-semibold py-3 rounded-lg border border-red-600 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-md hover:bg-gray-50"
        >
          Limpiar carrito de compras
        </Boton>
      </footer>
    </div>
  )
}
