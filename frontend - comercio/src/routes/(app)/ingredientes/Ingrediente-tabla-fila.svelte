<script lang="ts">
  import iconoProte from '$lib/assets/icons/proteina.svg'
  import iconoFruta from '$lib/assets/icons/palta.svg'
  import iconoEliminar from '$lib/assets/icons/eliminar.svg'
  import iconoEditar from '$lib/assets/icons/editar.svg'
  import iconoVer from '$lib/assets/icons/ojo.svg'
  import { getGrupoAlimenticioLabel } from '$lib/components/classes/ingrediente-mapper'
  import type { Ingrediente } from '$lib/components/classes/Ingrediente.svelte'

  type Props = {
    ingrediente: Ingrediente
    eliminarIngrediente: (ingrediente: Ingrediente) => void
  }
  let { ingrediente, eliminarIngrediente }: Props = $props()

  function eliminar() {
    if (confirm(`Quiere eliminar ${ingrediente.nombre} de la lista?`)) {
      eliminarIngrediente(ingrediente)
    }
  }
</script>

<div class="fuente-oscuro">{ingrediente.nombre}</div>
<div>${ingrediente.costo.toFixed(2)}</div>
<div class="fuente-oscuro ocultar-mobile">
  {getGrupoAlimenticioLabel(ingrediente.grupoAlimenticio)}
</div>
<div class="centrado ocultar-mobile">
  <div class="icon">
    <img src={ingrediente.origenAnimal ? iconoProte : iconoFruta} alt="" />
  </div>
</div>
<div class="centrado">
  <div class="icon mostrar-mobile">
    <img src={iconoVer} alt="Ver" />
  </div>
  <span class="mostrar-mobile">|</span>
  <div class="icon">
    <a href={'/ingredientes/editar-ingrediente/' + ingrediente.id}>
      <img src={iconoEditar} alt="Editar" />
    </a>
  </div>
  |
  <div class="icon">
    <button class="boton-sin-estilo" onclick={eliminar}>
      <img src={iconoEliminar} alt="eliminar" />
    </button>
  </div>
</div>
