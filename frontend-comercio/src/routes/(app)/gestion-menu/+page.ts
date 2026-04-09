import { menuService } from './Menu-service.js'
import { errorHandler } from '$lib/Error-handler'

export async function load() {
  try {
    const platos = await menuService.obtenerPlatos()
    return { platos }
  } catch(e: unknown){
    errorHandler(e)
  }
}