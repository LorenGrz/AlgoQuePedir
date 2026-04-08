<script lang="ts">
  import '$lib/styles/global.css'
  import Header from '$lib/components/Header.svelte'
  import olla from '$lib/assets/icons/olla.svg'

  let { children } = $props()
</script>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
  <link rel="icon" href={olla} />
  <title>Algo Que Pedir</title>
</svelte:head>

<Header />
<main class="fake-body">
  {@render children?.()}
</main>

<!-- Moví la responsabilidad de separar el header acá, porque en login no tenemos header
 y login no tiene este layout, porque esta en otro grupo! -->

<style>
  .fake-body {
    padding-top: 4rem; /* para evitar que el header lo tape */
    display: flex;
    justify-content: center;
    width: 100%;
  }
  @media (max-width: 640px) {
    .fake-body {
      padding-top: 0rem;
      padding-bottom: 4rem; /* para evitar que el footer lo tape */
    }
  }
</style>
