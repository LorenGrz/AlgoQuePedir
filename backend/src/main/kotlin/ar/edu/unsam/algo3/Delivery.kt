package ar.edu.unsam.algo3

import ar.edu.unsam.algo3.exceptions.BusinessException
import org.uqbar.geodds.Point
import org.uqbar.geodds.Polygon
import java.time.LocalTime

interface ComportamientoDelivery {
    fun aceptarPedido(pedido: Pedido): Boolean
}

open class Delivery(
    val nombre: String,
    val username: String,
    private val password: String,
    private var zonaDeTrabajo: Polygon,
    var criterio: ComportamientoDelivery,
    override var id: Int? = null
) : EntidadConId{
    var porcentajeCostoDelivery: Double = 0.1

    private fun validarPedido(pedido: Pedido) {
        pedidoPreparado(pedido)
        localDentroZonaTrabajo(pedido.local)
        entregaDentroZonaTrabajo(pedido.cliente)
        pedido.delivery = this      //(agregarlo al final del aceptarPedido de los criterios
    }   //esto asigna el delivery al pedido si cumple
        // con las validaciones

    fun aceptarPedido(pedido: Pedido) : Boolean{
        validarPedido(pedido)                   // explota o sale
        return criterio.aceptarPedido(pedido)       //cumplió las condiciones iniciales
    }                                               // ahora a ver las del criterio

    private fun pedidoPreparado(pedido: Pedido) {   // Exception estado del pedido
        if (pedido.estadoActual != EstadosDePedido.PREPARADO) {
            throw BusinessException("El pedido no se encuentra preparado.")
        }
    }
    private fun localDentroZonaTrabajo(local: Local) {   // Exception local dentro de zona
        if (!estaDentro(local.direccion.ubicacion)) {
            throw BusinessException("El local se encuentra fuera de la zona de trabajo")
        }
    }
    private fun entregaDentroZonaTrabajo(entrega: Usuario) {    // Exception entrega dentro de zona
        if (!estaDentro(entrega.direccion.ubicacion)) {
            throw BusinessException("La entrega se encuentra fuera de la zona de trabajo")
        }
    }
    fun estaDentro(punto: Point): Boolean {
        if (!zonaDeTrabajo.isInside(punto)) { // determina si el punto está dentro del polígono
            throw BusinessException("El punto de entrega esta fuera de la zona de trabajo")
        }
        return true
    }
}

class DeliveryComun : ComportamientoDelivery {
    override fun aceptarPedido(pedido: Pedido): Boolean = true
}

class PorHorario(private var horario: ClosedRange<LocalTime>) : ComportamientoDelivery {

    init {
        require(horario.start < horario.endInclusive) {
            "El horario debe ser de la forma [horaInicio, horaFin]"
        }
    }

    fun cambioHorario(nuevoHorario: ClosedRange<LocalTime>) {
        require(nuevoHorario.start < nuevoHorario.endInclusive) {
            "El horario debe ser de la forma [horaInicio, horaFin]"
        }
        horario = nuevoHorario
    }

    override fun aceptarPedido(pedido: Pedido): Boolean {
        return pedido.horaEntrega in horario
    }
}

class PorMonto : ComportamientoDelivery {
    override fun aceptarPedido(pedido: Pedido): Boolean {
        return pedido.totalAPagar() > 30000.0
    }
}

class PorLocal(private val locales: MutableSet<Local> = mutableSetOf()) : ComportamientoDelivery {
    fun agregarLocal(local: Local) {
        locales.add(local)
    }

    fun quitarLocal(local: Local) {
        locales.remove(local)
    }

    override fun aceptarPedido(pedido: Pedido): Boolean {
        return locales.contains(pedido.local)
    }
}

class PorCertificado : ComportamientoDelivery {
    override fun aceptarPedido(pedido: Pedido): Boolean {
        return pedido.esCertificado()
    }
}

class ComportamientoAND(private val comportamientos: List<ComportamientoDelivery>) : ComportamientoDelivery {
    override fun aceptarPedido(pedido: Pedido): Boolean =
        comportamientos.all { it.aceptarPedido(pedido) }
}

class ComportamientoOR(private val comportamientos: List<ComportamientoDelivery>) : ComportamientoDelivery {
    override fun aceptarPedido(pedido: Pedido): Boolean =
        comportamientos.any { it.aceptarPedido(pedido) }
}
