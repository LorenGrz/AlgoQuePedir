package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.Direccion
import ar.edu.unsam.algo3.dto.LoginUsuarioDTO
import ar.edu.unsam.algo3.dto.RetornoUsuarioDTO
import ar.edu.unsam.algo3.Usuario
import ar.edu.unsam.algo3.exceptions.NotFoundException
import ar.edu.unsam.algo3.exceptions.UnauthorizedException
import ar.edu.unsam.algo3.exceptions.ConflictException
import ar.edu.unsam.algo3.helpers.LocalMapper
import ar.edu.unsam.algo3.helpers.UsuarioMapper
import ar.edu.unsam.algo3.service.AuthService
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.mockito.Mockito.verify
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.uqbar.geodds.Point
import java.time.LocalDate


@WebMvcTest(AuthController::class)
@DisplayName("Dado un AuthController para Usuario")
class AuthControllerUsuarioTest(
    @Autowired val mockMvc: MockMvc
) {
    @MockBean lateinit var authService: AuthService
    @MockBean lateinit var localMapper: LocalMapper
    @MockBean lateinit var usuarioMapper: UsuarioMapper

    // ===== TESTS DE LOGIN USUARIO =====

    @Test
    @DisplayName("cuando un usuario se loguea correctamente, devuelve 200 OK con id y username")
    fun loginUsuarioExitoso() {
        val loginDTO = LoginUsuarioDTO(
            username = "juan.perez",
            password = "123"
        )

        val usuarioMock = Usuario(
            nombre = "Juan",
            apellido = "Perez",
            username = "juan.perez",
            direccion = Direccion("Av. Córdoba", 2445, Point(-34.6, -58.4)),
            id = 1,
            imgUrl = "img.jpg"
        ).apply {
            password = "123"
        }

        val retorno = RetornoUsuarioDTO(id = 1, username = "juan.perez")

        `when`(authService.loguearUsuario(loginDTO)).thenReturn(usuarioMock)
        `when`(usuarioMapper.toRetornoDTO(usuarioMock)).thenReturn(retorno)

        mockMvc.perform(
            post("/auth/usuario/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"username": "juan.perez", "password": "123"}""")
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.username").value("juan.perez"))

        verify(authService).loguearUsuario(loginDTO)
        verify(usuarioMapper).toRetornoDTO(usuarioMock)
    }

    @Test
    @DisplayName("cuando el usuario no existe, devuelve 404 Not Found")
    fun loginUsuarioFallido_usuarioInexistente() {
        val loginDTO = LoginUsuarioDTO(
            username = "usuarioInexistente",
            password = "123"
        )

        `when`(authService.loguearUsuario(loginDTO))
            .thenThrow(NotFoundException("Usuario no registrado."))

        mockMvc.perform(
            post("/auth/usuario/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"username": "usuarioInexistente", "password": "123"}""")
        )
            .andExpect(status().isNotFound)

        verify(authService).loguearUsuario(loginDTO)
    }

    @Test
    @DisplayName("cuando la contraseña del usuario es incorrecta, devuelve 401 Unauthorized")
    fun loginUsuarioFallido_contrasenaIncorrecta() {
        val loginDTO = LoginUsuarioDTO(
            username = "juan.perez",
            password = "passwordIncorrecta"
        )

        `when`(authService.loguearUsuario(loginDTO))
            .thenThrow(UnauthorizedException("Usuario o contraseña incorrecto."))

        mockMvc.perform(
            post("/auth/usuario/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"username": "juan.perez", "password": "passwordIncorrecta"}""")
        )
            .andExpect(status().isUnauthorized)

        verify(authService).loguearUsuario(loginDTO)
    }

    //===== TESTS DE REGISTER USUARIO =====

    @Test
    @DisplayName("cuando un usuario se registra correctamente, devuelve 200 OK con id y username")
    fun registerUsuarioExitoso() {
        val loginDTO = LoginUsuarioDTO(
            username = "nuevoUsuario",
            password = "123"
        )

        val usuarioRegistrado = Usuario(
            nombre = "",
            apellido = "",
            username = "nuevoUsuario",
            direccion = Direccion("", 0, Point(0.0, 0.0)),
            id = 10,
            imgUrl = ""
        ).apply {
            password = "123"
            fechaNacimiento = LocalDate.now().minusYears(18)
            tiempoDeRegistro = LocalDate.now()
        }

        val retorno = RetornoUsuarioDTO(id = 10, username = "nuevoUsuario")

        `when`(authService.registrarUsuario(loginDTO)).thenReturn(usuarioRegistrado)
        `when`(usuarioMapper.toRetornoDTO(usuarioRegistrado)).thenReturn(retorno)

        mockMvc.perform(
            post("/auth/usuario/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"username": "nuevoUsuario", "password": "123"}""")
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(10))
            .andExpect(jsonPath("$.username").value("nuevoUsuario"))

        verify(authService).registrarUsuario(loginDTO)
        verify(usuarioMapper).toRetornoDTO(usuarioRegistrado)
    }

    @Test
    @DisplayName("cuando el usuario ya existe, devuelve 409 Conflict")
    fun registerUsuarioFallido_usuarioYaExiste() {
        val loginDTO = LoginUsuarioDTO(
            username = "juan.perez",
            password = "123"
        )

        `when`(authService.registrarUsuario(loginDTO))
            .thenThrow(ConflictException("Este usuario ya está registrado"))

        mockMvc.perform(
            post("/auth/usuario/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"username": "juan.perez", "password": "123"}""")
        )
            .andExpect(status().isConflict)

        verify(authService).registrarUsuario(loginDTO)
    }
}