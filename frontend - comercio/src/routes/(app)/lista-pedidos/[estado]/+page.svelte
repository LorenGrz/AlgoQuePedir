<script lang="ts">
  import '$lib/styles/contenedor-botones.css'
  import CardPedido from './components/Card-pedido.svelte'
  import { EstadoPedidoModel } from '$lib/components/models/pedido-models'
  import './lista-pedidos.css'
  import { goto } from '$app/navigation'
  let { data } = $props()
  let pedidosFiltrados = $derived(data.pedidos)
  let estadoActivo = $derived(data.estadoParam)

  async function cambiarEstado(estado: EstadoPedidoModel) {
    if (estadoActivo === estado) return // evitar recarga innecesaria
    await goto(`/lista-pedidos/${estado.toLowerCase()}`, {
      invalidate: ['get:pedidos']
    })
  }
  const estados: EstadoPedidoModel[] = [
    EstadoPedidoModel.Pendiente,
    EstadoPedidoModel.Preparado,
    EstadoPedidoModel.Entregado,
    EstadoPedidoModel.Cancelado
  ]
</script>

<div class="contenedor-pedidos">
  <div class="navegacion-pedidos">
    <h1>Pedidos actuales</h1>
    <nav class="tabs-pedidos">
      {#each estados as estado}
        <button class:active={estadoActivo === estado} onclick={() => cambiarEstado(estado)}>
          {estado.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
        </button>
      {/each}
    </nav>
  </div>
  <section class="ordenes-container">
    {#each pedidosFiltrados as pedido}
      <CardPedido {pedido} />
    {/each}
  </section>
</div>
