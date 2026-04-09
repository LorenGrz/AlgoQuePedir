<script lang="ts">
  type Props = {
    id: string,
    label: string,
    value: boolean
  }
  
  let { id, label, value = $bindable() }: Props = $props()
</script>

<fieldset class="checkbox-container">
  <input type="checkbox" {id} bind:checked={value} data-testid={id}/>
  <label for={id}>{label}</label>
</fieldset>

<style>
  .checkbox-container {
    display: flex;
    align-items: center;
    gap: var(--margen-entre-inputs);
    border: none;
  }
  .checkbox-container input {
    width: 1.2rem;
    height: 1.2rem;
  }
  input[type='checkbox'] {
    accent-color: #0d80f2;
  }
</style>
