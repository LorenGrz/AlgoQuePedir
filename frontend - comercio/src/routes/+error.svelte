<script lang="ts">
  import { Boton } from '$lib'
  import { goto } from '$app/navigation'
  import '$lib/styles/global.css'

  function volverAlLogin() {
    goto('/login')
  }
</script>

<section class="error-page">
  <div class="center-wrap">
    <div class="content">
      <h1>404</h1>
      <h2>¡Oh ohh! La página que buscás no existe</h2>
      <Boton tipo="pildora" onclick={volverAlLogin}>Volver al Inicio</Boton>

      <!-- imagen posicionada relativa a .content -->
      <img src="/src/lib/assets/images/Brent_McHale.png" alt="Brent McHale" class="error-img" />
    </div>
  </div>
</section>

<style>
  .error-page {
    min-height: 100vh;
    width: 100%;
    min-width: 670px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fafafa;
    color: #333;
    font-family: 'Inter', sans-serif;
    overflow: hidden;
  }

  .center-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .content {
    position: relative;
    text-align: center;
    max-width: 600px;
    padding: 2rem;
    z-index: 1;
  }

  .content h1 {
    font-size: 5rem;
    margin: 0;
    color: var(--color-primario);
  }

  .content h2 {
    font-size: 1.5rem;
    font-weight: 500;
    max-width: 500px;
    margin: 1rem auto 2rem auto;
  }
  .error-img {
    position: absolute;
    left: 58px;
    top: 12px;
    transform: translate(20px, -50%);
    width: 220px;
    height: auto;
    pointer-events: none;
    opacity: 0.9;
  }
</style>
