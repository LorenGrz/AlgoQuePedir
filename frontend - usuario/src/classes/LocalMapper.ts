import type { LocalCompleto } from '../models/localModels'
import type { LocalCalificacion } from '../models/localModels'
import type { LocalAcalificarRequest } from '../models/CalificacionModel'

/**
 * Transforma un LocalCompleto en un LocalCalificacion
 * @param localCompleto - El local completo obtenido del servicio
 * @param localId - El ID del local (puede venir del parámetro de ruta)
 * @returns Un objeto LocalCalificacion inicializado para calificar
 */
export const toLocalCalificacion = (
  localCompleto: LocalCompleto, 
  localId: number
): LocalCalificacion => {
  return {
    localId: localId,
    localNombre: localCompleto.nombre,
    puntuacion: 0,
    comentario: ''
  }
}

/**
 * Transforma un LocalCalificacion en un CalificacionRequest para enviar al backend
 * @param localCalificacion - El estado del formulario de calificación
 * @param localId - El ID del local
 * @returns Un objeto CalificacionRequest listo para enviar
 */
export const toCalificacionRequest = (
  localCalificacion: LocalCalificacion,
  localId: number
): LocalAcalificarRequest => {
  return {
    localId: localId,
    puntuacion: localCalificacion.puntuacion,
    comentario: localCalificacion.comentario.trim() || undefined
  }
}