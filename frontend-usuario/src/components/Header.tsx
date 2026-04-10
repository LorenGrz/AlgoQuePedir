import { useNavigate } from 'react-router-dom'
import { useTheme, SunIcon, MoonIcon } from '../utils/useTheme'

type HeaderProps = {
  icon?: string
  label: string
  route?: string
}

export const Header = ({ icon, label, route }: HeaderProps) => {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()

  const volver = () => {
    if (route) {
      navigate(route)
    } else {
      navigate(-1) // Retrocede a la página anterior
    }
  }

  return (
    <header className="relative flex items-center px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
      {/* El icono se mantiene en el flujo normal (a la izquierda) */}
      {icon && (
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer z-10 transition-colors" onClick={volver}>
          <img src={icon} alt="Icono" className="w-5 h-5 dark:invert" />
        </button>
      )}
      {/* Título centrado absolutamente respecto al padre <header> */}
      <h3 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
        {label}
      </h3>
      
      {/* Boton Modo Oscuro a la derecha */}
      <button 
        onClick={toggleTheme} 
        className="absolute right-4 flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:scale-105 transition-all duration-200 cursor-pointer"
        aria-label="Toggle Dark Mode"
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  )
}
