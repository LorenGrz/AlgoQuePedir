import { getMensajeError, type ErrorCustom } from './errorHandling'
import { Login } from '../classes/Login'
import type { ErrorResponse } from 'react-router-dom'

/**
 * Procesa un error de autenticación y lo asigna al campo correspondiente
 * Retorna el objeto Login actualizado con los errores asignados
 */
export const procesarErrorAuth = (
  error: unknown,
  loginActual: Login
): { login: Login; errorGeneral: string } => {
  const errorResponse = getMensajeError(error as unknown as ErrorResponse)
  
  const updatedLogin = Object.assign(new Login(), {
    ...loginActual,
    errors: {}
  })
  
  let errorGeneral = ''
  
  // Asignar error al campo correspondiente o como error general
  if (errorResponse.field === 'username') {
    updatedLogin.errors.username = errorResponse.message
  } else if (errorResponse.field === 'password') {
    updatedLogin.errors.password = errorResponse.message
  } else {
    // Errores de servidor/conexión van como error general
    errorGeneral = errorResponse.message
  }
  
  return {
    login: updatedLogin,
    errorGeneral: errorGeneral
  }
}