package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.Direccion
import ar.edu.unsam.algo3.GrupoAlimenticio
import ar.edu.unsam.algo3.Ingrediente
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.dto.PlatoMenuDTO
import ar.edu.unsam.algo3.helpers.MenuMapper
import ar.edu.unsam.algo3.Plato
import ar.edu.unsam.algo3.dto.PlatoDTO
import ar.edu.unsam.algo3.dto.PlatoRequest
import ar.edu.unsam.algo3.helpers.PlatoMapper
import ar.edu.unsam.algo3.service.LocalService
import ar.edu.unsam.algo3.service.MenuService
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.mockito.Mockito.`when`
import org.mockito.Mockito.verify
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.uqbar.geodds.Point
import java.time.LocalDate

@WebMvcTest(MenuController::class)
@DisplayName("Dado un MenuController")
class MenuControllerTest(
    @Autowired val mockMvc: MockMvc,
    @Autowired val objectMapper: ObjectMapper
) {

    @MockBean lateinit var menuService: MenuService
    @MockBean lateinit var menuMapper: MenuMapper
    /* Esto es necesario porque si no rompe los test,
    son parte del constructor del controller del menú */
    @MockBean lateinit var localService: LocalService
    @MockBean lateinit var platoMapper: PlatoMapper

    val localMock = Local(2, "La quesería de Lolo", Direccion("Av. Siemprecheta",
        2002, Point(-34.599220725558055, -58.40170853602751)
    )
    )
    val plato1 = Plato(
        id = 1,
        nombre = "Pasta Cremosa",
        local = localMock,
        listaIngredientes = mutableListOf(
            Ingrediente("Pasta", 120.0, GrupoAlimenticio.CEREALES_Y_TUBERCULOS, false),
            Ingrediente("Crema de leche", 180.0, GrupoAlimenticio.LACTEOS, false),
            Ingrediente("Queso rallado", 150.0, GrupoAlimenticio.LACTEOS, false),
            Ingrediente("Manteca", 100.0, GrupoAlimenticio.GRASAS_Y_ACEITES, false)
        )
    ).apply {
        descripcion = "Deliciosa pasta con salsa cremosa"
        valorBase = 2500.0
        img = "/img/pasta.jpg"
    }
    val plato2 = Plato(
        id = 2,
        nombre = "Ensalada de la Huerta",
        local = localMock,
        listaIngredientes = mutableListOf(
            Ingrediente("Lechuga", 60.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false),
            Ingrediente("Tomate", 80.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false),
            Ingrediente("Zanahoria", 50.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false),
            Ingrediente("Aceite de oliva", 120.0, GrupoAlimenticio.GRASAS_Y_ACEITES, false),
            Ingrediente("Vinagre", 40.0, GrupoAlimenticio.GRASAS_Y_ACEITES, false)
        )
    )
    val platos = listOf(plato1, plato2)



    @Test
    @DisplayName("cuando se consulta el menú y hay platos, devuelve 200 OK con la lista de DTOs")
    fun getPlatos_ok() {
        val dto1 = PlatoMenuDTO(id = 1, nombre =  "Pasta Cremosa", precio = 3500.0, descripcion = "", img = "", popular = true)
        val dto2 = PlatoMenuDTO(id = 2, nombre =  "Ensalada de la Huerta", precio = 3500.0, descripcion = "", img = "", popular = true)
        val platosDto = listOf(dto1, dto2)

        `when`(menuService.getPlatos()).thenReturn(platos)
        `when`(menuMapper.toDto(platos)).thenReturn(platosDto)

        mockMvc.perform(get("/menu"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$[0].nombre").value("Pasta Cremosa"))
            .andExpect(jsonPath("$[1].nombre").value("Ensalada de la Huerta"))

        verify(menuService).getPlatos()
        verify(menuMapper).toDto(platos)
    }

    @Test
    @DisplayName("cuando se consulta el menú y no hay platos, devuelve una lista vacia con 200")
    fun getPlatosVacio() {
        `when`(menuService.getPlatos()).thenReturn(emptyList())

        mockMvc.perform(get("/menu"))
            .andExpect(status().isOk)
    }

    @Test
    @DisplayName("Consulta obtener plato por id, devuelve 200 y el plato si lo encuentra")
    fun getPlatoById() {
        val dto1 = PlatoDTO(id = 1, nombre =  "Pasta Cremosa", precioBase = 3500.0, descripcion = "", imgUrl = "", autor = false, ingredientes = listOf(), porcentajeDescuento = 0.0, nuevo = false, lanzamiento = LocalDate.now())

        `when`(menuService.platoPorId(1)).thenReturn(plato1)
        `when`(platoMapper.toDto(plato1)).thenReturn(dto1)

        mockMvc.perform(get("/menu/plato/1"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("nombre").value("Pasta Cremosa"))

        verify(menuService).platoPorId(1)
        verify(platoMapper).toDto(plato1)
    }

    @Test
    @DisplayName("Actualizar plato")
    fun actualizarPlato() {
        val dtoModificado = PlatoDTO(nombre =  "MODIFICADO", precioBase = 3500.0, descripcion = "", imgUrl = "", autor = false, ingredientes = listOf(), porcentajeDescuento = 0.0, nuevo = false, lanzamiento = LocalDate.now(), id = 1)
        val platoActualizado = Plato(
            id = 2,
            nombre = "MODIFICADO",
            local = localMock,
            listaIngredientes = mutableListOf(
                Ingrediente("Lechuga", 60.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false)
            )
        )

        `when`(localService.localPorId(2)).thenReturn(localMock)
        `when`(platoMapper.fromDTO(dtoModificado, 1, localMock)).thenReturn(plato1)

        `when`(menuService.platoPorId(2)).thenReturn(platoActualizado)
        `when`(platoMapper.toDto(platoActualizado)).thenReturn(dtoModificado)

        val req = PlatoRequest(plato = dtoModificado, localId = 2)
        mockMvc.perform(
            put("/menu/plato/{id}", 1)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req))
        )
            .andExpect(status().isOk)
            .andExpect(content().string(""))

        mockMvc.perform(get("/menu/plato/{id}", 2))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.nombre").value("MODIFICADO"))

        verify(localService).localPorId(2)
        verify(platoMapper).fromDTO(dtoModificado, 1, localMock)
        verify(menuService).actualizarPlato(plato1)
    }

    @Test
    @DisplayName("Crear un plato nuevo")
    fun crearPlato() {
        val localId = 2
        val dto = PlatoDTO(nombre =  "nuevo plato", precioBase = 3500.0, descripcion = "", imgUrl = "", autor = false, ingredientes = listOf(), porcentajeDescuento = 0.0, nuevo = false, lanzamiento = LocalDate.now(), id=7)
        val platoNuevo = Plato(
            id = 7,
            nombre = "Nuevo plato",
            local = localMock,
            listaIngredientes = mutableListOf(
                Ingrediente("Lechuga", 60.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false)
            )
        )
        val req = PlatoRequest(plato = dto, localId = localId)

        `when`(localService.localPorId(localId)).thenReturn(localMock)
        `when`(platoMapper.fromDTO(platoDTO = dto, local = localMock)).thenReturn(platoNuevo)

        mockMvc.perform(
            post("/menu/plato")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req))
        )
            .andExpect(status().isOk)
            .andExpect(content().string(""))

        verify(localService).localPorId(localId)
        verify(platoMapper).fromDTO(platoDTO = dto, local = localMock)
        verify(menuService).crearPlato(platoNuevo)
    }
}
