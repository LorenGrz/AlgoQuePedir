import axios from 'axios'
import { API_URL } from '../env'
import type { LocalAcalificarRequest, CalificacionResponse } from '../models/CalificacionModel'
import type { LocalResumen } from '../models/localModels'

class CalificacionesService {
  async traerLocalesPendientes(usuarioId: number): Promise<LocalResumen[]> {
    const { data } = await axios.get<LocalResumen[]>(
      `${API_URL}/calificaciones/${usuarioId}/pendientes`)
    return data
  }

  async calificar(usuarioId: number, payload: LocalAcalificarRequest): Promise<CalificacionResponse> {
    const { data } = await axios.post<CalificacionResponse>(
      `${API_URL}/calificaciones/${usuarioId}/calificar`, payload)
    return data
  }
}

export const calificacionesService = new CalificacionesService()