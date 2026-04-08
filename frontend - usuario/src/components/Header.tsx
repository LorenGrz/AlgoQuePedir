import { useNavigate } from 'react-router-dom'

type HeaderProps = {
  icon?: string
  label: string
  route?: string
}

export const Header = ({ icon, label, route }: HeaderProps) => {
  const navigate = useNavigate()

  const volver = () => {
    if (route) {
      navigate(route)
    } else {
      navigate(-1) // Retrocede a la página anterior
    }
  }

  return (
    <header className="relative flex items-center px-4 py-3">
      {/* El icono se mantiene en el flujo normal (a la izquierda) */}
      {icon && (
        <button className="p-2 rounded-full hover:bg-gray-100 cursor-pointer z-10" onClick={volver}>
          <img src={icon} alt="Icono" className="w-5 h-5" />
        </button>
      )}
      {/* Título centrado absolutamente respecto al padre <header> */}
      <h3 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold text-gray-800 whitespace-nowrap">
        {label}
      </h3>
    </header>
  )
}
