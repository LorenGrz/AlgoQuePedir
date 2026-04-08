<script lang="ts">
  import olla from '$lib/assets/icons/olla.svg'
  import '$lib/styles/global.css'
  import './login-register.css'

  let { children } = $props()

  // const login = new Login()

  // async function onSubmit() {
  //   login.validateRegister()
  //   console.log('Tiene errores: ', login.tieneErrores())
  //   if (login.tieneErrores()) return
  //   // ...hacer el POST
  // }
</script>

<svelte:head>
  <link rel="icon" href={olla} />
  <title>Algo Que Pedir</title>
</svelte:head>

<article class="contenedor-login">
  {@render children?.()}
  <!-- Acá renderizo el form que tiene el login o register -->
</article>
