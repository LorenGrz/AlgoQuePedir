<script lang="ts">
  type Props = {
    error?: string
  }

  let { error }: Props = $props()
</script>

<!-- <Error error="El email es inválido" /> -->

{#if !!error}
  <p class="error">
    {error}
  </p>
{/if}

<style>
  .error {
    color: var(--color-error);
    font-size: 0.9rem;
    margin-top: 0.25rem;
  }
</style>
