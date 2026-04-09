<script lang="ts">
  type Props = {
    tipo?: 'text' | 'number' | 'password'
    elemento?: 'input' | 'textarea' | 'select'
    value?: string | number | boolean
    placeholder?: string
    children?: any
    label: string
    id: string
  }
  let {
    tipo = 'text',
    elemento = 'input',
    label,
    id,
    placeholder = 'Escribir',
    value = $bindable(),
    children
  }: Props = $props()
</script>

<fieldset class={`input-contenedor`}>
  <label for={id}>{label}</label>
  {@render children?.()}
</fieldset>

<style>
  .input-contenedor {
    display: flex;
    flex-direction: column;
    gap: var(--margen-input-label);
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;
    font-size: 0.9rem;
    border: none;
    height: 100%;
  }
  /* .input-contenedor.tiene-error input,
  .input-contenedor.tiene-error textarea,
  .input-contenedor.tiene-error select {
    border-color: var(--color-error);
  } */
</style>
