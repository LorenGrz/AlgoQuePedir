package ar.edu.unsam.algo3

import ar.edu.unsam.algo3.exceptions.BusinessException
import java.time.LocalDateTime
import java.time.LocalTime

enum class EstadosDePedido{
    PENDIENTE,
    PREPARADO,
    ENTREGADO,
    CANCELADO
}

class Pedido(
    var cliente : Usuario,
    var local : Local,
    var fechaCreacion: LocalDateTime = LocalDateTime.now(),
    override var id: Int? = null
) : EntidadConId {
    var delivery : Delivery? = null
    private var cupon : Cupon? = null
    val platos : MutableList<Plato> = mutableListOf()
    var estadoActual : EstadosDePedido = EstadosDePedido.PENDIENTE
    var medioDePago : MetodosDePago = MetodosDePago.EFECTIVO
    lateinit var horaEntrega : LocalTime

    fun agregarMedioDePago(metodo: MetodosDePago) { medioDePago = metodo}
    fun agregarHoraDeEntrega(hora : LocalTime) {horaEntrega = hora}
    fun cantidadDeItems() =  platos.size

    fun agregarPlato(plato : Plato){
        validarPlato(plato)
        platos.add(plato)
    }

    private fun validarPlato(plato: Plato){
        if (!cliente.esPlatoAcorde(plato)) {
            throw BusinessException("El plato que se quiere agregar no es acorde")
        }
    }

    fun agregarCupon(nuevoCupon: Cupon?){
        cupon = nuevoCupon
    }

    // Validaciones para el cambio de estado del pedido
    private val transicionesValidas = mapOf(
        EstadosDePedido.PENDIENTE to listOf(EstadosDePedido.PREPARADO, EstadosDePedido.CANCELADO),
        EstadosDePedido.PREPARADO to listOf(EstadosDePedido.ENTREGADO, EstadosDePedido.CANCELADO),
        EstadosDePedido.ENTREGADO to listOf(EstadosDePedido.CANCELADO),
        EstadosDePedido.CANCELADO to emptyList()  // Tampoco se puede reactivar
    )

    fun cambioDeEstadoDePedido(nuevoEstado : EstadosDePedido){
        validoCambioDeEstado(nuevoEstado)
        estadoActual = nuevoEstado
    }

    private fun validoCambioDeEstado(nuevoEstado: EstadosDePedido){
        val estadosPermitidos = transicionesValidas[estadoActual] ?: emptyList()

        if (nuevoEstado !in estadosPermitidos) {
            throw BusinessException("No se puede cambiar el estado de $estadoActual a $nuevoEstado")
        }
    }

    fun totalAPagar(): Double = valorDeVenta() * if (medioDePago != MetodosDePago.EFECTIVO) 1.05 else 1.0
    fun totalAPagarConCupon(): Double = totalAPagar() - (cupon?.obtenerDescuento(this) ?: 0.00 )  // Si es null (no tiene cupon) devuelve 0

    fun valorDeVenta() : Double {
        val subtotal = platos.sumOf { valorDeVentaXPlato(it) } 
        return subtotal + obtenerCostoDelivery(subtotal) 
    }

    fun cambiarMedioDePago(medio : MetodosDePago){
        validarMedioDePago(medio)
        medioDePago = medio
    }

    private fun validarMedioDePago(medio: MetodosDePago){
        if (!local.aceptaMetodoDePago(medio)){
            throw BusinessException("El local no acepta el medio de pago.")
        }
    }

    fun esCertificado() : Boolean {
        return cliente.esUsuarioViejo() && local.esCertificado()
    }

    fun esVegano() : Boolean {
        return platos.all { it.esVegano() }
    }

    private fun valorDeVentaXPlato(plato: Plato) : Double {
        val precio: Double = plato.obtenerPrecio()
       return precio - plato.obtenerDescuentos(precio) 
   }

     fun obtenerCostoDelivery(precio: Double): Double{
        if (delivery == null) throw BusinessException("No hay delivery asignado")
        return precio * (delivery!!.porcentajeCostoDelivery)
    }
}
