<script lang="ts">
  import '$lib/styles/contenedor-botones.css'
  import { Boton, PlatoMenu } from '$lib'
  
  let { data } = $props()
  const { platos } = data
</script>

<section class="contenedor-gestion-menu">
  <header class="titulo-boton-pildora">
    <h1>Gestión del Menú</h1>
    <a href="/gestion-menu/editar-plato">
      <Boton tipo="pildora">Agregar Nuevo Plato</Boton>
    </a>
  </header>
  <h2>Platos Disponibles</h2>
  <section class="elementos-espaciado contenedor">
    {#each platos as plato}
      <a href={'/gestion-menu/editar-plato/' + plato.id}>
        <PlatoMenu {plato} />
      </a>
    {/each}
  </section>
</section>

<style>
  .contenedor-gestion-menu {
    max-width: var(--ancho-contenedor);
    width: 100%;
    margin: var(--margen-contenedor);
    display: flex;
    flex-direction: column;
    gap: var(--margen-contenedor);
  }
  .contenedor-gestion-menu a {
    text-decoration: none;
    color: black;
  }
</style>
