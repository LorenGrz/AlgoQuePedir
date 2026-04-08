<script lang="ts">
  import './editar-plato.css'
  import EditarPlatoForm from './components/editar-plato-form.svelte'
  import { Plato } from '$lib/components/classes/Plato.svelte'
  import { platoService } from '$lib/components/services/Plato-service'
  import { goto } from '$app/navigation'
  import { errorHandler } from '$lib/Error-handler'

  const platoForm = new Plato()

  async function onSubmit(localId: string) {
    try {
      await platoService.crearPlato(platoForm, localId)
      alert('Plato creado con éxito')
    } catch (e) {
      errorHandler(e)
    } finally {
      goto('/gestion-menu')
    }
  }
</script>

<div class="contenedor-editar-plato">
  <h1>Nuevo Plato</h1>

  <EditarPlatoForm {platoForm} submit={(localId) => onSubmit(localId)}></EditarPlatoForm>
</div>
