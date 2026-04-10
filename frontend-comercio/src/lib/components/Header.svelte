<script lang="ts">
  import cocina from '$lib/assets/icons/cocina.svg'
  import menu from '$lib/assets/icons/menu.svg'
  import usuario from '$lib/assets/icons/usuario.svg'
  import carrito from '$lib/assets/icons/carrito-de-compras.svg'
  import helado from '$lib/assets/icons/helado.svg'
  import { onMount } from 'svelte';

  let isDark = false;

  onMount(() => {
    isDark = document.documentElement.classList.contains('dark');
  });

  function toggleDark() {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
</script>

<header>
  <div class="navbar-header">
    <div class="navbar-logo-y-titulo">
      <a href="/"><img src={cocina} alt="" /></a>
      <h1 class="navbar-titulo-logo">Algo Que Pedir</h1>
    </div>
    <div class="navbar-menus-tablet-desktop navbar-links">
      <button class="theme-toggle" on:click={toggleDark} aria-label="Toggle Dark Mode">
        {#if isDark}
          <!-- Sol minimalista -->
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        {:else}
          <!-- Luna minimalista -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        {/if}
      </button>
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
      <div class="navbar-user-icon">
        <img src={usuario} alt="Usuario" />
      </div>
    </div>
  </div>
  <nav class="nav-footer">
    <a href="/lista-pedidos"><img src={cocina} alt="Pedidos" /></a>
    <a href="/gestion-menu"><img src={carrito} alt="Menú" /></a>
    <button class="theme-toggle mobile" on:click={toggleDark} aria-label="Toggle Dark Mode">
      {#if isDark}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      {/if}
    </button>
    <a href="/ingredientes"><img src={helado} alt="Ingredientes" /></a>
    <a href="/perfil-local"><img src={usuario} alt="Cuenta" /></a>
  </nav>
</header>

<style>
  /* ——— Theme toggle ——— */
  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    background: var(--color-background);
    border: 1px solid var(--color-borde-suave);
    border-radius: 50%;
    cursor: pointer;
    color: var(--color-fuente-fuerte);
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
    flex-shrink: 0;
  }
  .theme-toggle:hover {
    transform: scale(1.08);
    border-color: var(--color-fuente-medio);
  }
  .theme-toggle.mobile {
    background: none;
    border: none;
    width: 2rem;
    height: 2rem;
    color: var(--color-fuente-fuerte);
  }

  /* ——— Navbar header ——— */
  .navbar-header {
    top: 0;
    left: 0;
    position: fixed;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1.5rem;
    background-color: var(--color-fuente-suave);
    border-bottom: 1px solid var(--color-borde-suave);
    z-index: 100;
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }

  .navbar-links a {
    text-decoration: none;
    color: var(--color-fuente-fuerte);
    transition: color 0.2s;
  }

  a:hover {
    color: var(--color-primario);
  }

  .navbar-titulo-logo {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--color-primario);
    letter-spacing: -0.02em;
  }

  header img {
    width: 2rem;
    height: 2rem;
    border-radius: 0;
    cursor: pointer;
  }

  .navbar-logo-y-titulo {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .navbar-links {
    align-items: center;
    font-weight: 500;
    font-size: 0.9rem;
    list-style: none;
    display: flex;
    gap: 1.25rem;
  }

  .navbar-menus-tablet-desktop {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .navbar-user-icon img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    opacity: 0.75;
  }

  .nav-footer {
    display: none;
  }

  #menu-toggle {
    display: none;
  }

  .menu-icon {
    display: none;
  }

  @media (max-width: 1024px) {
    .menu-icon {
      display: block;
    }

    ul.menu {
      list-style: none;
      margin: 0;
      padding: 0.5rem;
      background: var(--color-fuente-suave);
      border: 1px solid var(--color-borde-suave);
      border-radius: 0.75rem;
      position: absolute;
      right: 1rem;
      top: 3.5rem;
      display: none;
      flex-direction: column;
      z-index: 200;
      box-shadow: var(--shadow-lg);
      min-width: 10rem;
    }

    ul.menu li a {
      text-decoration: none;
      padding: 0.6rem 1rem;
      display: block;
      border-radius: 0.5rem;
      transition: background 0.15s;
    }

    ul.menu li a:hover {
      background: var(--color-background);
    }

    ul.menu.navbar-links {
      display: none;
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
      height: 56px;
      background-color: var(--color-fuente-suave);
      border-top: 1px solid var(--color-borde-suave);
      position: fixed;
      bottom: 0;
      left: 0;
      justify-content: space-around;
      align-items: center;
      transition: background-color 0.3s ease, border-color 0.3s ease;
      z-index: 100;
    }
  }
</style>
