<script lang="ts">
  import { EstadoPedidoModel } from '../../../../../../lib/components/models/pedido-models'

  export let estado: EstadoPedidoModel

  const estadoTexto = {
    [EstadoPedidoModel.Pendiente]: 'Pendiente',
    [EstadoPedidoModel.Preparado]: 'Preparado',
    [EstadoPedidoModel.Cancelado]: 'Cancelado',
    [EstadoPedidoModel.Entregado]: 'Entregado'
  }

  const estadoClase = {
    [EstadoPedidoModel.Pendiente]: 'badge-pendiente',
    [EstadoPedidoModel.Preparado]: 'badge-preparado',
    [EstadoPedidoModel.Cancelado]: 'badge-cancelado',
    [EstadoPedidoModel.Entregado]: 'badge-entregado'
  }
</script>

<span class="badge-estado {estadoClase[estado]}">
  {estadoTexto[estado]}
</span>

<style>
  .badge-estado {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0.4rem 1.25rem;
    border-radius: 9999px;
    color: var(--color-fuente-suave);
    width: 12rem;
  }

  .badge-pendiente {
    background: var(--color-terciario);
  }

  .badge-preparado {
    background: #f59e0b;
  }

  .badge-cancelado {
    background: #3b82f6;
  }

  .badge-entregado {
    background: #10b981;
  }

  @media (max-width: 640px) {
    .badge-estado {
      width: 10rem;
    }
  }
</style>
