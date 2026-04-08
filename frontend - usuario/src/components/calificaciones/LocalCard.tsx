import { Boton } from '../Boton'
import noImage from '../../assets/images/no-Image.png'
import type { LocalResumen } from '../../models/localModels'

type Props = {
  local: LocalResumen
  onCalificar: () => void
}

export const LocalCard = ({ local, onCalificar }: Props) => {
  return (
    <div className="flex items-center justify-between w-full py-3 px-4 border-b border-gray-100">
      <div className="flex items-center gap-3 flex-1">
        <img
          src={local.imgUrl || noImage}
          alt={local.nombre}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{local.nombre}</h3>
          <p className="text-sm text-gray-500">
            {local.puntuacion} • {local.tiempoMin}-{local.tiempoMax} min • {'$'}
          </p>
        </div>
      </div>
      <div className="ml-4">
        <Boton tipo="gris" onClick={onCalificar}>
          Calificar
        </Boton>
      </div>
    </div>
  )
}
