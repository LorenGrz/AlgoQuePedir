import ar.edu.unsam.algo3.*
import ar.edu.unsam.algo3.exceptions.BusinessException
import io.kotest.core.spec.IsolationMode
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.assertThrows
import java.time.LocalDate
import org.uqbar.geodds.Point
import org.uqbar.geodds.Polygon
import java.time.LocalTime

class PedidoSpec : DescribeSpec({
    isolationMode = IsolationMode.InstancePerTest

    describe("Tests Pedido") {
        /* Instanciación de Usuario y ar.edu.unsam.algo3.Local */
        val clientePedido = Usuario(
            nombre = "dante",
            apellido = "tripodi",
            username = "Rubia",
            direccion = Direccion("calle falsa", 123, Point(-34.599220725558055, -58.40170853602751)), imgUrl = ""
        ).apply {
            password = "1234"
            fechaNacimiento = LocalDate.of(2002, 12, 2)
        }

        val loDeJose =
            Local(
                nombre = "Lo de José",
                direccion = Direccion(
                    "Av. Córdoba",
                    2445,
                    Point(-34.599220725558055, -58.40170853602751)
                )
            )

        /* Instanciación de Platos e Ingredientes */
        val egg = Ingrediente("Huevo", 500.0, GrupoAlimenticio.PROTEINAS, true)
        val cheese = Ingrediente("Queso", 1000.0, GrupoAlimenticio.LACTEOS, true)
        val omelette = Plato("Omelette", loDeJose, mutableListOf(egg, cheese))

        val platosPedido = mutableListOf(
            omelette
        )
        val resena = Resena(
            idResena = 1,
            user = "Max Verstappen",
            comentario= "Excelente atención y la comida deliciosa!",
            puntuacion = 4.0,
            fecha = "Hace 2 días"
        )
        loDeJose.agregarResena(resena)

        /* Instanciación de Delivery */
        val zonaTrabajo = Polygon(
            listOf(
                Point(0.0, 0.0),
                Point(10.0, 0.0),
                Point(10.0, 10.0),
                Point(0.0, 10.0)
            )
        )
        val deliveryPedido = Delivery(
            "fede", "fedeUsername",
            "fede123", zonaTrabajo, DeliveryComun())//, Point(5.0, 5.0),


        /* Instanciación de Pedido */
        val medioDePago: MetodosDePago = MetodosDePago.TRANSFERENCIA
        val pedido = _root_ide_package_.ar.edu.unsam.algo3.Pedido(clientePedido, loDeJose)
            .apply { agregarHoraDeEntrega(LocalTime.of(14, 0)) }
        pedido.agregarPlato(omelette)
        it("El medio de pago que acepta el local es efectivo") {
            assertThrows<BusinessException> {
                pedido.cambiarMedioDePago(medioDePago)
            }
        }
        loDeJose.agregarMetodoDePago(medioDePago)
        pedido.cambiarMedioDePago(medioDePago)

        /* Tests */
        it("Error por falta de delivery en valor de venta") {
            assertThrows<BusinessException> {
                pedido.valorDeVenta()
            }
        }
        it("Obtener que un plato es acorde a la preferencia"){
            clientePedido.esPlatoAcorde(omelette) shouldBe true
        }
        it("Demuestro que es acorde a la preferencia") {
            clientePedido.sonPlatosAcordes(platosPedido) shouldBe true
        }

        it("Demuestro que es certificado") {
            pedido.esCertificado() shouldBe false
        }
        it("Valor de venta de un omelette") {
            pedido.delivery = deliveryPedido
            pedido.valorDeVenta() shouldBe 1155.0
        }
        it("Total a pagar con transferencia") {
            pedido.delivery = deliveryPedido
            pedido.totalAPagar() shouldBe pedido.valorDeVenta() * 1.05
        }
        it("Total a pagar con cupon") {
            val dia = omelette.lanzamiento.plusWeeks(1).dayOfWeek
            val cuponConDescuentoDia = CuponDescuentoSegunDia(2, 0.3, dia)
            clientePedido.agregarCupon(cuponConDescuentoDia)
            pedido.agregarCupon(clientePedido.existeCupon(cuponConDescuentoDia))
            pedido.delivery = deliveryPedido
            pedido.totalAPagarConCupon() shouldBe pedido.valorDeVenta() * 1.05 - cuponConDescuentoDia.obtenerDescuento(pedido)
        }
    }
})