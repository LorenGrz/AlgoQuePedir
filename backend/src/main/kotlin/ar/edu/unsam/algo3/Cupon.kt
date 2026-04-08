package ar.edu.unsam.algo3

import ar.edu.unsam.algo3.exceptions.BusinessException
import java.time.DayOfWeek
import java.time.LocalDate

abstract class Cupon(val fechaDuracion: Long = 1, val porcentajeBase: Double = 0.0, override var id: Int? = null) : EntidadConId {
    var fechaEmision: LocalDate = LocalDate.now()
    val culo = fechaEmision.dayOfWeek.equals(DayOfWeek.SATURDAY)

    private var aplicado: Boolean = false

    fun usarCupon(){
        aplicado = true
    }

    fun obtenerDescuento(pedido: Pedido): Double{
        verificarVencimiento()
        verificarSiEstaUsado()
        verificarSiEsMayorAlMonto(pedido)
        verificarCondicion(pedido)
        return totalDescuentos(pedido)
    }

    fun estaVencidoYSinAplicar(): Boolean = !aplicado && cuponEstaVencido()

    abstract fun calcularDescuento(pedido: Pedido): Double

    abstract fun verificarCondicion(pedido: Pedido)

    private fun totalDescuentos(pedido: Pedido): Double = (pedido.totalAPagar() * porcentajeBase) + calcularDescuento(pedido)

    private fun verificarSiEstaUsado() {
        if (aplicado) throw BusinessException("El cupon ya fue utilizado")
    }

    private fun verificarVencimiento() {
        if (cuponEstaVencido()) throw BusinessException("El cupon esta vencido")
    }

    private fun cuponEstaVencido(): Boolean = LocalDate.now().isAfter(fechaEmision.plusDays(fechaDuracion))

    private fun verificarSiEsMayorAlMonto(pedido: Pedido) {
        if (pedido.totalAPagar() < totalDescuentos(pedido)) throw BusinessException("El descuento no puede ser mayor al monto")
    }
}

class CuponSinDescuentoAdicional(fechaDuracion: Long, porcentajeBase: Double):
    Cupon(fechaDuracion, porcentajeBase) {
        override fun calcularDescuento(pedido: Pedido) = 0.0

        override fun verificarCondicion(pedido: Pedido) {}
    }

class CuponDescuentoSegunDia(fechaDuracion: Long, porcentajeBase: Double, val dia: DayOfWeek):
    Cupon(fechaDuracion, porcentajeBase) {
    var hoy: LocalDate = LocalDate.now()

    override fun calcularDescuento(pedido: Pedido): Double {
        if ( pedido.platos.any { it.lanzamiento.dayOfWeek == dia } ) return pedido.totalAPagar() * 0.1
        else return pedido.totalAPagar() * 0.05
    }

    override fun verificarCondicion(pedido: Pedido) {
        if (hoy.dayOfWeek != dia) throw BusinessException("No corresponde al dia del cupon")
    }
}

class CuponDescuentoSegunLocal(fechaDuracion: Long, porcentajeBase: Double, val locales: List<Local>):
    Cupon(fechaDuracion, porcentajeBase){
    override fun calcularDescuento(pedido: Pedido): Double {
        if (pedido.esCertificado()) return 1000.0
        else return 500.0
    }

    override fun verificarCondicion(pedido: Pedido) {
        if (!localEstaEnLista(pedido)) throw BusinessException("El local no esta en la lista")
    }

    private fun localEstaEnLista(pedido: Pedido): Boolean = locales.contains(pedido.local)
}

class CuponPorcentajeExtra(fechaDuracion: Long, porcentajeBase: Double, val porcentaje: Double, val tope: Double):
    Cupon(fechaDuracion, porcentajeBase) {
    override fun calcularDescuento(pedido: Pedido): Double = minOf(porcentaje * pedido.totalAPagar(), tope)

    override fun verificarCondicion(pedido: Pedido) { }
}
