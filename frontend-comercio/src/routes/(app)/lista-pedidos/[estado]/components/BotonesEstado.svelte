<script lang="ts">
  import { invalidate } from '$app/navigation'
  import { pedidoService } from '../../../../../lib/components/services/Pedido-service'
  import { EstadoPedidoModel } from '$lib/components/models/pedido-models'
  import type { Pedido } from '../../../../../lib/components/classes/Pedido.svelte'
  import Boton from '$lib/components/Boton.svelte'
  import { errorHandler } from '$lib/Error-handler'

  export let pedido: Pedido
  async function handleCancelarPedido(event: MouseEvent, id: number) {
    event.preventDefault()
    event.stopPropagation()
    await cancelarPedido(id)
  }

  async function handlePrepararPedido(event: MouseEvent, id: number) {
    event.preventDefault()
    event.stopPropagation()
    await prepararPedido(id)
  }

  async function cancelarPedido(id: number) {
    try {
      await pedidoService.cancelarPedido(id)
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errorHandler(e)
    } finally {
      await invalidate('get:pedidos')
    }
  }

  async function prepararPedido(id: number) {
    try {
      await pedidoService.prepararPedido(id)
    } catch (error) {
      console.error('Error al preparar el pedido:', error)
    } finally {
      await invalidate('get:pedidos')
    }
  }
</script>

<div class="botones-card">
  {#if pedido.estado === EstadoPedidoModel.Preparado || pedido.estado === EstadoPedidoModel.Pendiente}
    <button class="boton-preparar" onclick={(event) => handleCancelarPedido(event, +pedido.id)}>
      <Boton tipo="secundario">Cancelar</Boton>
    </button>
  {/if}
  {#if pedido.estado === EstadoPedidoModel.Pendiente}
    <button class="boton-preparar" onclick={(event) => handlePrepararPedido(event, +pedido.id)}>
      <Boton tipo="primario">Preparar</Boton>
    </button>
  {/if}
</div>

<style>
  .boton-preparar {
    background-color: transparent;
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 2em;
    min-width: 4em;
    border: none;
    flex-shrink: 0; /* evita que se achiquen demasiado */
  }
  .botones-card {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    width: 100%;
  }

  @media (max-width: 640px) {
    .boton-preparar {
      min-width: 3em;
    }
  }
</style>
