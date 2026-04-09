<script lang="ts">
  import FormularioIngrediente from '../../editar-ingrediente/componets/FormularioIngrediente.svelte'
  import type { PageData } from './$types'
  import type { Ingrediente } from '$lib/components/classes/Ingrediente.svelte'

  let { data }: { data: PageData } = $props()
  const { ingrediente } = data as { ingrediente: Ingrediente }
</script>

<FormularioIngrediente ingredienteInicial={ingrediente} modo="editar" />
