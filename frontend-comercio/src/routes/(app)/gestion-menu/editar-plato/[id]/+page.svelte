<script lang="ts">
  import '../editar-plato.css'
  import EditarPlatoForm from '../components/editar-plato-form.svelte'
  import { platoService } from '$lib/components/services/Plato-service'
  import { goto } from '$app/navigation'
  import { errorHandler } from '$lib/Error-handler'

  let { data } = $props()
  const platoForm = data.platoForm!

  async function onSubmit(localId: string) {
    try {
      await platoService.editarPlato(platoForm, localId)
      alert('Plato editado con éxito')
    } catch (e) {
      errorHandler(e)
    } finally {
      goto('/gestion-menu')
    }
  }
</script>

<div class="contenedor-editar-plato">
  <h1>Editar Plato</h1>

  <EditarPlatoForm {platoForm} submit={(localId) => onSubmit(localId)}></EditarPlatoForm>
</div>
