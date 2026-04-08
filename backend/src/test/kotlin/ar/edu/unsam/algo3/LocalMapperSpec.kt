import ar.edu.unsam.algo3.dto.LocalDTO
import ar.edu.unsam.algo3.dto.TipoPagoDTO
import ar.edu.unsam.algo3.*
import ar.edu.unsam.algo3.helpers.LocalMapper
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.core.spec.IsolationMode
import io.kotest.matchers.booleans.shouldBeFalse
import io.kotest.matchers.booleans.shouldBeTrue
import io.kotest.matchers.doubles.shouldBeExactly
import io.kotest.matchers.shouldBe
import org.uqbar.geodds.Point

class LocalMapperSpec : DescribeSpec({

    isolationMode = IsolationMode.InstancePerTest
    val mapper = LocalMapper()

    describe("Test de mapeo Local <-> LocalDTO") {
        it("convierte correctamente un Local a LocalDTO") {
            val local = Local(
                id = 1,
                nombre = "Bar Cheto",
                direccion = Direccion(
                    "Av. Córdoba",
                    2445,
                    Point(-34.599220725558055, -58.40170853602751)
                )
            )

            local.setPorcentajeComision(0.10)
            local.regaliasPorAutor = 0.15
            local.imgurl = "https://img.png"
            local.agregarMetodoDePago(MetodosDePago.EFECTIVO)
            local.agregarMetodoDePago(MetodosDePago.TRANSFERENCIA)

            val dto = mapper.toDto(local)

            dto.nombre shouldBe "Bar Cheto"
            dto.direccion shouldBe "Av. Córdoba"
            dto.altura shouldBe 2445
            dto.latitud shouldBeExactly -34.599220725558055
            dto.longitud shouldBeExactly -58.40170853602751
            dto.porcentajeApp shouldBeExactly 10.00
            dto.porcentajeComision shouldBeExactly 15.00
            dto.url shouldBe "https://img.png"
            dto.metodos.efectivo.shouldBeTrue()
            dto.metodos.qr.shouldBeFalse()
            dto.metodos.transferencia.shouldBeTrue()
        }

        it("convierte correctamente un LocalDTO a Local") {
            val dto = LocalDTO(
                nombre = "Bar Piola",
                direccion = "Mitre",
                altura = 100,
                latitud = -34.6,
                longitud = -58.4,
                porcentajeApp = 10.0,
                porcentajeComision = 15.0,
                url = "https://img.png",
                metodos = TipoPagoDTO(efectivo = true, qr = true, transferencia = false),
                id = 1
            )

            val local = mapper.fromDto(dto, 14)

            local.id shouldBe 14
            local.nombre shouldBe "Bar Piola"
            local.direccion.calle shouldBe "Mitre"
            local.direccion.altura shouldBe 100
            local.direccion.ubicacion.x shouldBeExactly -34.6
            local.direccion.ubicacion.y shouldBeExactly -58.4
            local.getPorcentajeComision() shouldBeExactly 0.10
            local.regaliasPorAutor shouldBeExactly 0.15
            local.imgurl shouldBe "https://img.png"
            local.metodosDePago.contains(MetodosDePago.EFECTIVO).shouldBeTrue()
            local.metodosDePago.contains(MetodosDePago.QR).shouldBeTrue()
            local.metodosDePago.contains(MetodosDePago.TRANSFERENCIA).shouldBeFalse()
        }
    }
})
