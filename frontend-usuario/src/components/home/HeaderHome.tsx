import cart from 'src/assets/icons/cart.svg'
import { useTheme, SunIcon, MoonIcon } from '../../utils/useTheme'

type HeaderProps = {
  label: string
}

export const HeaderHome = ({ label }: HeaderProps) => {
  const { isDark, toggleTheme } = useTheme()
  return (
    <header className="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{label}</h3>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:scale-105 transition-all duration-200 cursor-pointer"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <img src={cart} alt="Carrito" className="w-5 h-5 dark:invert" />
        </button>
      </div>
    </header>
  )
}
