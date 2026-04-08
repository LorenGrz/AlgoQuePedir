<script lang="ts">
  import { goto } from '$app/navigation'
  import { Fieldset, Switch, Boton, Error } from '$lib'
  import { ingredienteService } from '$lib/components/services/Ingrediente-service'
  import { Ingrediente } from '$lib/components/classes/Ingrediente.svelte'
  import { errorHandler } from '$lib/Error-handler'

  interface Props {
    ingredienteInicial?: Ingrediente
    modo: 'crear' | 'editar'
  }

  let { ingredienteInicial, modo }: Props = $props()

  let guardando = $state(false)

  // Usar la clase de dominio siguiendo el patrón de Plato
  let ingrediente = $state(new Ingrediente(ingredienteInicial))

  const titulo = modo === 'crear' ? 'Crear Ingrediente' : 'Editar Ingrediente'

  function onSubmit(event: Event) {
    event.preventDefault()
    guardarCambios()
  }

  async function guardarCambios() {
    //VALIDAMOS EL INGREDIENTE USANDO EL OBJETO DE DOMINIO
    ingrediente.validar()

    if (ingrediente.tieneErrores()) {
      return
    }

    guardando = true

    try {
      if (modo === 'crear') {
        await ingredienteService.crear(ingrediente)
      } else {
        await ingredienteService.actualizar(ingrediente)
      }
      goto('/ingredientes')
    } catch (e) {
      errorHandler(e)
    } finally {
      guardando = false
    }
  }

  function descartarCambios() {
    if (confirm('¿Estás seguro de que quieres descartar los cambios?')) {
      goto('/ingredientes')
    }
  }
</script>

<section class="contenedor-editar-ingrediente">
  <div class="contenedor-titulo">
    <h1 class="titulo">{titulo}</h1>
  </div>

  <div class="contenedor tarjeta-form">
    <form
      class="form-ingrediente"
      id="form-ingrediente"
      onsubmit={onSubmit}
      onreset={() => ingrediente.resetErrores()}
    >
      <Fieldset label="Nombre del Ingrediente" id="nombre-ingrediente">
        <input
          type="text"
          id="nombre-ingrediente"
          placeholder="Lechuga"
          bind:value={ingrediente.nombre}
          disabled={guardando}
        />
        <Error error={ingrediente.errors.nombre} />
      </Fieldset>

      <Fieldset label="Costo" id="costo">
        <input
          type="number"
          id="costo"
          placeholder="$5"
          bind:value={ingrediente.costo}
          disabled={guardando}
        />
        <Error error={ingrediente.errors.costo} />
      </Fieldset>

      <Fieldset label="Grupo Alimenticio" id="grupo">
        <select id="grupo" bind:value={ingrediente.grupoAlimenticio} disabled={guardando}>
          <option value="" disabled>Selecciona un grupo</option>
          <option value="CEREALES_Y_TUBERCULOS">Cereales y Tubérculos</option>
          <option value="AZUCARES_Y_DULCES">Azúcares y Dulces</option>
          <option value="LACTEOS">Lácteos</option>
          <option value="FRUTAS_Y_VERDURAS">Frutas y Verduras</option>
          <option value="GRASAS_Y_ACEITES">Grasas y Aceites</option>
          <option value="PROTEINAS">Proteínas</option>
        </select>
        <Error error={ingrediente.errors.grupoAlimenticio} />
      </Fieldset>

      <Switch id="origen-animal" bind:value={ingrediente.origenAnimal}>
        <div class="switch-label">
          <label for="origen-animal">Origen animal</label>
        </div>
      </Switch>
    </form>
  </div>

  <div class="contenedor-boton">
    <Boton
      tipo="primario"
      form="form-ingrediente"
      onclick={() => guardarCambios()}
      disabled={guardando}
    >
      <span class="txt-desktop">{guardando ? 'Guardando...' : 'Guardar Cambios'}</span>
      <span class="txt-mobile">{guardando ? 'Guardando...' : 'Guardar'}</span>
    </Boton>
    <Boton
      tipo="secundario"
      form="form-ingrediente"
      onclick={() => descartarCambios()}
      disabled={guardando}
    >
      <span class="txt-desktop">Descartar cambios</span>
      <span class="txt-mobile">Descartar</span>
    </Boton>
  </div>
</section>

<style>
  @import '../editar-ingrediente.css';
</style>
