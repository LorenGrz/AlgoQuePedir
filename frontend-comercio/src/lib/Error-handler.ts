/* Handler copiado tal cual del profe y adaptado para el caso de uso */
import { error as svError } from '@sveltejs/kit'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorHandler = (error: any): void => {
  /* Si el error es del backend, uso el status que me devuelve 400 o 404, si no viene, es porque esta caído (599 - Network Connect Timeout Error)  */
  /* https://sitechecker.pro/what-is-599-status-code/ */
  /* La alternativa es dejar que explote y mostrar un mensaje de error genérico en caso de no haber status */
  const status = error?.response?.status ?? 599
  let mensaje = 'Error desconocido'
  
  // Si el error fue una redirección, lo propagamos tal cual
  if (error?.status === 302) throw error

  if (error.code === 'ERR_NETWORK') {
    mensaje = 'Ocurrió un problema de conexión con el servidor. Intente nuevamente más tarde'
  } else if (error.response.data.status == 400){
    mensaje = 'El ID es erroneo.'
  } else if (error.response.data.message) {
    mensaje = error.response.data.status < 500 ? error.response.data.message : 'Ocurrió un error, consulte al administrador del sistema.'
  } else if (error.message) {
    mensaje = error.message
  }
  
  // La manera recomendada por sveltekit 5 de pasar el error del backend desde page.ts al +error.svelte es esta
  svError(status, mensaje)
}