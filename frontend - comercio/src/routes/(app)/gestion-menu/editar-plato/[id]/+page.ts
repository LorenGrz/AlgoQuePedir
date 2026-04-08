import { platoService } from '$lib/components/services/Plato-service'
import { Plato } from '$lib/components/classes/Plato.svelte'
import { errorHandler } from '$lib/Error-handler'

export async function load({ params }: {params: {id: string}}) {
  try {
    const response = await platoService.obtenerPlato(params.id)
    const platoForm = new Plato({...response, id: params.id, imgUrl: response.imgUrl ?? ''})
    return { platoForm }
  } catch (e) {
    errorHandler(e)
  }
}
