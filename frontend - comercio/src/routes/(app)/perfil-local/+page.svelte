<script lang="ts">
  import { invalidate } from '$app/navigation'
  import { Boton, Fieldset, Checkbox, Error } from '$lib'
  import { localService } from './utils/Local-service'
  import '$lib/styles/contenedor-botones.css'
  import '$lib/styles/tabla-datos.css'
  import './perfil-local.css'

  let { data } = $props()
  const local = data.local!

  async function onSubmit(): Promise<void> {
    const localId = localStorage.getItem('localId')
    local.validar()
    if (local.tieneErrores()) return

    try {
      await localService.actualizarLocal(local, Number(localId))
      alert('Local actualizado correctamente :)')
    } catch (error: unknown) {
      console.error('Error al enviar:', error)
      alert('Se perdió la conexión con el servidor. Intente nuevamente más tarde.')
    } finally {
      await invalidate('get:local')
    }
  }
</script>

<form class="contenedor-perfil" onsubmit={onSubmit} onreset={() => local.resetErrores()}>
  <h1>Información del local</h1>

  <article class="contenedor-imagen-inputs contenedor">
    <div class="identidad-input elementos-espaciado">
      <Fieldset label="Nombre del local" id="nombre-local">
        <input
          type="text"
          id="nombre-local"
          placeholder="Escribir"
          bind:value={local.nombre}
          data-testid="nombre-local"
        />
        <Error error={local.errors.nombre} />
      </Fieldset>
      <Fieldset label="URL de la imagen" id="img-local">
        <input
          type="text"
          id="img-local"
          placeholder="Escribir"
          bind:value={local.url}
          data-testid="img-local"
        />
        <Error error={local.errors.url} />
      </Fieldset>
    </div>
    <div class="img-local">
      <img src={local.url} alt="Local" />
    </div>
  </article>

  <article class="elementos-espaciado datos-direccion contenedor">
    <h2>Dirección</h2>
    <div class="fila-input">
      <Fieldset label="Direccion" id="direccion-local">
        <input
          type="text"
          id="direccion-local"
          placeholder="Escribir"
          bind:value={local.direccion}
          data-testid="direccion-local"
        />
        <Error error={local.errors.direccion} />
      </Fieldset>
      <Fieldset label="Altura" id="altura-local">
        <input
          type="number"
          id="altura-local"
          placeholder="Escribir"
          bind:value={local.altura}
          data-testid="altura-local"
        />
        <Error error={local.errors.altura} />
      </Fieldset>
    </div>
    <div class="fila-input">
      <Fieldset label="Latitud" id="latitud-local">
        <input
          type="number"
          id="latitud-local"
          placeholder="Escribir"
          data-testid="latitud-local"
          bind:value={local.latitud}
          step="any"
        />
        <Error error={local.errors.latitud} />
      </Fieldset>
      <Fieldset label="Longitud" id="longitud-local">
        <input
          type="number"
          id="longitud-local"
          placeholder="Escribir"
          data-testid="longitud-local"
          bind:value={local.longitud}
          step="any"
        />
        <Error error={local.errors.longitud} />
      </Fieldset>
    </div>
  </article>

  <article class="elementos-espaciado contenedor">
    <h2>Porcentajes</h2>
    <div class="fila-input">
      <Fieldset label="Comisión con la app (%)" id="porcentaje-local">
        <input
          type="number"
          id="porcentaje-local"
          placeholder="Escribir"
          bind:value={local.porcentajeApp}
          data-testid="porcentaje-local"
        />
        <Error error={local.errors.porcentajeApp} />
      </Fieldset>
      <Fieldset label="Comisión con autores de platos (%)" id="porcentaje-autores-local">
        <input
          type="number"
          id="porcentaje-autores-local"
          placeholder="Escribir"
          bind:value={local.porcentajeComision}
          data-testid="porcentaje-autores-local"
        />
        <Error error={local.errors.porcentajeComision} />
      </Fieldset>
    </div>
    <h2>Métodos de pago</h2>
    <div class="container-checkboxes-local">
      <Checkbox label="Efectivo" id="efectivo" bind:value={local.metodos.efectivo} />
      <Checkbox label="QR" id="qr" bind:value={local.metodos.qr} />
      <Checkbox label="Transferencia" id="transferencia" bind:value={local.metodos.transferencia} />
    </div>
    <Error error={local.errors.metodos} />
  </article>

  <div class="contenedor-boton">
    <Boton tipo="primario">Guardar Cambios</Boton>
    <Boton tipo="secundario">Descartar Cambios</Boton>
  </div>
</form>
