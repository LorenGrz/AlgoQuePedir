import { ingredienteService } from '$lib/components/services/Ingrediente-service'
import { errorHandler} from '$lib/Error-handler'
import { redirect } from '@sveltejs/kit'

export const ssr = false

export async function load({ depends }) {
  depends('get:ingrediente')

  try {
    const localId = localStorage.getItem('localId')

    if (!localId) {
      // Ruta protegida
      redirect(302, '/login')
    }

    const ingredientes = await ingredienteService.obtenerTodos()
    return { ingredientes }
    
  } catch (e) {
    errorHandler(e)
  }
}
