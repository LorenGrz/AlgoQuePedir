import { redirect } from '@sveltejs/kit'
import { localService } from './utils/Local-service'
import { errorHandler } from '$lib/Error-handler'

export const ssr = false

export async function load({ depends }) {
  depends('get:local')
  try {
    const localId = localStorage.getItem('localId')
    
    if (!localId) {
      // Ruta protegida
      redirect(302, '/login')
    }
    
    const local = await localService.obtenerLocal(Number(localId))
    return { local }
  } catch(e: unknown){
    errorHandler(e)
  }
}