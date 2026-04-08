package ar.edu.unsam.algo3

import java.time.LocalDate
import java.time.Period
import java.time.temporal.ChronoUnit

class Plato (var nombre: String, var local: Local,
             val listaIngredientes: MutableList<Ingrediente>,
             override var id: Int? = null) : EntidadConId {
    var descripcion: String = ""
    var valorBase: Double = 0.0
    var platoDeAutor: Boolean = false
    var img: String = ""
    var lanzamiento: LocalDate = LocalDate.now()
    var porcentajeDescuento: Double = 0.0
    var popular: Boolean = false

    init {
        require(listaIngredientes.isNotEmpty()){
            throw IllegalArgumentException("No se permiten platos vacios")
        }
    }

    fun agregarIngredientes(ingredientes: MutableList<Ingrediente>) = listaIngredientes.addAll(ingredientes)

    fun obtenerCostoProduccion(): Double = listaIngredientes.sumOf{it.costoMercado}

    fun obtenerPrecio(): Double = obtenerCostoProduccion() + valorBase + obtenerExtraPorLocal() + obtenerExtraPorRegaliasAutor()

    fun obtenerDescuentos(precio: Double): Double {
        if (esPlatoNuevo()){
            return (obtenerPorcNuevoPlato()/100) * precio
        } else {
            if (porcentajeDescuento > 0) return porcentajeDescuento * precio
        }
        return 0.0
    }

    fun esVegano(): Boolean = listaIngredientes.none { it.origenAnimal }

    fun esPlatoNuevo(): Boolean = Period.between(lanzamiento, LocalDate.now()).months == 0

    fun perteneceAlLocal(localIngresado: Local) : Boolean = this.local == localIngresado

    private fun obtenerExtraPorLocal(): Double = local.getPorcentajeComision() * valorBase

    private fun obtenerExtraPorRegaliasAutor(): Double = if (!platoDeAutor) 0.0 else  local.regaliasPorAutor * valorBase

    private fun obtenerPorcNuevoPlato(): Double {
        val dias = ChronoUnit.DAYS.between(lanzamiento, LocalDate.now()).toInt()
        return maxOf(0.0, maxOf(10.0, 30.0 - dias ))
    }
}
