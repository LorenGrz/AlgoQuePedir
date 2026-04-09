<script lang="ts">
  type Props = {
    tipo: 'primario' | 'secundario' | 'pildora' | 'pildora-login'
    children?: any
    onclick?: () => void
    form?: string
    disabled?: boolean
  }
  const { tipo, children, onclick }: Props = $props()
</script>

<button
  class={`boton-${tipo.toLowerCase()}`}
  type={tipo == 'primario' || tipo == 'pildora' || tipo == 'pildora-login' ? 'submit' : 'reset'}
  {onclick}
>
  {@render children?.()}
</button>

<style>
  .boton-primario,
  .boton-secundario {
    min-height: var(--input-height);
    min-width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radio-elementos);
    cursor: pointer;
    border: 0.1rem solid var(--color-primario);
    color: var(--color-primario);
    padding: 0 1.5rem;
    transition: all 0.25s ease;
    font-family: var(--font-family);
    background-color: transparent;
  }
  .boton-primario {
    background-color: var(--color-primario);
    color: var(--color-fuente-suave);
  }
  .boton-primario:hover,
  .boton-pildora-login:hover {
    background-color: var(--color-primario-hover);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-0.2rem);
  }
  .boton-secundario:hover {
    background-color: var(--color-secundario-hover);
    color: var(--color-primario);
    transform: translateY(-0.2rem);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }
  .boton-primario:active,
  .boton-pildora-login:active {
    background-color: var(--color-primario-active);
  }
  .boton-secundario:active {
    background-color: var(--color-secundario-active);
  }
  .boton-pildora,
  .boton-pildora-login {
    background-color: #ececec;
    color: #555555;
    height: var(--input-height);
    font-weight: 500;
    font-size: 0.9rem;
    padding: 0 1.5rem;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
  }
  .boton-pildora:hover {
    background-color: #e6e6e6;
  }
  .boton-pildora:active {
    background-color: #e0e0e0;
  }
  .boton-pildora-login {
    background-color: var(--color-primario);
    color: var(--color-fuente-suave);
    transition: all 0.25s ease;
  }
  .boton-pildora-login:hover {
    background-color: var(--color-primario-hover);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .boton-pildora-login:active {
    background-color: var(--color-primario-active);
  }
  @media (max-width: 640px) {
    .boton-primario,
    .boton-secundario {
      flex-grow: 1;
      text-align: center;
      margin-top: 1rem;
      padding: 0 1rem;
      min-width: 0;
    }
  }
</style>
