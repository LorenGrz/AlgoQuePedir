<script lang="ts">
  type Props = {
    value: boolean
    id: string
    children?: any
  }
  let { id, value = $bindable(), children }: Props = $props()
</script>

<div class="switch-contenedor">
  <div>
    {@render children?.()}
  </div>

  <label class="switch-input">
    <input type="checkbox" {id} bind:checked={value} />
    <span class="slider"></span>
  </label>
</div>

<style>
  .switch-contenedor {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .switch-contenedor div:first-of-type {
    width: calc(100% - 5em);
  }

  .switch-input {
    position: relative;
    background-color: #cccccc;
    width: 3em;
    height: 1.8em;
    cursor: pointer;
    border-radius: 1.8em;
    transition: 0.3s;
  }
  .switch-input input {
    min-height: 0px;
    opacity: 0;
    height: 0;
    width: 0;
  }
  .switch-input .slider {
    position: absolute;
    height: 1.2em;
    width: 1.2em;
    left: 0.3em;
    background-color: #ffffff;
    transition: 0.3s;
    border-radius: 50%;
    top: 0.3em;
  }
  .switch-input input:checked + .slider {
    transform: translateX(1.2em);
  }
  .switch-input:has(input:checked) {
    background-color: var(--color-primario);
  }
</style>
