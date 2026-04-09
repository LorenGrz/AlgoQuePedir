import axios from 'axios'
import type { Metodos } from './Local.svelte'
import { Local } from './Local.svelte'
import { API_URL } from '$lib/components/services/Variables-entorno'

export interface LocalResponse {
  nombre: string
  direccion: string
  altura: number
  latitud: number
  longitud: number
  porcentajeApp: number
  porcentajeComision: number
  url: string
  metodos: Metodos
}

class LocalService {
  async obtenerLocal(id: number): Promise<Local> {
    const local = new Local()
    
    const response = await axios.get<LocalResponse>(API_URL + '/local/' + id)
    const { data } = response
    
    local.fromJson(data)

    return local
  }

  async actualizarLocal(local: Local, id: number): Promise<void>{
    await axios.put(API_URL+ '/local/' + id, local.toJson())   
  }
}

export const localService = new LocalService()
