<script lang="ts">
  import iconoProte from '$lib/assets/icons/proteina.svg'
  import iconoFruta from '$lib/assets/icons/palta.svg'
  import iconoEliminar from '$lib/assets/icons/eliminar.svg'
  import { getGrupoAlimenticioLabel } from '$lib/components/classes/ingrediente-mapper'
  import type { Ingrediente } from '$lib/components/classes/Ingrediente.svelte'

  type Props = {
    ingrediente: Ingrediente
    eliminarIngrediente: (id: string) => void
  }
  let { ingrediente, eliminarIngrediente }: Props = $props()

  function eliminar() {
    if (confirm(`Quiere eliminar ${ingrediente.nombre} de la lista?`)) {
      eliminarIngrediente(ingrediente.id ?? '')
    }
  }
</script>

<div class="fuente-oscuro">{ingrediente.nombre}</div>
<div class="fuente-oscuro">
  {getGrupoAlimenticioLabel(ingrediente.grupoAlimenticio)}
</div>
<div class="centrado">
  <div class="icon">
    <img src={ingrediente.origenAnimal ? iconoProte : iconoFruta} alt="" />
  </div>
</div>
<div class="centrado">
  <div class="icon">
    <button type="button" class="boton-sin-estilo" onclick={eliminar}>
      <img src={iconoEliminar} alt="eliminar" />
    </button>
  </div>
</div>
