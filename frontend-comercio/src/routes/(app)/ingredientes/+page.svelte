<script lang="ts">
  import './ingredientes.css'
  import '$lib/styles/tabla-datos.css'
  import '$lib/styles/contenedor-botones.css'
  import { Boton } from '$lib'
  import IngredienteTablaFila from './Ingrediente-tabla-fila.svelte'
  import type { TablaDatosHeaderModel } from '$lib/components/models/Tabla-datos-header-model'
  import { errorHandler } from '$lib/Error-handler'
  import { ingredienteService } from '$lib/components/services/Ingrediente-service'
  import { invalidate } from '$app/navigation'
  import type { Ingrediente } from '$lib/components/classes/Ingrediente.svelte'

  let { data } = $props()
  let ingredientes = $state([...(data.ingredientes ?? [])])

  $effect(() => {
    ingredientes = [...(data.ingredientes ?? [])]
  })

  let ingredienteTablaHeader: TablaDatosHeaderModel[] = [
    { nombre: 'Nombre' },
    { nombre: 'Costo' },
    { nombre: 'Grupo Alimenticio', clases: 'ocultar-mobile' },
    { nombre: 'Origen', clases: 'centrado ocultar-mobile' },
    { nombre: 'Acciones', clases: 'centrado' }
  ]

  async function eliminar(ingrediente: Ingrediente) {
    try {
      await ingredienteService.eliminar(ingrediente)
    } catch (e) {
      errorHandler(e)
    } finally {
      await invalidate('get:ingrediente')
    }
  }
</script>

<div class="ingredientes-contenedor elementos-espaciado">
  <div class="titulo-boton-pildora">
    <h1>Ingredientes</h1>
    <a href="/ingredientes/editar-ingrediente">
      <Boton tipo="pildora">Nuevo Ingrediente</Boton>
    </a>
  </div>

  <div class="contenedor contenedor-tabla-datos" style="padding: 0">
    {#each ingredienteTablaHeader as header}
      <div class={`header ${header.clases}`}>{header.nombre}</div>
    {/each}

    {#each ingredientes as ingrediente}
      <IngredienteTablaFila {ingrediente} eliminarIngrediente={eliminar} />
    {/each}
  </div>
</div>
