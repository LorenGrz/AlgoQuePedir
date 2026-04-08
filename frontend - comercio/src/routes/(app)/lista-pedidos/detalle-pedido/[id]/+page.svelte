<script lang="ts">
  // COMPONENTES
  import { Boton } from '$lib'
  import { error } from '@sveltejs/kit'
  import ClienteInfo from '$lib/components/ClienteInfo.svelte'
  import DireccionInfo from '$lib/components/DireccionInfo.svelte'
  import TipoPago from '$lib/components/TipoPago.svelte'
  import EstadoBadge from './components/EstadoBadge.svelte'
  import type { PlatoDetalleModel } from '$lib/components/models/pedido-models'
  // ESTILOS
  import './detalle-Pedido.css'

  let { data } = $props()

  if (!data || !data.pedido) {
    throw error(404, 'Pedido no encontrado')
  }

  const { pedido } = data
  const items: PlatoDetalleModel[] = $derived(pedido.items)
  
</script>

<section class="detalle-pedido-container">
  <article class="detalle-pedido">
    <section class="encabezado-pedido">
      <div class="bloque-doble">
        <h1>Pedido #{pedido.id}</h1>
        <div class="estado-pedido">
          <span class="etiqueta-estado">Estado del pedido</span>
          <EstadoBadge estado={pedido.estado} />
        </div>
      </div>
    </section>

    <section class="contenedor">
      <div class="bloque-doble">
        <ClienteInfo cliente={pedido.cliente} />
        <DireccionInfo direccion={pedido.direccion} />
      </div>
    </section>

    <section class="contenedor">
      <h2 class="titulo-seccion">Resumen del Pedido</h2>
      <div class="grid-contenedor resumen-pedido">
        <div class="header">Plato</div>
        <div class="header centrado">Cantidad</div>
        <div class="header centrado">Precio</div>

        {#each items as item (item.id)}
        <div class="plato-info">
          <img src={item.imgUrl} alt={item.nombre} class="imagen-plato" />
          <div class="plato-datos">
            <h4 class="plato-nombre">{item.nombre}</h4>
            <p class="plato-descripcion">{item.descripcion}</p>
          </div>
        </div>
        <div class="centrado subtitulos">{item.cantidad}</div>  <!-- ← CAMBIO AQUÍ -->
        <div class="centrado subtitulos">${item.precio.toFixed(2)}</div>
      {/each}
      </div>
    </section>

    <section class="contenedor">
      <h2 class="titulo-seccion">Pago</h2>
      <section class="contenedor-subtotales">
        <div class="separador-precio">
          <div>Subtotal</div>
          <div>${pedido.pago.subtotal.toFixed(2)}</div>
        </div>
        <div class="separador-precio">
          <div>Comisión de delivery</div>
          <div>${pedido.pago.comisionDelivery.toFixed(2)}</div>
        </div>
        <div class="separador-precio">
          <div>Incremento de pago</div>
          <div>${pedido.pago.incrementoPago.toFixed(2)}</div>
        </div>
        <div class="separador-precio">
          <div>Total</div>
          <div>${pedido.pago.total.toFixed(2)}</div>
        </div>
      </section>

      <h2 class="titulo-seccion">Método de pago</h2>
      <TipoPago metodoPago={pedido.pago.metodoPago} />

      <footer class="botonera">
        <a href="/lista-pedidos/{pedido.estado.toLowerCase()}">
          <Boton tipo="primario">Volver</Boton>
        </a>
      </footer>
    </section>
  </article>
</section>

<style>
  .titulo-seccion {
    margin: 0.25rem 0 0.75rem;
  }

  .plato-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
  }

  .imagen-plato {
    width: 4.375rem;
    height: 3.75rem;
    object-fit: cover;
  }

  .plato-datos {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }

  .plato-nombre {
    font-weight: 600;
    color: var(--color-fuente-fuerte);
    margin: 0;
    font-size: 1rem;
  }

  .plato-descripcion {
    color: var(--color-fuente-medio);
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.3;
  }
</style>
