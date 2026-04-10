<script lang="ts">
  import type { Pedido } from '../../../../../lib/components/classes/Pedido.svelte'
  export let pedido: Pedido
  import { DireccionInfo, ClienteInfo, TipoPago } from '$lib'
  import BotonesEstado from './BotonesEstado.svelte'

  function convertirStringADate(fechaString: string): string {
    return new Date(fechaString).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
</script>

<a class="ordenes-card" href={'/lista-pedidos/detalle-pedido/' + pedido.id}>
  <p class="pedido-id">Pedido #{pedido.id}</p>
  <ClienteInfo cliente={pedido.cliente} />
  <p class="pedido-meta">
    {convertirStringADate(pedido.fechaCreacion)} &nbsp;·&nbsp; {pedido.cantidadItems} artículo{pedido.cantidadItems !== 1 ? 's' : ''} &nbsp;·&nbsp; <strong>${pedido.pago.total.toFixed(2)}</strong>
  </p>
  <DireccionInfo direccion={pedido.direccion} />
  <TipoPago metodoPago={pedido.pago.metodoPago} />
  <BotonesEstado {pedido} />
</a>

<style>
  .ordenes-card {
    text-decoration: none;
    color: inherit;
    min-width: 320px;
    max-width: 500px;
    width: 100%;
    background: var(--color-fuente-suave);
    border-radius: var(--radio-contenedor);
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    border: 1px solid var(--color-borde-suave);
    align-items: flex-start;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .ordenes-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: #d1d5db;
    cursor: pointer;
  }

  .pedido-id {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-fuente-medio);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .pedido-meta {
    font-size: 0.8rem;
    color: var(--color-fuente-medio);
  }

  @media (max-width: 640px) {
    .ordenes-card {
      min-width: 280px;
    }
  }
</style>
