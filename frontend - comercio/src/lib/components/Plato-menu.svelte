<script lang="ts">
  import type { Plato } from './classes/Plato.svelte'

  type Props = {
    plato: Plato
    tamanio?: 'grande' | 'chica'
  }
  const { plato, tamanio = 'grande' }: Props = $props()
</script>

<article class="separador-precio">
  <div class="plato-menu">
    <div class="imagen-plato imagen-{tamanio}">
      <img src={plato.imgUrl} alt={plato.nombre} />
    </div>
    <div class="plato-info">
      <p>{plato.nombre}</p>
      <p class="plato-descripcion">{plato.descripcion}</p>
    </div>
  </div>
  <span class="precio-plato-menu precio-{tamanio}">$ {plato.precioBase.toFixed(2)}</span>
</article>

<style>
  .plato-menu {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .plato-menu .plato-info {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-weight: 500;
    color: var(--color-fuente-fuerte);
  }
  .plato-menu .plato-info .plato-descripcion {
    color: var(--color-fuente-rojita);
    font-size: 0.9rem;
    font-weight: 100;
  }
  .imagen-grande {
    width: 6rem;
    height: 4rem;
    min-width: 6rem;
  }
  .imagen-chica {
    width: 4.375rem;
    min-width: 4.375rem;
    height: 3.75rem;
    object-fit: cover;
  }
  .precio-chica {
    display: none;
  }
  .precio-plato-menu {
    min-width: max-content;
  }

  @media (max-width: 640px) {
    .plato-menu .plato-info .plato-descripcion {
      display: none;
    }
    .precio-plato-menu {
      font-size: 0.9rem;
    }
    .imagen-grande {
      width: 5rem;
      height: 3.5rem;
      min-width: 5rem;
    }
    .imagen-chica {
      display: none;
    }
  }
</style>
