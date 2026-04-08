<script lang="ts">
  import cocina from '$lib/assets/icons/cocina.svg'
  import menu from '$lib/assets/icons/menu.svg'
  import usuario from '$lib/assets/icons/usuario.svg'
  import carrito from '$lib/assets/icons/carrito-de-compras.svg'
  import cubiertos from '$lib/assets/icons/cubiertos.svg'
  import helado from '$lib/assets/icons/helado.svg'
</script>

<header>
  <div class="navbar-header">
    <div class="navbar-logo-y-titulo">
      <a href="/"><img src={cocina} alt="" /></a>
      <h1 class="navbar-titulo-logo">Algo Que Pedir</h1>
    </div>
    <div class="navbar-menus-tablet-desktop navbar-links">
      <nav class="navbar-container">
        <input type="checkbox" id="menu-toggle" />
        <label for="menu-toggle">
          <img src={menu} alt="Menú" class="menu-icon" />
        </label>
        <ul class="menu navbar-links">
          <li><a href="/lista-pedidos">Pedidos</a></li>
          <li><a href="/gestion-menu">Menú</a></li>
          <li><a href="/ingredientes">Ingredientes</a></li>
          <li><a href="/perfil-local">Cuenta</a></li>
        </ul>
      </nav>
      <img src={usuario} alt="" />
    </div>
  </div>
  <nav class="nav-footer">
    <a href="/"><img src={cocina} alt="" /></a>
    <a href="/"><img src={carrito} alt="" /></a>
    <a href="/"><img src={cubiertos} alt="" /></a>
    <a href="/"><img src={helado} alt="" /></a>
    <a href="/"><img src={usuario} alt="" /></a>
  </nav>
</header>

<style>
  .navbar-header {
    top: 0;
    left: 0;
    position: fixed;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--color-fondo-header);
    background-color: var(--color-fuente-suave);
    z-index: 100;
  }
  .navbar-links a {
    text-decoration: none;
    color: var(--color-fuente-fuerte);
  }
  a:hover {
    color: var(--color-primario);
  }
  .navbar-titulo-logo {
    font-size: 1.3rem;
    color: var(--color-primario);
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  header img {
    width: 2rem;
    height: 2rem;
    cursor: pointer;
  }
  .navbar-logo-y-titulo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  .navbar-links {
    align-items: center;
    font-weight: 500;
    list-style: none;
    display: flex;
    gap: 1rem;
  }
  .navbar-menus-tablet-desktop {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  .nav-footer {
    display: none;
  }
  #menu-toggle {
    display: none;
  }
  /* Ícono del menú */
  .menu-icon {
    display: none; /* Se mostrará solo en tablets/móviles */
  }

  @media (max-width: 1024px) {
    .menu-icon {
      display: block;
    }
    /* Menú por defecto (visible en escritorio) */
    ul.menu {
      list-style: none;
      margin: 0;
      padding: 0;
      background: var(--color-fuente-suave);
      position: absolute;
      right: 0;
      display: none;
      flex-direction: column;
      z-index: 10;
    }
    ul.menu li a {
      text-decoration: none;
      padding: 0.5rem;
      display: block;
    }
    ul.menu.navbar-links {
      display: none;
      flex-direction: column;
      margin-top: 1rem;
      justify-content: flex-start;
      align-items: flex-start;
    }
    #menu-toggle:checked + label + ul.menu {
      display: flex;
    }
  }
  @media (max-width: 640px) {
    .navbar-header {
      display: none;
    }
    .nav-footer {
      display: flex;
      width: 100%;
      height: 60px;
      background-color: var(--color-fuente-suave);
      position: fixed;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
</style>
