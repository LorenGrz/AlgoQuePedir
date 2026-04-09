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
    <section className="flex justify-center bg-gray-50">
      <nav className="fixed bottom-0 h-20 bg-white border-t border-gray-200  max-w-2xl w-full">
        <ul className="flex justify-around items-center pb-2 pt-5">
          <li>
            <NavLink to="/home" className="flex flex-col items-center justify-center">
              {({ isActive }) => (
                <>
                  <img src={isActive ? filledHome : homeIcon} alt="Inicio" />
                  Inicio
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/detalle-pedidos/estado/Pendiente"
              className="flex flex-col items-center justify-center"
            >
              {({ isActive }) => (
                <>
                  <img src={isActive ? filledPedidos : pedidosIcon} alt="Pedidos" />
                  Pedidos
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/calificaciones" className="flex flex-col items-center justify-center">
              {({ isActive }) => (
                <>
                  <img src={isActive ? filledCalificar : calificarIcon} alt="Calificar" />
                  Calificar
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/usuario/perfil" className="flex flex-col items-center justify-center">
              {({ isActive }) => (
                <>
                  <img src={isActive ? filledPerfil : perfilIcon} alt="Perfil" />
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
