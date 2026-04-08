package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.*
import ar.edu.unsam.algo3.helpers.LocalMapper
import ar.edu.unsam.algo3.helpers.MenuMapper
import ar.edu.unsam.algo3.dto.PlatoMenuDTO
import ar.edu.unsam.algo3.dto.PublicLocalDTO
import ar.edu.unsam.algo3.exceptions.NotFoundException
import ar.edu.unsam.algo3.service.LocalService
import ar.edu.unsam.algo3.service.MenuService
import org.junit.jupiter.api.Test
import org.mockito.Mockito.*
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.MockMvc
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.uqbar.geodds.Point

@WebMvcTest(PublicLocalController::class)
class PublicLocalControllerTest {
    @Autowired lateinit var mockMvc: MockMvc
    @MockBean lateinit var localService: LocalService
    @MockBean lateinit var localMapper: LocalMapper
    @MockBean lateinit var menuService: MenuService
    @MockBean lateinit var menuMapper: MenuMapper

    val local = Local(id = 4, nombre = "Bar Cheto",
        Direccion("Av. Córdoba", 2445, Point(-34.599220725558055, -58.40170853602751))
    )

    @Test
    fun `devuelve el local mapeado correctamente`() {
        // Arrange
        val dto = PublicLocalDTO(
            id = 4,
            nombre = "Bar Cheto",
            puntajeTotal = 4.5,
            totalVentas= 5,
            resenas = listOf(Resena(1, "Santiago", "Seee", 4.3, "14/11")),
            img= "https://img.png",
            distanciaKm = 10.00,
            envioGratis = local.esCertificado(),
            metodosDePago = local.metodosDePago
        )

        `when`(localService.localPorId(4)).thenReturn(local)
        `when`(localMapper.toPublicDto(local)).thenReturn(dto)

        // Act + Assert
        mockMvc.perform(get("/localpublico/4"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.nombre").value("Bar Cheto"))
    }
    @Test
    fun `retorna 404 si el local no existe`() {
        // Arrange
        `when`(localService.localPorId(999999))
            .thenThrow(NotFoundException("Local no encontrado"))

        // Act + Assert
        mockMvc.perform(get("/localpublico/999999"))
            .andExpect(status().isNotFound)
    }

    @Test
    fun `devuelve el menu mapeado correctamente`() {
        // Arrange
        val plato1 = Plato(
            id = 1,
            nombre = "Pasta Cremosa",
            local = local,
            listaIngredientes = mutableListOf(
                Ingrediente("Pasta", 120.0, GrupoAlimenticio.CEREALES_Y_TUBERCULOS, false),
                Ingrediente("Crema de leche", 180.0, GrupoAlimenticio.LACTEOS, false),
                Ingrediente("Queso rallado", 150.0, GrupoAlimenticio.LACTEOS, false),
                Ingrediente("Manteca", 100.0, GrupoAlimenticio.GRASAS_Y_ACEITES, false)
            )
        )
        val plato2 = Plato(
            id = 2,
            nombre = "Ensalada de la Huerta",
            local = local,
            listaIngredientes = mutableListOf(
                Ingrediente("Lechuga", 60.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false),
                Ingrediente("Tomate", 80.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false),
                Ingrediente("Zanahoria", 50.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false),
                Ingrediente("Aceite de oliva", 120.0, GrupoAlimenticio.GRASAS_Y_ACEITES, false),
                Ingrediente("Vinagre", 40.0, GrupoAlimenticio.GRASAS_Y_ACEITES, false)
            )
        )
        val platos = listOf(plato1, plato2)

        val dto1 = PlatoMenuDTO(id = 1, nombre =  "Pasta Cremosa", precio = 3500.0, descripcion = "", img = "", popular = true)
        val dto2 = PlatoMenuDTO(id = 2, nombre =  "Ensalada de la Huerta", precio = 3500.0, descripcion = "", img = "", popular = true)
        val platosDto = listOf(dto1, dto2)

        `when`(menuService.platosPorLocal(4, null)).thenReturn(platos)
        `when`(menuMapper.toDto(platos)).thenReturn(platosDto)

        // Act + Assert
        mockMvc.perform(get("/localpublico/4/menu"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$[0].nombre").value("Pasta Cremosa"))
            .andExpect(jsonPath("$[1].nombre").value("Ensalada de la Huerta"))
    }

    @Test
    fun `retorna 404 si no hay platos para ese local`() {
        // Arrange
        `when`(menuService.platosPorLocal(99, null))
            .thenThrow(NotFoundException("El local que estás buscando no tiene platos a la venta"))

        // Act + Assert
        mockMvc.perform(get("/localpublico/99/menu"))
            .andExpect(status().isNotFound)
    }
}