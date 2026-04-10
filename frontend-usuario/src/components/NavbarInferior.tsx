import { NavLink } from 'react-router-dom'
import homeIcon from 'src/assets/icons/house.svg'
import filledHome from 'src/assets/icons/house-fill.svg'
import pedidosIcon from 'src/assets/icons/receipt.svg'
import filledPedidos from 'src/assets/icons/receipt-fill.svg'
import calificarIcon from 'src/assets/icons/star.svg'
import filledCalificar from 'src/assets/icons/star-fill.svg'
import perfilIcon from 'src/assets/icons/user.svg'
import filledPerfil from 'src/assets/icons/user-fill.svg'

export const NavbarInferior = () => {
  return (
    <section className="flex justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <nav className="fixed bottom-0 h-[56px] bg-white dark:bg-gray-800/95 backdrop-blur-sm border-t border-gray-100 dark:border-gray-700 max-w-2xl w-full transition-colors duration-300 z-50">
        <ul className="flex justify-around items-center h-full px-2">
          <li>
            <NavLink to="/home" className={({ isActive }) => `flex flex-col items-center justify-center transition-colors ${isActive ? 'text-rose-600 dark:text-rose-400' : 'text-gray-600 dark:text-gray-300'}`}>
              {({ isActive }) => (
                <>
                  <img src={isActive ? filledHome : homeIcon} alt="Inicio" className="dark:invert mb-1" />
                  Inicio
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/detalle-pedidos/estado/Pendiente"
              className={({ isActive }) => `flex flex-col items-center justify-center transition-colors ${isActive ? 'text-rose-600 dark:text-rose-400' : 'text-gray-600 dark:text-gray-300'}`}
            >
              {({ isActive }) => (
                <>
                  <img src={isActive ? filledPedidos : pedidosIcon} alt="Pedidos" className="dark:invert mb-1" />
                  Pedidos
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/calificaciones" className={({ isActive }) => `flex flex-col items-center justify-center transition-colors ${isActive ? 'text-rose-600 dark:text-rose-400' : 'text-gray-600 dark:text-gray-300'}`}>
              {({ isActive }) => (
                <>
                  <img src={isActive ? filledCalificar : calificarIcon} alt="Calificar" className="dark:invert mb-1" />
                  Calificar
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/usuario/perfil" className={({ isActive }) => `flex flex-col items-center justify-center transition-colors ${isActive ? 'text-rose-600 dark:text-rose-400' : 'text-gray-600 dark:text-gray-300'}`}>
              {({ isActive }) => (
                <>
                  <img src={isActive ? filledPerfil : perfilIcon} alt="Perfil" className="dark:invert mb-1" />
                  Perfil
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>
    </section>
  )
}
