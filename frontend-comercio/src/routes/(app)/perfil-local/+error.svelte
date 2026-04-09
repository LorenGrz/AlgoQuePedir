<script>
  import { page } from '$app/state'
  import ErrorPage from '$lib/components/Error-page.svelte'
  /* El error se inyecta automáticamente dentro de la store $page del módulo '$app/state' */
</script>

<ErrorPage {page}></ErrorPage>
