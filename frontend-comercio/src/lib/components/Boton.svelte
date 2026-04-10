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
    min-width: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radio-elementos);
    cursor: pointer;
    border: 1px solid var(--color-primario);
    color: var(--color-primario);
    padding: 0 1.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    font-family: var(--font-family);
    transition: all 0.2s ease;
    background-color: transparent;
    letter-spacing: 0.01em;
  }
  .boton-primario {
    background-color: var(--color-primario);
    color: #ffffff;
  }
  .boton-primario:hover,
  .boton-pildora-login:hover {
    background-color: var(--color-primario-hover);
    box-shadow: 0 4px 12px rgba(140, 28, 19, 0.25);
    transform: translateY(-1px);
  }
  .boton-secundario:hover {
    background-color: var(--color-secundario-hover);
    color: var(--color-fuente-fuerte);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  .boton-primario:active,
  .boton-pildora-login:active {
    background-color: var(--color-primario-active);
    transform: translateY(0);
    box-shadow: none;
  }
  .boton-secundario:active {
    background-color: var(--color-secundario-active);
    transform: translateY(0);
    box-shadow: none;
  }

  .boton-pildora,
  .boton-pildora-login {
    background-color: var(--color-background);
    color: var(--color-fuente-fuerte);
    height: var(--input-height);
    font-weight: 500;
    font-size: 0.875rem;
    padding: 0 1.25rem;
    border: 1px solid var(--color-borde-suave);
    border-radius: 9999px;
    cursor: pointer;
    font-family: var(--font-family);
    transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .boton-pildora:hover {
    background-color: var(--color-fuente-suave);
    border-color: #d1d5db;
    box-shadow: var(--shadow-sm);
  }
  .boton-pildora:active {
    background-color: var(--color-secundario-active);
  }
  .boton-pildora-login {
    background-color: var(--color-primario);
    color: #ffffff;
    border-color: var(--color-primario);
    transition: all 0.2s ease;
  }
  .boton-pildora-login:hover {
    background-color: var(--color-primario-hover);
    box-shadow: 0 4px 12px rgba(140, 28, 19, 0.25);
  }
  .boton-pildora-login:active {
    background-color: var(--color-primario-active);
  }

  @media (max-width: 640px) {
    .boton-primario,
    .boton-secundario {
      flex-grow: 1;
      text-align: center;
      margin-top: 0.75rem;
      padding: 0 1rem;
      min-width: 0;
    }
  }
</style>
