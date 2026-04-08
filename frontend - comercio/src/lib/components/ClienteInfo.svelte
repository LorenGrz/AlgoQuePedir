<script lang="ts">
  import type { ClienteModel } from '$lib/components/models/pedido-models'

  export let cliente: ClienteModel
</script>

<section class="seccion-cliente">
  <section class="usuario-foto-container">
    <img class="foto-cliente" src={cliente.imgUrl} alt={cliente.nombre} />
    <div>
      <h3>{cliente.nombre}</h3>
      <p class="color-medio">{cliente.username}</p>
    </div>
  </section>
</section>

<style>
  .seccion-cliente {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-grow: 1;
  }

  .usuario-foto-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .foto-cliente {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    object-fit: cover;
  }

  .color-medio {
    color: var(--color-fuente-medio);
    margin: 0;
  }

  @media (max-width: 640px) {
    .seccion-cliente {
      margin-bottom: 1rem;
    }
  }
</style>
