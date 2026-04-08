<script lang="ts">
  /* importo estilos */
  import '$lib/styles/contenedor-botones.css'
  import '../login-register.css'
  import { Boton, Fieldset, Ojo, Error } from '$lib'
  import { Login } from '../utils/Login.svelte'
  import { authService } from '../utils/Login-service'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  /* importo íconos */
  import olla from '$lib/assets/icons/olla.svg'

  const login = new Login()
  let passwordVisible = $state(false)
  let confirmPasswordVisible = $state(false)

  onMount(() => {
    localStorage.removeItem('localId')
  })

  async function onSubmit(e: Event): Promise<void> {
    e.preventDefault()
    login.validateRegister()
    if (login.tieneErrores()) return

    try {
      const usuarioRequest = {
        username: login.user,
        password: login.password
      }

      const response = await authService.register(usuarioRequest)
      localStorage.setItem('localId', response.id!!.toString())
      goto(`/lista-pedidos`)
    } catch (e: unknown) {
      const err = e as any

      if (err.code === 'ERR_NETWORK' || !err.response) {
        alert('Error de conexión con el servidor. Intente nuevamente más tarde.')
        return
      }

      const status = err.response?.status ?? 500
      const message = err.response?.data?.message || 'Ocurrió un error inesperado.'
      alert(`Error al Registrarse: ${message} (status: ${status})`)
    }
  }
</script>

<form class="login-form" onsubmit={onSubmit} onreset={() => login.resetErrores()}>
  <div class="titulo-login">
    <div class="circulo-rojo">
      <img class="icono" src={olla} alt="Olla" />
    </div>
    <h2>Algo que pedir</h2>
  </div>

  <section class="contenedor-input-login">
    <fieldset>
      <Fieldset id="usuario-login" label="Usuario">
        <input type="text" id="usuario-login" placeholder="Escribir" bind:value={login.user} />
        <Error error={login.errors.user} />
      </Fieldset>
    </fieldset>

    <fieldset>
      <div class="input-password">
        <Fieldset id="contraseña" label="Password">
          <input
            type={passwordVisible ? 'text' : 'password'}
            placeholder="●●●●●●●"
            id="contraseña"
            bind:value={login.password}
          />
          <Error error={login.errors.password} />
        </Fieldset>
        <Ojo bind:passwordVisible />
      </div>
    </fieldset>

    <fieldset>
      <div class="input-password">
        <Fieldset id="ConfirmarContraseña" label="Confirmar Password">
          <input
            type={confirmPasswordVisible ? 'text' : 'password'}
            id="ConfirmarContraseña"
            placeholder="●●●●●●●"
            bind:value={login.confirmPassword}
          />
          <Error error={login.errors.confirmPassword} />
        </Fieldset>
        <Ojo bind:passwordVisible={confirmPasswordVisible} />
      </div>
    </fieldset>
  </section>

  <div class="contenedor-botones-login">
    <Boton tipo="pildora-login">Registrarse</Boton>
    <div class="registrate">
      ¿Ya tienes una cuenta? <a href="/login">Inicia Sesion</a>
    </div>
  </div>
</form>
