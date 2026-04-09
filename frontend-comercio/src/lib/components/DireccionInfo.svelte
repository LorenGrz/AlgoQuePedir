<script lang="ts">
  import type { DireccionModel } from '$lib/components/models/pedido-models'
  import ubicacion from '$lib/assets/icons/ubicacion.svg'

  export let direccion: DireccionModel
</script>

<section class="direccion-usuario">
  <img class="icono-ubicacion" src={ubicacion} alt="" />
  <address>
    <p>{direccion.direccion}</p>
    <p class="color-medio">
      Lat: {direccion.latitud.toFixed(4)}, Long: {direccion.longitud.toFixed(4)}
    </p>
  </address>
</section>

<style>
  .direccion-usuario {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .icono-ubicacion {
    width: 1.5rem;
    height: 1.5rem;
    margin-top: 0.25rem;
  }

  address {
    font-style: normal;
    margin: 0;
  }

  address p {
    margin: 0;
  }

  .color-medio {
    color: var(--color-fuente-medio);
  }
</style>
