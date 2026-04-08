package ar.edu.unsam.algo3

import com.fasterxml.jackson.annotation.JsonIgnore
import java.time.LocalDate
import java.util.*

enum class MetodosDePago {
    EFECTIVO,
    QR,
    TARJETA,
    TRANSFERENCIA
}

class Direccion(
    var calle: String,
    var altura: Int,
    var ubicacion: org.uqbar.geodds.Point
)

class Resena (
    val idResena: Int,
    val user: String,
    val comentario: String,
    val puntuacion: Double,
    val fecha: String
)

class Local(
    override var id: Int? = null, val nombre: String, var direccion: Direccion
) : EntidadConId {
    /* Al registrar un local completo credenciales y se le da un ID (.create()) */
    lateinit var credencial: Credencial
    var imgurl: String = ""
    /* Las propiedades privadas son ignoradas por Jackson */
    private val puntuacionCertificada: Int = 4
    val metodosDePago: MutableSet<MetodosDePago> = mutableSetOf()
    val resenas: MutableList<Resena> = mutableListOf()
    var regaliasPorAutor: Double = 0.0

    val tiempoQueTarda: List<Int> = listOf(25, 35)
    val costoPromedio: Int = 1

    /* ¿Por qué esta no? */
    private var porcentajeComision: Double = 0.10
    @JsonIgnore
    val inbox = Inbox()
    @JsonIgnore
    val ventas: MutableList<Pedido> = mutableListOf()

    fun enviarMensaje(mensaje: Mensaje) {
        inbox.mensajes.add(mensaje)
    }

    fun borrarMensaje(mensaje: Mensaje) {
        inbox.mensajes.remove(mensaje)
    }

    fun setPorcentajeComision(nuevoValor: Double) {
        require(nuevoValor in 0.0..1.0) { "El porcentaje debe estar entre 0 y 1" }
        porcentajeComision = nuevoValor
    }
    fun getPorcentajeComision(): Double = porcentajeComision

    fun agregarMetodoDePago(metodo: MetodosDePago) {
        metodosDePago.add(metodo)
    }

    fun agregarResena(resena: Resena) {
        require(!(resena.puntuacion > 5.0 || resena.puntuacion < 1.0)) {
            "El puntaje debe ser un valor entero entre 1 y 5"
        }
        resenas.add(resena)
    }

    fun puntuacion(): Double {
        return if (resenas.isNotEmpty()) {
            String.format(Locale.US,"%.1f", resenas.map { it.puntuacion }.average()).toDouble()
        } else 0.0
    }

    fun aceptaMetodoDePago(metodo: MetodosDePago): Boolean = metodosDePago.any{ it == metodo }

    fun esCertificado(): Boolean = this.puntuacion() >= this.puntuacionCertificada

    fun borrarMensajesAntiguos(){
        inbox.mensajes = inbox.mensajes.filter { !sePuedeEliminarMensaje(it) }.toMutableList()
    }

    private fun sePuedeEliminarMensaje(msj: Mensaje) = mensajeEsAntiguo(msj) && msj.leido

    private fun mensajeEsAntiguo(mensaje: Mensaje) = LocalDate.now().isAfter(mensaje.fechaDeEmision.plusDays(30))
}
