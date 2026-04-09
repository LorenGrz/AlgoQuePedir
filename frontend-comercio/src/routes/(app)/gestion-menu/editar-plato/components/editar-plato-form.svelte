<script lang="ts">
  import '../editar-plato.css'
  import '$lib/styles/contenedor-botones.css'
  import '$lib/styles/tabla-datos.css'
  import { Switch, Error, Fieldset, Boton } from '$lib'
  import IngredienteTablaFila from './Ingrediente-tabla-fila.svelte'
  import type { TablaDatosHeaderModel } from '$lib/components/models/Tabla-datos-header-model'
  import { Plato } from '$lib/components/classes/Plato.svelte'
  import { goto } from '$app/navigation'
  import noImage from '$lib/assets/images/no-image.png'
  import salirIcon from '$lib/assets/icons/salir.svg'
  import warningsvg from '$lib/assets/icons/warning.svg'
  import type { Ingrediente } from '$lib/components/classes/Ingrediente.svelte'
  import { errorHandler } from '$lib/Error-handler'
  import { ingredienteService } from '$lib/components/services/Ingrediente-service'

  const ingredienteTablaHeader: TablaDatosHeaderModel[] = [
    { nombre: 'Nombre' },
    { nombre: 'Grupo Alimenticio' },
    { nombre: 'Origen', clases: 'centrado' },
    { nombre: 'Acciones', clases: 'centrado' }
  ]

  let showPopup: boolean = $state(false)
  let ingredientesPopup: Ingrediente[] = $state([])

  type Props = {
    platoForm: Plato
    submit: (localId: string) => void
  }
  let { platoForm, submit }: Props = $props()

  $effect(() => {
    if (!platoForm.enPromocion && platoForm.porcentajeDescuento !== 0) {
      platoForm.porcentajeDescuento = 0
    }
  })

  function guardarCambios() {
    const localId = localStorage.getItem('localId')

    if (!localId) {
      alert('Debe estar logueado para guardar los cambios')
    } else {
      platoForm.validar()
      if (platoForm.tieneErrores()) return
      submit(localId)
    }
  }

  function eliminarIngredienteDelPlato(id: string) {
    platoForm.eliminarIngrediente(id)
  }

  function descartarCambios() {
    goto('/gestion-menu')
  }

  async function mostrarIngredientesPopup() {
    showPopup = true
    try {
      ingredientesPopup = await ingredienteService.obtenerTodos()
    } catch (e) {
      errorHandler(e)
    }
  }

  function agregarIngrediente(ingrediente: Ingrediente) {
    platoForm.ingredientes.push(ingrediente)
  }
</script>

<form onsubmit={guardarCambios} onreset={() => platoForm.resetErrores()} class="editar-plato-form">
  <section class="contenedor-imagen-inputs contenedor">
    <div class="inputs-contenedor elementos-espaciado">
      <Fieldset id="inp-plato-nombre" label="Nombre del platos">
        <input
          type="text"
          id="inp-plato-nombre"
          placeholder="Escribir"
          bind:value={platoForm.nombre}
        />
        <Error error={platoForm.errors.nombre} />
      </Fieldset>
      <div class="textarea-contenedor">
        <Fieldset id="inp-plato-desc" label="Descripcion">
          <textarea id="inp-plato-desc" placeholder="Escribir" bind:value={platoForm.descripcion}
          ></textarea>
          <Error error={platoForm.errors.descripcion} />
        </Fieldset>
      </div>
      <Fieldset label="URL de la imagen del plato" id="inp-plato-url">
        <input
          type="text"
          id="inp-plato-url"
          placeholder="Escribir"
          bind:value={platoForm.imgUrl}
        />
        <Error error={platoForm.errors.imgUrl} />
      </Fieldset>
    </div>

    <div class="img-contenedor">
      <img src={platoForm.imgUrl || noImage} alt="Burga" />
    </div>
  </section>

  <section class="contenedor elementos-espaciado">
    <h2>Costos</h2>
    <Fieldset label="Precio Base" id="inp-plato-precio">
      <input
        type="number"
        id="inp-plato-precio"
        placeholder="Escribir"
        bind:value={platoForm.precioBase}
      />
      <Error error={platoForm.errors.precioBase} />
    </Fieldset>
    <Switch id="chk-plato-autor" bind:value={platoForm.autor}>
      <div class="switch-label">
        <label for="chk-plato-autor" class="fuente-oscuro">Plato de Autor</label>
        <p>Aplica un porcentaje adicional al precio de venta</p>
      </div>
    </Switch>

    {#if platoForm.nuevo}
      <div class="warning">
        <img src={warningsvg} alt="" />
        Los platos nuevos no pueden estar en promocion. Esta funcionalidad se habilitara luego de 30
        dias creado el plato
      </div>
    {:else}
      <Switch id="chk-plato-promocion" bind:value={platoForm.enPromocion}>
        <div class="switch-label">
          <label for="chk-plato-promocion" class="fuente-oscuro">Plato de Promocion</label>
          <p>Aplica un descuento al precio de venta</p>
        </div>
      </Switch>

      {#if platoForm.enPromocion}
        <Fieldset id="inp-plato-porc-dto" label="Porcentaje de descuento">
          <input
            type="number"
            id="inp-plato-porc-dto"
            placeholder="Escribir"
            bind:value={platoForm.porcentajeDescuento}
          />
          <Error error={platoForm.errors.porcentajeDescuento} />
        </Fieldset>
      {/if}
    {/if}
  </section>

  <section class="contenedor elementos-espaciado">
    <h2>Ingredientes</h2>

    <div>
      <span class="precio">Costo de Produccion</span>
      <span> $ {platoForm.costoTotal.toFixed(2)}</span>
    </div>

    <div class="contenedor-boton" style="padding: 0;">
      <button type="button" class="agreegar-ing" onclick={() => mostrarIngredientesPopup()}
        >Agregar ingrediente</button
      >
    </div>

    <Error error={platoForm.errors.ingredientes} />
    <div class="contenedor-tabla-datos">
      {#each ingredienteTablaHeader as header}
        <div class={`header ${header.clases}`}>{header.nombre}</div>
      {/each}

      {#each platoForm.ingredientes as ingrediente}
        <IngredienteTablaFila {ingrediente} eliminarIngrediente={eliminarIngredienteDelPlato} />
      {/each}
    </div>
  </section>

  <div class="contenedor-boton">
    <Boton tipo="primario">Guardar Cambios</Boton>
    <Boton tipo="secundario" onclick={descartarCambios}>Descartar Cambios</Boton>
  </div>
</form>

{#if showPopup}
  <div class="background">
    <div class="popup">
      <button
        class="salir-icon"
        onclick={() => {
          showPopup = false
        }}
      >
        <img src={salirIcon} alt="Salir" />
      </button>
      <p>Al clickear un ingrediente se agregara a la lista</p>
      {#each ingredientesPopup as ingrediente}
        <button class="ingrediente" onclick={() => agregarIngrediente(ingrediente)}>
          {ingrediente.nombre}
        </button>
      {/each}
    </div>
  </div>
{/if}
