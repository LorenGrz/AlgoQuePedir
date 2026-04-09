import type { Resena } from '../../models/localModels'
import usuario from '../../assets/icons/user.svg'

export const ResenaLocal = ({ idResena, user, comentario, puntuacion, fecha }: Resena) => {
  return (
    <div className="flex items-start justify-between gap-5" data-testid={`resena-${idResena}`}>
      <div>
        <p className="text-xs text-gray-400 uppercase">Cliente</p>
        <h4 className="font-semibold text-gray-900">{user}</h4>
        <p className="text-sm text-gray-500">{comentario}</p>
        <div className="mt-1 flex items-center gap-2">
          <p className="font-medium text-gray-800">⭐ {puntuacion.toFixed(1)}</p>
          <p className="text-sm text-gray-400">{fecha}</p>
        </div>
      </div>

      <img src={usuario} alt={user} className="object-cover w-12 h-12 rounded-full" />
    </div>
  )
}
