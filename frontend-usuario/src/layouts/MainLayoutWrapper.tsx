import { Outlet } from 'react-router-dom'
import { NavbarInferior } from '../components/NavbarInferior'

export function MainLayoutWrapper() {
  return (
    <>
      <div className="pb-20">
        <Outlet />
      </div>

      <NavbarInferior />
    </>
  )
}
