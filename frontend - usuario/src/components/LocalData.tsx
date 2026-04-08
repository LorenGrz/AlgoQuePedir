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
    <div className="flex w-full justify-between py-2 text-gray-500" onClick={onClick}>
      <div className="flex items-center justify-between gap-3 rounded-xl  px-3 py-2">
        <img src={local.imgUrl?.length > 0 ? local.imgUrl : noImage} alt="" className="w-24 h-24" />
        <div>
          <div className="font-medium ">{local.nombre}</div>
          <div>
            {/* Todo: ver lo que trae el back */}
            {local.puntuacion} • {local.tiempoMin}-{local.tiempoMax} min • {'$'.repeat(2)}
          </div>
        </div>
      </div>

      {mostrarIconoEliminar && <img src={xIcon} alt="Eliminar" onClick={eliminar} />}
    </div>
  )
}
