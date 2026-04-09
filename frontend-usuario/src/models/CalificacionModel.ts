export interface Calificacion {
  id: number
  localId: string
  localNombre: string
  puntuacion: number
  comentario: string
  fecha: string
}

export interface LocalAcalificarRequest {
  localId: number
  puntuacion: number   
  comentario?: string
}

// Esta es la respuesta que viene del backend
export interface CalificacionResponse {
  ok: boolean
  puntajePromedio: number
  mensaje: string
}