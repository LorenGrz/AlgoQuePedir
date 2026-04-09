import { Outlet, useNavigate } from 'react-router-dom'
import { authService } from '../services/AuthService'

export const ProtectedLayout = () => {
  const navigate = useNavigate()
  if (!authService.estaAutenticado()) {
    navigate('/auth/login')
  }
  return <Outlet />
}
