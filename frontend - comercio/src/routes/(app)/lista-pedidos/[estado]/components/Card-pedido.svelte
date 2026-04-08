<script lang="ts">
  import type { Pedido } from '../../../../../lib/components/classes/Pedido.svelte'
  export let pedido: Pedido
  import { DireccionInfo, ClienteInfo, TipoPago } from '$lib'
  import BotonesEstado from './BotonesEstado.svelte'

  function convertirStringADate(fechaString: string): Date {
    let date = new Date(fechaString).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    return date as unknown as Date
  }
</script>

<a class="ordenes-card" href={'/lista-pedidos/detalle-pedido/' + pedido.id}>
  <p class="color-secundario">Pedido {pedido.id}</p>
  <ClienteInfo cliente={pedido.cliente} />
  <p class="color-secundario">
    Hora: {convertirStringADate(pedido.fechaCreacion)} | Artículos: {pedido.cantidadItems}
    | Total: ${pedido.pago.total.toFixed(2)}
  </p>
  <DireccionInfo direccion={pedido.direccion} />
  <TipoPago metodoPago={pedido.pago.metodoPago} />
  <BotonesEstado {pedido} />
</a>

<style>
  /* Tarjetas */
  .ordenes-card {
    text-decoration: none;
    color: inherit;
    min-width: 360px;
    max-width: 500px;
    width: 100%;
    background: var(--color-fuente-suave);
    border-radius: var(--radio-contenedor);
    padding: 1em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    border: 0.1rem solid var(--color-secundario);
    align-items: flex-start;
  }
  .ordenes-card:hover {
    transform: translateY(-0.3rem);
    box-shadow: 0 0.25rem 1rem var(--color-secundario);
    border-color: var(--color-fuente-suave);
    cursor: pointer;
  }

  @media (max-width: 640px) {
    .ordenes-card {
      min-width: 320px;
    }
  }
</style>
