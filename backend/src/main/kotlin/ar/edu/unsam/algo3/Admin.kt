package ar.edu.unsam.algo3

object Admin {
    val procesos: MutableList<Proceso> = mutableListOf()

    fun agregarPrceso(proceso: Proceso) {
        procesos.add(proceso)
    }

    fun eliminarProceso(proceso: Proceso) {
        procesos.remove(proceso)
    }

    fun ejecutarProcesos() {
        procesos.forEach { proceso -> proceso.ejecutar() }
    }

    fun limpiarLista() {
        procesos.toList().forEach { eliminarProceso(it) }
    }
}

abstract class Proceso(var emailSender: EmailSender) {
    fun ejecutar(){
        ejecutarComando()
        emailSender.enviarEmail(
            Email("asd@gmail.com.ar",
                "admin@aqp.com.ar",
                "Proceso: ${obtenerNombreProceso()}",
                "Se realizó el proceso: ${obtenerNombreProceso()}"
            )
        )
    }

    abstract fun ejecutarComando()

    abstract fun obtenerNombreProceso(): String
}

class BorrarMensajes(emailSender: EmailSender, private val respositorio: Repositorio<Local>): Proceso(emailSender) {
    override fun ejecutarComando() {
        respositorio.getAll().forEach { it.borrarMensajesAntiguos() }
    }
    override fun obtenerNombreProceso(): String = "Borrar Mensajes antiguos y leídos"
}

class ActualizacionDeIngredientes(emailSender: EmailSender, private val service: ConsumoServicioIngredientes): Proceso(emailSender) {
    override fun ejecutarComando() {
        service.sincronizar()
    }
    override fun obtenerNombreProceso(): String = "Actualización de Ingredientes"
}

class BorrarCuponesVencidos(emailSender: EmailSender, private val repositorio: Repositorio<Usuario>): Proceso(emailSender) {
    override fun ejecutarComando() {
        repositorio.getAll().forEach { it.eliminarCuponesVencidos() }
    }
    override fun obtenerNombreProceso(): String = "Borrar Cupones vencidos sin aplicar"
}

class AgregarLocales(emailSender: EmailSender, private val repositorio: Repositorio<Local>, private val listaLocales: List<Local>): Proceso(emailSender) {
    override fun ejecutarComando() {
        listaLocales.forEach { repositorio.create(it) }
    }
    override fun obtenerNombreProceso(): String = "Agregar Locales"
}
