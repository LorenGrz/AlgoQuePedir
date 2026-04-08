package ar.edu.unsam.algo3
import java.time.LocalDate

interface PedidoObserver {
    fun notificar(pedido: Pedido)
}

class PublicidadObserver(private val emailSender: EmailSender) : PedidoObserver {
    override fun notificar(pedido: Pedido) {
        // Lógica para enviar mail de publicidad con platos del local según preferencias del usuario
        emailSender.enviarEmail(
            Email(
                "ads@algoquepedir.com",
                pedido.cliente.username,
                "Nueva GRAND TASTY DOBLE MEGA DIBU arre",
                "Ya probaste la nueva GRAND TASTY DOBLE MEGA DIBU por tan solo $${pedido.totalAPagarConCupon()}"
            )
        )
    }
}

class AuditarObserver(private val objetivo: ObjetivoAuditoria, private val repositorioPedidos: RepositorioPedidos) :
    PedidoObserver {

    override fun notificar(pedido: Pedido) {
        // no puedo devolver un boolean porque me rompe el polimorfismo de la interfaz con los otros observers
        // los cuales no devuelven nada, se testea con prints de consola
        // si no, se podria guardar un estado "cumpleObjetivos" en cada local con true or false
        if (objetivo.seCumple(pedido.local, repositorioPedidos)) {
            println("✅ El local '${pedido.local.nombre}' cumple con los objetivos.")
        } else {
            println("⚠ El local '${pedido.local.nombre}' *no cumple* con los objetivos.")
        }
    }
}

class VeganoObserver : PedidoObserver {
    override fun notificar(pedido: Pedido) {
        if (pedido.esVegano()) {
            val comportamientoActual = pedido.cliente.tipoDieta
            val comportamientoNuevo = ComportamientoCompuesto()
            comportamientoNuevo.comportamientos = mutableListOf(comportamientoActual, Vegano())
            pedido.cliente.tipoDieta = comportamientoNuevo
        }
    }
}

class MensajePrioridadObserver : PedidoObserver {
    override fun notificar(pedido: Pedido) {
        if (pedido.esCertificado()) {
            pedido.local.enviarMensaje(
                Mensaje(
                    LocalDate.now(),
                    "Alerta de pedido certificado",
                    "¡Este pedido es certificado! Traten de darle prioridad."
                )
            )
        }
    }
}

interface ObjetivoAuditoria {
    fun seCumple(local: Local, repositorioPedidos: RepositorioPedidos): Boolean
}

class ObjetivoMonto(private val objetivoPlatosMonto: Double = 50000.00 ) : ObjetivoAuditoria {
    override fun seCumple(local: Local, repositorioPedidos: RepositorioPedidos): Boolean{
        val pedidos = repositorioPedidos.getOrdenesLocal(local)

        return pedidos.sumOf { it.valorDeVenta() } >= objetivoPlatosMonto
    }
}

class ObjetivoPedidosGrandes(private val objetivoPlatos: Int = 5, private val cantidadPlatosa: Int = 3) : ObjetivoAuditoria {
    override fun seCumple(local: Local, repositorioPedidos: RepositorioPedidos): Boolean {
        val pedidosPlatosos = repositorioPedidos.alcanzaObjetivoPlatos(local, cantidadPlatosa)

        return pedidosPlatosos.size >= objetivoPlatos
    }
}

class ObjetivoVegano(private val objetivoPlatosVeganos: Int = 3) : ObjetivoAuditoria {
    override fun seCumple(local: Local, repositorioPedidos: RepositorioPedidos): Boolean{
        val pedidosVeganos = repositorioPedidos.alcanzaObjetivoVegano(local)

         return pedidosVeganos.size > objetivoPlatosVeganos
    }
}

class ObjetivoCombinado(private val objetivos: List<ObjetivoAuditoria>) : ObjetivoAuditoria {
    override fun seCumple(local: Local, repositorioPedidos: RepositorioPedidos): Boolean =
        objetivos.all { it.seCumple(local, repositorioPedidos) }
}