import { Boton } from '../Boton'
import noImage from '../../assets/images/no-Image.png'
import type { LocalResumen } from '../../models/localModels'

type Props = {
  local: LocalResumen
  onCalificar: () => void
}

export const LocalCard = ({ local, onCalificar }: Props) => {
  return (
    <div className="flex items-center justify-between w-full py-3 px-4 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <div className="flex items-center gap-3 flex-1">
        <img
          src={local.imgUrl || noImage}
          alt={local.nombre}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-0.5">{local.nombre}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
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
