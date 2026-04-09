import { error, redirect } from '@sveltejs/kit'
import { ingredienteService } from '$lib/components/services/Ingrediente-service'
import { errorHandler } from '$lib/Error-handler'
import type { PageLoad } from './$types'

export const ssr = false

export const load: PageLoad = async ({ params, depends }) => {
  depends('get:ingredientes')

  const { id } = params

  if (!id) {
    throw error(404, { message: 'ID de ingrediente no encontrado' })
  }

  try {

    const localId = localStorage.getItem('localId')

    if (!localId) {
      // Ruta protegida
      redirect(302, '/login')
    }
    
    const ingrediente = await ingredienteService.obtenerPorId(id)
    return { ingrediente }
  } catch (e: unknown) {
    errorHandler(e)
  }
}