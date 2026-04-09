import { Pedido } from '../../classes/Pedido'
type PedidoProps = {
  pedido: Pedido
}

export const RestauranteInfo = ({ pedido }: PedidoProps) => {
  if (!pedido.local) {
    return null
  }

  return (
    <section className="mb-6">
      <h2 className="font-medium mb-2">Restaurante</h2>
      <div className="flex items-center gap-3">
        <img
          src={pedido.local.img}
          alt={pedido.local.nombre}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div>
          <p className="font-semibold">{pedido.local.nombre}</p>
          <p className="text-sm text-gray-500">
            {pedido.local.puntajeTotal} ★ • {pedido.local.distanciaKm} km •{' '}
            {pedido.local.envioGratis ? 'Envío gratis' : 'Con envío'}
          </p>
        </div>
      </div>
    </section>
  )
}

export default RestauranteInfo
