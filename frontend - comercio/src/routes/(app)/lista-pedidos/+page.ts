import { redirect } from '@sveltejs/kit'

export async function load() {
  // Redirige automáticamente a "pendiente"
  throw redirect(307, '/lista-pedidos/pendiente')
}