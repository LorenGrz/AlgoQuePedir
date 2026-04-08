package ar.edu.unsam.algo3.loaders

import ar.edu.unsam.algo3.*
import config.EnvironmentVariables 
import ar.edu.unsam.algo3.repository.PedidoRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import org.uqbar.geodds.Point
import org.uqbar.geodds.Polygon
import ar.edu.unsam.algo3.service.LocalService
import ar.edu.unsam.algo3.service.UsuarioService
import org.springframework.core.annotation.Order

@Component
@Order(5)
class PedidoLoader(
    private val pedidoRepository: PedidoRepository,
    private val localService: LocalService,
    private val usuarioService: UsuarioService
) : CommandLineRunner {
    override fun run(vararg args: String?) {
        // Clientes
        val clienteJuan = usuarioService.usuarioById(1)
        val clienteAna = usuarioService.usuarioById(2)
        val clienteLuis = usuarioService.usuarioById(3)
        val clienteGaston = usuarioService.usuarioById(4)
        val clienteFabio = usuarioService.usuarioById(5)
        val clienteMaria = usuarioService.usuarioById(6)

        // Locales
        val localJuan = localService.localPorId(4)
        val local2 = localService.localPorId(1)
        val local3 = localService.localPorId(2)
        val local4 = localService.localPorId(3)

        // Deliverys
        val deliveryCarlos = Delivery(
            nombre = "Carlos Gonzales",
            username = "carlos.g",
            password = "pass",
            zonaDeTrabajo = Polygon(listOf(Point(0.0, 0.0), Point(10.0, 0.0), Point(10.0, 10.0), Point(0.0, 10.0))),
            criterio = DeliveryComun(),
            id = 1,
        )

        val deliveryMaria = Delivery(
            nombre = "María López",
            username = "maria.l",
            password = "maria123",
            zonaDeTrabajo = Polygon(listOf(Point(-10.0, -10.0), Point(10.0, -10.0), Point(10.0, 10.0), Point(-10.0, 10.0))),
            criterio = DeliveryComun(),
            id = 2,
        )

        // Ingredientes
        val carne = Ingrediente("Carne", 5000.0, GrupoAlimenticio.PROTEINAS, true)
        val papas = Ingrediente("Papas", 1500.0, GrupoAlimenticio.CEREALES_Y_TUBERCULOS, false)
        val queso = Ingrediente("Queso", 2000.0, GrupoAlimenticio.LACTEOS, true)
        val pan = Ingrediente("Pan", 800.0, GrupoAlimenticio.CEREALES_Y_TUBERCULOS, false)
        val lechuga = Ingrediente("Lechuga", 500.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false)

        // Platos
        val milanesa = Plato("Milanesa con papas", localJuan, mutableListOf(carne, papas), id = 1).apply {
            descripcion = "Milanesa de ternera con guarnición"
            valorBase = 8500.0
            img = EnvironmentVariables.API_URL + "/img/pasta.jpg"
        }

        val hamburguesa = Plato("Hamburguesa completa", local2, mutableListOf(carne, queso, pan, lechuga), id = 2).apply {
            descripcion = "Hamburguesa con queso y vegetales frescos"
            valorBase = 7200.0
            img = EnvironmentVariables.API_URL + "/img/hamburga.jpg"
        }

        val tortilla = Plato("Tortilla de papas", localJuan, mutableListOf(Ingrediente("Huevo", 1200.0, GrupoAlimenticio.PROTEINAS, true)), id = 3).apply {
            descripcion = "Tortilla española casera"
            valorBase = 6500.0
            img = EnvironmentVariables.API_URL + "/img/pizza.jpg"
        }

        // Pedidos variados
        val pedidosMock = listOf(
            Pedido(clienteJuan, local3).apply {
                agregarPlato(milanesa)
                delivery = deliveryCarlos
                cambiarMedioDePago(MetodosDePago.TARJETA)
            },
            Pedido(clienteLuis, local4).apply {
                agregarPlato(tortilla)
                delivery = deliveryMaria
                cambiarMedioDePago(MetodosDePago.EFECTIVO)
            },
            Pedido(clienteLuis, local2).apply {
                agregarPlato(hamburguesa)
                agregarPlato(milanesa)

                delivery = deliveryCarlos
                cambiarMedioDePago(MetodosDePago.QR)
                cambioDeEstadoDePedido(EstadosDePedido.CANCELADO)
            },
            Pedido(clienteFabio, localJuan).apply {
                agregarPlato(tortilla)
                delivery = deliveryMaria
                cambiarMedioDePago(MetodosDePago.EFECTIVO)
                cambioDeEstadoDePedido(EstadosDePedido.PREPARADO)
                cambioDeEstadoDePedido(EstadosDePedido.ENTREGADO)
            },
            Pedido(clienteLuis, local2).apply {
                agregarPlato(hamburguesa)
                delivery = deliveryCarlos
                cambiarMedioDePago(MetodosDePago.TARJETA)
                cambioDeEstadoDePedido(EstadosDePedido.PREPARADO)
            },
            Pedido(clienteLuis, local2).apply {
                // Agrega 2 hamburguesas
                agregarPlato(hamburguesa)
                agregarPlato(hamburguesa)
                agregarPlato(milanesa)

                delivery = deliveryCarlos
                cambiarMedioDePago(MetodosDePago.TARJETA)
                cambioDeEstadoDePedido(EstadosDePedido.PREPARADO)
                cambioDeEstadoDePedido(EstadosDePedido.ENTREGADO)

            },
            Pedido(clienteJuan, localJuan).apply {
                agregarPlato(milanesa)
                delivery = deliveryCarlos
                cambiarMedioDePago(MetodosDePago.QR)
            },
            Pedido(clienteAna, localJuan).apply {
                agregarPlato(tortilla)
                delivery = deliveryMaria
                cambiarMedioDePago(MetodosDePago.EFECTIVO)
            },
            Pedido(clienteLuis, localJuan).apply {
                agregarPlato(hamburguesa)
                delivery = deliveryCarlos
                cambiarMedioDePago(MetodosDePago.QR)
                cambioDeEstadoDePedido(EstadosDePedido.CANCELADO)
            },
        )

        pedidosMock.forEach { pedidoRepository.create(it) }

        println("✅ ${pedidosMock.size} pedidos mock creados con distintos clientes, locales, platos y estados.")
    }
}