import ar.edu.unsam.algo3.CuponDescuentoSegunDia
import ar.edu.unsam.algo3.CuponDescuentoSegunLocal
import ar.edu.unsam.algo3.CuponPorcentajeExtra
import ar.edu.unsam.algo3.CuponSinDescuentoAdicional
import ar.edu.unsam.algo3.Direccion
import ar.edu.unsam.algo3.GrupoAlimenticio
import ar.edu.unsam.algo3.Ingrediente
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.Plato
import ar.edu.unsam.algo3.exceptions.BusinessException
import io.kotest.core.spec.IsolationMode
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.assertThrows
import org.uqbar.geodds.Point
import java.time.LocalDate

class CuponSpec: DescribeSpec({
    isolationMode = IsolationMode.InstancePerTest

    describe("Test entrega 2: Creacion de clase cupon") {
        val miercoles = LocalDate.of(2025, 4, 23).dayOfWeek
        val cupon = CuponSinDescuentoAdicional(2, 0.3)
        val cuponConDescuentoDia = CuponDescuentoSegunDia(2, 0.3, miercoles)

        val local = Local(nombre = "Lo de José", direccion = Direccion("Av. Córdoba",2445,Point(-34.599220725558055, -58.40170853602751)))
        val egg = Ingrediente("Huevo", 1.0, GrupoAlimenticio.PROTEINAS, true)
        val omelette = Plato("Omelette", local, mutableListOf(egg))
        omelette.lanzamiento = LocalDate.of(2025, 1, 6) //lunes

        val pedidoStub = mockk<_root_ide_package_.ar.edu.unsam.algo3.Pedido>()
        every { pedidoStub.totalAPagar() } returns 1000.0
        every { pedidoStub.platos } returns mutableListOf(omelette)

        val pedidoStublocal = mockk<_root_ide_package_.ar.edu.unsam.algo3.Pedido>()
        every { pedidoStublocal.totalAPagar() } returns 1500.0
        every { pedidoStublocal.esCertificado() } returns false
        every { pedidoStublocal.local } returns local

        it("Cupon vencido") {
            cupon.fechaEmision = LocalDate.now().minusDays(5)
            assertThrows<BusinessException> {
                cupon.obtenerDescuento(pedidoStub)
            }
        }
        it("Cupon es mayor al monto") {
            val cuponDesastre = CuponSinDescuentoAdicional(2, 150.0)
            assertThrows<BusinessException> {
                cuponDesastre.obtenerDescuento(pedidoStub)
            }
        }
        it("El cupom fue usado") {
            cupon.usarCupon()
            assertThrows<BusinessException> {
                cupon.obtenerDescuento(pedidoStub)
            }
        }
        it("Cupon sin descuento especial") {
            cupon.obtenerDescuento(pedidoStub) shouldBe 300.0
        }
        it("Cupon de descuento especial por dia que coincide el dia") {
            cuponConDescuentoDia.hoy = LocalDate.of(2025, 4, 30) //miercoles
            cuponConDescuentoDia.obtenerDescuento(pedidoStub) shouldBe 350.0
        }
        it("Cupon de descuento especial por dia que NO coincide el dia") {
            cuponConDescuentoDia.hoy = LocalDate.of(2025, 4, 28) //lunes
            assertThrows<BusinessException> {
                cuponConDescuentoDia.obtenerDescuento(pedidoStub)
            }
        }
        it("Cupon de descuento especial por dia donde tiene un plato con el mismo dia de lanzamiento") {
            cuponConDescuentoDia.hoy = LocalDate.of(2025, 4, 30) //miercoles
            omelette.lanzamiento = LocalDate.of(2025, 1, 1) //miercoles
            cuponConDescuentoDia.obtenerDescuento(pedidoStub) shouldBe 400.0
        }
        it("Validar si el local esta en la lista") {
            val cuponDescuentoLocal = CuponDescuentoSegunLocal(2, 0.0, listOf())
            assertThrows<BusinessException> {
                cuponDescuentoLocal.obtenerDescuento(pedidoStublocal)
            }
        }
        it("Cupon de descuento especial segun el local") {
            val cuponDescuentoLocal = CuponDescuentoSegunLocal(2, 0.0, listOf(local))
            cuponDescuentoLocal.obtenerDescuento(pedidoStublocal) shouldBe 500.0

            every { pedidoStublocal.esCertificado() } returns true
            cuponDescuentoLocal.obtenerDescuento(pedidoStublocal) shouldBe 1000.0
        }
        it("Cupon con porcentaje extra y tope") {
            val cuponDescuentoExtra = CuponPorcentajeExtra(2, 0.0, 0.2, 100.0)
            cuponDescuentoExtra.obtenerDescuento(pedidoStub) shouldBe 100.0
            val pedidoStub400 = mockk<_root_ide_package_.ar.edu.unsam.algo3.Pedido>()
            every { pedidoStub400.totalAPagar() } returns 400.0
            cuponDescuentoExtra.obtenerDescuento(pedidoStub400) shouldBe 80.0
        }
    }
})
