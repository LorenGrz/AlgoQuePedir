import location from 'src/assets/icons/pin.svg'
import { Link } from 'react-router-dom'

type LocalCardProps = {
  id: number
  nombre: string
  direccion: string
  altura: number
  imagen: string
  esCercano?: boolean
}

export const LocalCard = ({ id, nombre, direccion, altura, imagen, esCercano }: LocalCardProps) => {
  return (
    <Link
      to={`/perfil-local/${id}`}
      className="relative flex flex-col items-start w-[47%] transition-transform active:scale-95"
    >
      <div className="relative w-full aspect-square rounded-2xl shadow-sm">
        <img
          src={imagen}
          alt={nombre}
          className="w-full h-full object-cover rounded-2xl transition duration-150 active:brightness-75"
        />
        {esCercano && (
          <img
            src={location}
            alt="Cercano"
            className="absolute -top-4 right-4"
          />
        )}
      </div>

      <div className="mt-1">
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300" data-testid="nombre-local">{nombre}</h3>
        <p className="text-xs text-rose-400 dark:text-rose-300 transition-colors duration-300">{direccion}, {altura}</p>
      </div>
    </Link>
  )
}
export default LocalCard

