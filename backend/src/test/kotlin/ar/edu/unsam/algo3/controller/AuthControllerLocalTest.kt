package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.Direccion
import ar.edu.unsam.algo3.dto.LoginLocalDTO
import ar.edu.unsam.algo3.dto.RetornoLocalDTO
import ar.edu.unsam.algo3.Credencial
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


@WebMvcTest(AuthController::class)
@DisplayName("Dado un AuthController para Local")
class AuthControllerLocalTest(
    @Autowired val mockMvc: MockMvc
) {
    @MockBean lateinit var authService: AuthService
    @MockBean lateinit var localMapper: LocalMapper
    @MockBean lateinit var usuarioMapper: UsuarioMapper

    // ===== TESTS DE LOGIN LOCAL =====

    @Test
    @DisplayName("cuando un local se loguea correctamente, devuelve 200 OK con id")
    fun loginLocalExitoso() {
        val loginDTO = LoginLocalDTO(
            username = "pedroLocal",
            password = "123"
        )

        val localMock = Local(
            id = 5,
            nombre = "La Esquina",
            direccion = Direccion("San Martín", 1234, Point(-34.6, -58.4))
        ).apply {
            usuario = ar.edu.unsam.algo3.Usuario("", "", "pedroLocal", Direccion("", 0, Point(0.0, 0.0)), imgUrl = "").apply { password = "123" }
        }

        val retorno = RetornoLocalDTO(id = 5)

        `when`(authService.loginLocal(loginDTO)).thenReturn(localMock)
        `when`(localMapper.toIdDTO(localMock)).thenReturn(retorno)

        mockMvc.perform(
            post("/auth/local/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"username": "pedroLocal", "password": "123"}""")
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(5))

        verify(authService).loginLocal(loginDTO)
        verify(localMapper).toIdDTO(localMock)
    }

    @Test
    @DisplayName("cuando el local no existe, devuelve 404 Not Found")
    fun loginLocalFallido_localInexistente() {
        val loginDTO = LoginLocalDTO(
            username = "localInexistente",
            password = "123"
        )

        `when`(authService.loginLocal(loginDTO))
            .thenThrow(NotFoundException("Usuario no registrado."))

        mockMvc.perform(
            post("/auth/local/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"username": "localInexistente", "password": "123"}""")
        )
            .andExpect(status().isNotFound)

        verify(authService).loginLocal(loginDTO)
    }

    @Test
    @DisplayName("cuando la contraseña del local es incorrecta, devuelve 401 Unauthorized")
    fun loginLocalFallido_contrasenaIncorrecta() {
        val loginDTO = LoginLocalDTO(
            username = "pedroLocal",
            password = "passwordIncorrecta"
        )

        `when`(authService.loginLocal(loginDTO))
            .thenThrow(UnauthorizedException("Usuario o contraseña incorrecto."))

        mockMvc.perform(
            post("/auth/local/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"username": "pedroLocal", "password": "passwordIncorrecta"}""")
        )
            .andExpect(status().isUnauthorized)

        verify(authService).loginLocal(loginDTO)
    }

    //===== TESTS DE REGISTER LOCAL =====

    @Test
    @DisplayName("cuando un local se registra correctamente, devuelve 200 OK con id")
    fun registerLocalExitoso() {
        val loginDTO = LoginLocalDTO(
            username = "nuevoLocal",
            password = "123"
        )

        val localNuevo = Local(
            id = null,
            nombre = "",
            direccion = Direccion("", 0, Point(0.0, 0.0))
        ).apply {
            usuario = ar.edu.unsam.algo3.Usuario("", "", "nuevoLocal", Direccion("", 0, Point(0.0, 0.0)), imgUrl = "").apply { password = "123" }
        }

        val localRegistrado = Local(
            id = 10,
            nombre = "",
            direccion = Direccion("", 0, Point(0.0, 0.0))
        ).apply {
            usuario = ar.edu.unsam.algo3.Usuario("", "", "nuevoLocal", Direccion("", 0, Point(0.0, 0.0)), imgUrl = "").apply { password = "123" }
        }

        val localIdDTO = RetornoLocalDTO(id = 10)

        `when`(localMapper.newLocalFromRegister(loginDTO)).thenReturn(localNuevo)
        `when`(authService.registerLocal(loginDTO)).thenReturn(localRegistrado)
        `when`(localMapper.toIdDTO(localRegistrado)).thenReturn(localIdDTO)

        mockMvc.perform(
            post("/auth/local/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"username": "nuevoLocal", "password": "123"}""")
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(10))

        verify(authService).registerLocal(loginDTO)
        verify(localMapper).toIdDTO(localRegistrado)
    }

    @Test
    @DisplayName("cuando el local ya existe, devuelve 409 Conflict")
    fun registerLocalFallido_localYaExiste() {
        val loginDTO = LoginLocalDTO(
            username = "pedroLocal",
            password = "123"
        )

        `when`(authService.registerLocal(loginDTO))
            .thenThrow(ConflictException("Este usuario ya está registrado"))

        mockMvc.perform(
            post("/auth/local/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"username": "pedroLocal", "password": "123"}""")
        )
            .andExpect(status().isConflict)

        verify(authService).registerLocal(loginDTO)
    }
}