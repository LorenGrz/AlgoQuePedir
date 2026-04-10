import type { LocalResumen } from '../models/localModels'
import noImage from '../assets/images/no-Image.png'
import xIcon from '../assets/icons/x.svg'

type Props = {
  local: LocalResumen
  eliminar?: () => void
  onClick?: () => void
  mostrarIconoEliminar?: boolean
}

export const LocalData = ({ local, eliminar, onClick, mostrarIconoEliminar = true }: Props) => {
  return (
    <div className="flex w-full justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300" onClick={onClick}>
      <div className="flex items-center justify-between gap-3 rounded-xl  px-3 py-2">
        <img src={local.imgUrl?.length > 0 ? local.imgUrl : noImage} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100 mb-0.5">{local.nombre}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {/* Todo: ver lo que trae el back */}
            {local.puntuacion} • {local.tiempoMin}-{local.tiempoMax} min • {'$'.repeat(2)}
          </div>
        </div>
      </div>

      {mostrarIconoEliminar && <img src={xIcon} alt="Eliminar" onClick={eliminar} className="dark:invert w-5 opacity-60 hover:opacity-100 cursor-pointer" />}
    </div>
  )
}
