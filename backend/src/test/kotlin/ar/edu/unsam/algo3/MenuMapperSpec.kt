import ar.edu.unsam.algo3.*
import ar.edu.unsam.algo3.helpers.MenuMapper
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.core.spec.IsolationMode
import io.kotest.matchers.doubles.shouldBeExactly
import io.kotest.matchers.shouldBe
import org.uqbar.geodds.Point

class MenuMapperSpec : DescribeSpec({

    isolationMode = IsolationMode.InstancePerTest
    val mapperMenu = MenuMapper()

    describe("Test de mapeo Local <-> LocalDTO") {
        it("Convierte correctamente una lista de Platos a una lista de PlatoMenuDTO") {
            val localMock = Local(2, "La quesería de Lolo", Direccion("Av. Siemprecheta",
                2002, Point(-34.599220725558055, -58.40170853602751)
            ))
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
            ).apply {
                descripcion = "Fresca ensalada con vegetales de estación"
                valorBase = 2000.0
                img = "/img/ensalada.jpg"
            }

            val platos = listOf(plato1, plato2)
            val dtoList = mapperMenu.toDto(platos)

            dtoList.size shouldBe 2

            dtoList[0].nombre shouldBe "Pasta Cremosa"
            dtoList[0].descripcion shouldBe "Deliciosa pasta con salsa cremosa"
            dtoList[0].precio shouldBeExactly 3300.0
            dtoList[0].img shouldBe "/img/pasta.jpg"
            dtoList[0].id shouldBe 1

            dtoList[1].nombre shouldBe "Ensalada de la Huerta"
            dtoList[1].descripcion shouldBe "Fresca ensalada con vegetales de estación"
            dtoList[1].precio shouldBeExactly 2550.0
            dtoList[1].img shouldBe "/img/ensalada.jpg"
            dtoList[1].id shouldBe 2
        }

    }
})
