import ar.edu.unsam.algo3.*
import io.kotest.core.spec.IsolationMode
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.mockk.mockk
import io.mockk.verify
import org.uqbar.geodds.Point
import org.uqbar.geodds.Polygon
import java.time.LocalDate
import java.time.LocalTime

class PedidoObserverSpec : DescribeSpec({
    isolationMode = IsolationMode.InstancePerTest

    // inits
    val usuario = Usuario(
        nombre = "dante",
        apellido = "tripodi",
        username = "Rubia",
        direccion = Direccion("calle falsa", 123, Point(-34.599220725558055, -58.40170853602751)), imgUrl = ""
    ).apply{
        password = "1234"
        tiempoDeRegistro = LocalDate.of(2024, 3, 29)
        fechaNacimiento = LocalDate.of(2002, 12, 2)
    }

    val local = Local(nombre = "Lo de José", direccion = Direccion("Av. Córdoba", 2445, Point(-34.599220725558055, -58.40170853602751)))

    val repositorioPedidos = RepositorioPedidos(PedidoSearchStrategy())

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
        "fede123", zonaTrabajo, DeliveryComun()
    )

    describe("Tests Audit Observer") {
        val huevoCaroVegano = Ingrediente("Huevo", 3000.0, GrupoAlimenticio.PROTEINAS, false)
        val quesoCaroVegano = Ingrediente("Queso", 4000.0, GrupoAlimenticio.LACTEOS, false)
        val omeletteCaroVegano = Plato("Omelette", local, mutableListOf(huevoCaroVegano, quesoCaroVegano))
        val pedidoCaroVegano = _root_ide_package_.ar.edu.unsam.algo3.Pedido(cliente = usuario, local = local).apply {
            agregarHoraDeEntrega(LocalTime.of(14, 0))
            agregarPlato(omeletteCaroVegano)
            agregarPlato(omeletteCaroVegano)
            agregarPlato(omeletteCaroVegano)
            agregarPlato(omeletteCaroVegano)
            delivery = deliveryPedido
        } // 40 lucas aprox el pedidoCaro
        val pedidoCaroVegano2 = _root_ide_package_.ar.edu.unsam.algo3.Pedido(cliente = usuario, local = local).apply {
            agregarHoraDeEntrega(LocalTime.of(14, 0))
            agregarPlato(omeletteCaroVegano)
            agregarPlato(omeletteCaroVegano)
            agregarPlato(omeletteCaroVegano)
            agregarPlato(omeletteCaroVegano)
            delivery = deliveryPedido
        }
        val pedidoCaroVegano3 = _root_ide_package_.ar.edu.unsam.algo3.Pedido(cliente = usuario, local = local).apply {
            agregarHoraDeEntrega(LocalTime.of(14, 0))
            agregarPlato(omeletteCaroVegano)
            agregarPlato(omeletteCaroVegano)
            agregarPlato(omeletteCaroVegano)
            agregarPlato(omeletteCaroVegano)
            delivery = deliveryPedido
        }
        repositorioPedidos.create(pedidoCaroVegano)
        repositorioPedidos.create(pedidoCaroVegano2)
        repositorioPedidos.create(pedidoCaroVegano3) // Agrego 3 pedidos al repo (objetos distintos)

        it("Seteo y testeo ObjetivoMonto, cumple el objetivos") {
            // Arrange
            val auditObserver = AuditarObserver(ObjetivoMonto(), repositorioPedidos)
            usuario.registrarObserver(auditObserver)

            // Assert ¿cómo testeo acá?
            usuario.confirmarPedido(pedidoCaroVegano)
            // ver println en consola, cumple el objetivo
        }
        it("Seteo y testeo ObjetivoMonto, no cumple el objetivo") {
            // Arrange
            repositorioPedidos.delete(pedidoCaroVegano3)
            val auditObserver = AuditarObserver(ObjetivoMonto(), repositorioPedidos)
            usuario.registrarObserver(auditObserver)

            // Assert
            usuario.confirmarPedido(pedidoCaroVegano)
            // ver println en consola, no cumple el objetivo, le falta guita para llegar
        }
        it("Seteo y testeo ObjetivoPedidosGrandes, cumple el objetivo") {
            // Arrange
            val pedidoCaroVegano4 = _root_ide_package_.ar.edu.unsam.algo3.Pedido(cliente = usuario, local = local).apply {
                agregarHoraDeEntrega(LocalTime.of(14, 0))
                agregarPlato(omeletteCaroVegano)
                agregarPlato(omeletteCaroVegano)
                agregarPlato(omeletteCaroVegano)
                agregarPlato(omeletteCaroVegano)
                delivery = deliveryPedido
            }
            val pedidoCaroVegano5 = _root_ide_package_.ar.edu.unsam.algo3.Pedido(cliente = usuario, local = local).apply {
                agregarHoraDeEntrega(LocalTime.of(14, 0))
                agregarPlato(omeletteCaroVegano)
                agregarPlato(omeletteCaroVegano)
                agregarPlato(omeletteCaroVegano)
                agregarPlato(omeletteCaroVegano)
                delivery = deliveryPedido
            }
            repositorioPedidos.create(pedidoCaroVegano4)
            repositorioPedidos.create(pedidoCaroVegano5)
            val auditObserver = AuditarObserver(ObjetivoPedidosGrandes(), repositorioPedidos)
            usuario.registrarObserver(auditObserver)

            // Assert
            usuario.confirmarPedido(pedidoCaroVegano)
            // ver println en consola, cumple el objetivo
        }
        it("Seteo y testeo ObjetivoPedidosGrandes, no cumple el objetivo") {
            // Arrange
            val pedidoCaroVegano4 = _root_ide_package_.ar.edu.unsam.algo3.Pedido(cliente = usuario, local = local).apply {
                agregarHoraDeEntrega(LocalTime.of(14, 0))
                agregarPlato(omeletteCaroVegano)
                agregarPlato(omeletteCaroVegano)
                agregarPlato(omeletteCaroVegano)
                agregarPlato(omeletteCaroVegano)
                delivery = deliveryPedido
            }
            val pedidoCaroVegano5 = _root_ide_package_.ar.edu.unsam.algo3.Pedido(cliente = usuario, local = local).apply {
                agregarHoraDeEntrega(LocalTime.of(14, 0))
                agregarPlato(omeletteCaroVegano)
                agregarPlato(omeletteCaroVegano)
                agregarPlato(omeletteCaroVegano) //notar que le falta un plato para ser "platoso"
                delivery = deliveryPedido
            }
            repositorioPedidos.create(pedidoCaroVegano4)
            repositorioPedidos.create(pedidoCaroVegano5)

            val auditObserver = AuditarObserver(ObjetivoPedidosGrandes(), repositorioPedidos)
            usuario.registrarObserver(auditObserver)

            // Assert
            usuario.confirmarPedido(pedidoCaroVegano)
            // ver println en consola, no cumple el objetivo, le falta un pedido platoso para llegar
        }
        it("Seteo y testeo ObjetivoVegano, cumple el objetivo") {
            // Arrange
            val pedidoCaroVegano4 = _root_ide_package_.ar.edu.unsam.algo3.Pedido(cliente = usuario, local = local).apply {
                agregarHoraDeEntrega(LocalTime.of(14, 0))
                agregarPlato(omeletteCaroVegano)
                agregarPlato(omeletteCaroVegano)
                agregarPlato(omeletteCaroVegano)
                agregarPlato(omeletteCaroVegano)
                delivery = deliveryPedido
            }
            repositorioPedidos.create(pedidoCaroVegano4) // se agrega el cuarto plato vegano necesario para que cumpla
            val auditObserver = AuditarObserver(ObjetivoVegano(), repositorioPedidos)
            usuario.registrarObserver(auditObserver)

            // Assert
            usuario.confirmarPedido(pedidoCaroVegano)
            // ver println en consola, cumple el objetivo
        }
        it("Seteo y testeo ObjetivoVegano, no cumple el objetivo") {
            // Arrange
            val auditObserver = AuditarObserver(ObjetivoVegano(), repositorioPedidos)
            usuario.registrarObserver(auditObserver)

            // Assert
            usuario.confirmarPedido(pedidoCaroVegano)
            // ver println en consola, no cumple el objetivo, le falta un plato vegano
        }
    }

    describe("Tests Vegano Observer") {
        val huevoCaroVegano = Ingrediente("Huevo", 3000.0, GrupoAlimenticio.PROTEINAS, false)
        val quesoCaroVegano = Ingrediente("Queso", 4000.0, GrupoAlimenticio.LACTEOS, false)
        val omeletteCaroVegano = Plato("Omelette", local, mutableListOf(huevoCaroVegano, quesoCaroVegano))
        val pedidoVegano = _root_ide_package_.ar.edu.unsam.algo3.Pedido(cliente = usuario, local = local).apply {
            agregarHoraDeEntrega(LocalTime.of(14, 0))
            agregarPlato(omeletteCaroVegano)
            delivery = deliveryPedido
        }

        it("Seteo y testeo VeganoObserver,cumple el objetivo") {
            // Assert
            usuario.tipoDieta::class shouldBe Comun::class // Compruebo el tipoDieta original

            // Arrange
            val veganoObserver = VeganoObserver()
            usuario.registrarObserver(veganoObserver)
            usuario.confirmarPedido(pedidoVegano)

            // Assert
            usuario.tipoDieta::class shouldBe ComportamientoCompuesto::class
        }
        it("Seteo y testeo VeganoObserver, no cumple el objetivo") {
            // Assert
            usuario.tipoDieta::class shouldBe Comun::class // Compruebo el tipoDieta original

            // Arrange
            val huevoNoVegano = Ingrediente("Huevo", 3000.0, GrupoAlimenticio.PROTEINAS, true)
            val pedidoNoVegano = _root_ide_package_.ar.edu.unsam.algo3.Pedido(cliente = usuario, local = local).apply {
                agregarHoraDeEntrega(LocalTime.of(14, 0))
                agregarPlato(Plato("Omelette", local, mutableListOf(huevoNoVegano, quesoCaroVegano)))
                delivery = deliveryPedido
            }
            val veganoObserver = VeganoObserver()
            usuario.registrarObserver(veganoObserver)
            usuario.confirmarPedido(pedidoNoVegano)

            // Assert
            usuario.tipoDieta::class shouldNotBe ComportamientoCompuesto::class
        }
    }

    describe("Tests Mensaje Observer") {
        val huevoCaroVegano = Ingrediente("Huevo", 3000.0, GrupoAlimenticio.PROTEINAS, false)
        val quesoCaroVegano = Ingrediente("Queso", 4000.0, GrupoAlimenticio.LACTEOS, false)
        val omeletteCaroVegano = Plato("Omelette", local, mutableListOf(huevoCaroVegano, quesoCaroVegano))
        val pedidoVegano = _root_ide_package_.ar.edu.unsam.algo3.Pedido(cliente = usuario, local = local).apply {
            agregarHoraDeEntrega(LocalTime.of(14, 0))
            agregarPlato(omeletteCaroVegano)
            delivery = deliveryPedido
        }
        val mensajeObserver = MensajePrioridadObserver()
        usuario.registrarObserver(mensajeObserver)
        it("Seteo y testeo MensajeObserver, cumple el objetivo") {
            // Arrange
            val resena = Resena(
                idResena = 1,
                user = "Max Verstappen",
                comentario= "Excelente atención y la comida deliciosa!",
                puntuacion = 5.0,
                fecha = "Hace 2 días"
            )

            local.agregarResena(resena) // hago que el pedido sea certificado
            usuario.confirmarPedido(pedidoVegano)

            // Assert
            local.inbox.mensajes.size shouldNotBe 0
        }
        it("Seteo y testeo MensajeObserver, no cumple el objetivo") {
            // Arrange
            val resena = Resena(
                idResena = 1,
                user = "Max Verstappen",
                comentario= "Excelente atención y la comida deliciosa!",
                puntuacion = 3.0,
                fecha = "Hace 2 días"
            )
            local.agregarResena(resena) // hago que el pedido no sea certificado
            usuario.confirmarPedido(pedidoVegano)

            // Assert
            local.inbox.mensajes.size shouldBe 0
        }
    }

    describe("Tests Publicidad Observer") {
        val mockEmailSender = mockedEmailSender()
        val huevoCaroVegano = Ingrediente("Huevo", 3000.0, GrupoAlimenticio.PROTEINAS, false)
        val quesoCaroVegano = Ingrediente("Queso", 4000.0, GrupoAlimenticio.LACTEOS, false)
        val omeletteCaroVegano = Plato("Omelette", local, mutableListOf(huevoCaroVegano, quesoCaroVegano))
        val pedidoVegano = _root_ide_package_.ar.edu.unsam.algo3.Pedido(cliente = usuario, local = local).apply {
            agregarHoraDeEntrega(LocalTime.of(14, 0))
            agregarMedioDePago(MetodosDePago.EFECTIVO)
            agregarPlato(omeletteCaroVegano)
            delivery = deliveryPedido
        }
        val publicidadObserver = PublicidadObserver(mockEmailSender)
        usuario.registrarObserver(publicidadObserver)

        it("Seteo y testeo PublicidadObserver") {
            usuario.confirmarPedido(pedidoVegano)
            // Assert
            verify(exactly = 1) {
                mockEmailSender.enviarEmail(mockedEmail(pedidoVegano))
            }
        }
    }
})

fun mockedEmailSender() = mockk<EmailSender>(relaxUnitFun = true)

fun mockedEmail(pedido: _root_ide_package_.ar.edu.unsam.algo3.Pedido) = Email(
    "ads@algoquepedir.com",
    pedido.cliente.username,
    "Nueva GRAND TASTY DOBLE MEGA DIBU arre",
    "Ya probaste la nueva GRAND TASTY DOBLE MEGA DIBU por tan solo $${pedido.totalAPagarConCupon()}"
)