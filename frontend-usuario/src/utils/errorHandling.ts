import { AxiosError } from 'axios'

export const getMensajeError = (error: unknown): ErrorCustom => {
  let errorMessage = 'Ocurrió un error. Consulte al administrador del sistema'
  let status = 0

  if (error instanceof Error) {
    errorMessage = error.message
  }

  if (error instanceof AxiosError) {
    status = error.response?.status ?? error.status ?? 0
    if (status == 400) {
      errorMessage = 'El ID del recurso que estás buscando es erroneo'
    }  
    else if (status == 401) {
      errorMessage = 'Credenciales incorrectas'
    }
    else if (status == 404) {
      errorMessage = 'El recurso que estás buscando no existe'
    } 
    else if (status == 409) {
      errorMessage = 'Este usuario ya está registrado'
    }
    else if (status == 500) {
      errorMessage = 'Un talibán explotó el servidor llama a la policia'
    } else {
      errorMessage =
        'Ocurrió un error al conectarse al backend. Consulte al administrador del sistema'
    }
    
    /* Esto es lo que tenia Fer */
    /* errorMessage = status >= 400 && status < 500 ? error.response?.data.message : 'Ocurrió un error al conectarse al backend. Consulte al administrador del sistema' */
    console.error(error)
  }

  return {
    status: status,
    message: errorMessage
  }
}

export type ErrorResponse = {
  response: {
    status?: number
    data: {
      message: string
    }
  }
}

export type ErrorCustom = {
  status?: number
  message: string
}