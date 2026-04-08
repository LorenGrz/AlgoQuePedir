<script lang="ts">
  import ojo from '$lib/assets/icons/ojo.svg'
  import ojoCerrado from '$lib/assets/icons/ojo-cerrado.svg'
  type Props = {
    passwordVisible: boolean
  }
  let { passwordVisible = $bindable() }: Props = $props()

  function muestroPassword() {
    passwordVisible = !passwordVisible
  }
</script>

<button type="button" class="icono ojo" onclick={muestroPassword}>
  <img src={passwordVisible ? ojoCerrado : ojo} alt="Mostrar/Ocultar" />
</button>

<style>
  .icono {
    height: 2.19rem;
    width: 2.19rem;
  }
  .ojo {
    border: none;
    background: transparent;
    position: absolute;
    right: 0.625rem;
    top: 1.8em;
    cursor: pointer;
  }
</style>
