
import { redirect } from '@sveltejs/kit'
import { errorHandler } from '$lib/Error-handler'

export const ssr = false

export async function load({ depends }) {
  depends('get:ingrediente')
  
  try {
    const localId = localStorage.getItem('localId')
    
    if (!localId) {
      redirect(302, '/login')
    }
    //verificamos si el usuario esta autenticado
    return {}
    
  } catch (e) {
    errorHandler(e)
  }
}