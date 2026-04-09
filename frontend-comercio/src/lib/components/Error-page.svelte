<script lang="ts">
  import errorsvg from '$lib/assets/icons/error.svg'
  import type { Page } from '@sveltejs/kit'

  type Props = {
    page: Page
  }

  let { page }: Props = $props()
</script>

<section class="error-page">
  <div class="error-card">
    <div class="svg-container">
      <img class="iconn" src={errorsvg} alt="" />
    </div>
    <h2>
      Hubo un error al cargar la información del local
      {page.status == 599 ? '' : `(${page.status})`}
    </h2>
    <p>
      <small class="error-details">{page?.error?.message}</small>
    </p>
    <button class="reload-btn" onclick={() => location.reload()}>Reintentar</button>
  </div>
</section>

<style>
  .error-page {
    display: flex;
    justify-content: center;
    margin-top: calc(var(--margen-contenedor) * 3);
    text-align: center;
  }
  .error-card {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    padding: 2rem 3rem;
    max-width: 600px;
    width: 100%;
    animation: fadeIn 0.4s ease;
  }
  .svg-container {
    margin-bottom: 1rem;
  }
  .svg-container img {
    width: 4rem;
    border-color: var(--color-primario);
    filter: invert(15%) sepia(81%) saturate(3041%) hue-rotate(353deg) brightness(79%) contrast(93%); /* soy un villero si */
  }
  h2 {
    font-size: 1.4rem;
    color: var(--color-primario);
    margin-bottom: 0.5rem;
  }
  p {
    color: #444;
    margin-bottom: 1.5rem;
  }
  .error-details {
    display: block;
    margin-top: 0.5rem;
    color: #777;
    font-size: 0.9rem;
  }
  .reload-btn {
    background-color: var(--color-primario);
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: 0.3s ease;
  }
  .reload-btn:hover {
    background-color: var(--color-primario-hover);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 640px) {
    .error-card {
      background: transparent;
      box-shadow: none;
    }
  }
</style>
