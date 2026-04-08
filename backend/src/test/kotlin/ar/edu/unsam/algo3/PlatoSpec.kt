import ar.edu.unsam.algo3.Direccion
import ar.edu.unsam.algo3.GrupoAlimenticio
import ar.edu.unsam.algo3.Ingrediente
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.Plato
import io.kotest.core.spec.IsolationMode
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe
import org.uqbar.geodds.Point
import java.time.LocalDate

class PlatoSpec : DescribeSpec({
    isolationMode = IsolationMode.InstancePerTest

    val local = Local(nombre = "Lo de José", direccion =  Direccion("Av. Córdoba", 2445, Point(-34.599220725558055, -58.40170853602751)))
    local.setPorcentajeComision(0.3)
    local.regaliasPorAutor = 0.4
    val egg = Ingrediente("Huevo", 50.5, GrupoAlimenticio.PROTEINAS, true)
    val cheese = Ingrediente("Queso", 200.0, GrupoAlimenticio.LACTEOS, true)
    val omelette = Plato("Omelette", local, mutableListOf(egg, cheese))

    describe("Test entrega 0 ") {
        it("plato con 2 ingredientes, se hace la sumatoria del costo") {
            omelette.obtenerCostoProduccion() shouldBe 250.5
        }
    }

    describe("Test entrega 1 ") {
        omelette.valorBase = 300.0
        omelette.platoDeAutor = false
        omelette.lanzamiento = LocalDate.of(2025, 1, 1)
        val today: LocalDate = LocalDate.now()

        it("Obtener precio de lista de un omelette"){
            // prod cost: 250.5 + base: 300 + obtenerExtraPorLocal(): (local: 30%) 90
            omelette.obtenerPrecio() shouldBe 640.5
        }
        it("Obtener precio con descuento por producto nuevo mayor a 20 dias"){
            val before25: LocalDate = today.minusDays(25)
            omelette.lanzamiento = LocalDate.of(before25.year, before25.month, before25.dayOfMonth)
            // 640.5 - (10%)
            val precio = omelette.obtenerPrecio()
            precio - omelette.obtenerDescuentos(precio) shouldBe 576.45
        }
        it("Obtener precio con descuento por producto creado hace 5 dias"){
            val before5: LocalDate = today.minusDays(5)
            omelette.lanzamiento = LocalDate.of(before5.year, before5.month, before5.dayOfMonth)
            // 640.5 - (25%) 160.125
            val precio = omelette.obtenerPrecio()
            precio - omelette.obtenerDescuentos(precio) shouldBe 480.375
        }
        it("Obtener precio con descuento seteado"){
            omelette.porcentajeDescuento = 0.10
            // 640.5 - 64.05
            val precio = omelette.obtenerPrecio()
            precio - omelette.obtenerDescuentos(precio) shouldBe 576.45
        }
        it("Obtener precio de un omelette gourmet"){
            omelette.platoDeAutor = true
            // 640.5 + obtenerExtraPorRegaliasAutor(): 120
            val precio = omelette.obtenerPrecio()
            precio - omelette.obtenerDescuentos(precio) shouldBe 760.5
        }
        it("Indica si el plato es del local"){
            omelette.perteneceAlLocal(local) shouldBe true
        }
    }
})
