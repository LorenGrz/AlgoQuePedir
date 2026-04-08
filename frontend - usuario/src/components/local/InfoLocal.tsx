import type { LocalCompleto } from '../../models/localModels'

type Props = {
  local: LocalCompleto
}

export const InfoLocal = ({ local }: Props) => {
  return (
    <>
      {/* Imagen del Local */}
      <div className="w-full overflow-hidden">
        <img
          src={local.img}
          alt="imagen del local"
          className="object-cover w-full h-full"
        />
      </div>
      {/* Info del local */}
      <div className="px-4 mt-4">
        <h2 className="text-xl font-semibold text-gray-900" data-testid="nombre-local">{local.nombre}</h2>
        <span className="text-sm text-gray-500">
          {local.puntajeTotal} ({local.resenas.length} reviews) · {local.totalVentas} pedidos
        </span>
      </div>
    </>
  )
}
