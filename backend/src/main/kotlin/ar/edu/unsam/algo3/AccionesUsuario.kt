package ar.edu.unsam.algo3
import ar.edu.unsam.algo3.exceptions.BusinessException

//PATRON COMAND INTERFACE BASE
interface AccionUsuario {
    fun ejecutar()
    fun descripcion(): String
}

// PATRON STRATEGY PARA LAS ESTRATEGIAS DE PUNTUACION
interface EstrategiaDePuntuacion {
    fun calcularPuntuacion(local: Local): Resena
    fun nombre(): String
}

class PuntuacionFija(private val resena: Resena) : EstrategiaDePuntuacion {
    init {
        require(resena.puntuacion in 1.0..5.0) { "La puntuación debe estar entre 1 y 5" }
    }

    override fun calcularPuntuacion(local: Local) = resena
    override fun nombre() = "Puntuación fija: ${resena.puntuacion}"
}

class PuntuacionAleatoria : EstrategiaDePuntuacion {
    override fun calcularPuntuacion(local: Local): Resena {
        return Resena(
            idResena = 0,
            user = "Sistema",
            comentario = "Puntuación aleatoria",
            puntuacion = (1..5).random().toDouble(),
            fecha = java.time.LocalDate.now().toString()
        )
    }

    override fun nombre() = "Puntuación aleatoria"
}

class PuntuacionActual : EstrategiaDePuntuacion {
    override fun calcularPuntuacion(local: Local): Resena {
        val promedio = local.puntuacion()
        return Resena(
            idResena = 0,
            user = "Sistema",
            comentario = "Promedio actual",
            puntuacion = if (promedio > 0) promedio else 3.0,
            fecha = java.time.LocalDate.now().toString()
        )
    }
    override fun nombre() = "Puntuación actual del local"
}

// IMPLEMENTACION DE ACCIONES ESPECIFICAS
class AccionEstablecerPedido(private val usuario: Usuario, private val pedido: Pedido) : AccionUsuario {
    override fun ejecutar() {
        usuario.confirmarPedido(pedido)
    }

    override fun descripcion() = "Establecer pedido en '${pedido.local.nombre}'"
}

//SEGUNDA ACCION A IMPLEMENTAR
class AccionPuntuarLocales(private val usuario: Usuario, private val estrategia: EstrategiaDePuntuacion) : AccionUsuario {
    override fun ejecutar() {
        var localesPuntuados = 0

        usuario.localesAPuntuar.keys.forEach { local ->
            if (usuario.puedePuntuar(local)) {
                val puntuacion = estrategia.calcularPuntuacion(local)
                if (usuario.puntuarLocal(local, puntuacion)) {
                    localesPuntuados++
                }
            }
        }

        println("Se puntuaron $localesPuntuados locales con ${estrategia.nombre()}")
    }

    override fun descripcion(): String {
        val localesPendientes = usuario.localesAPuntuar.keys.count { usuario.puedePuntuar(it) }
        return "Puntuar $localesPendientes locales con ${estrategia.nombre()}"
    }
}

// GESTOS DE LA COLA DE ACCIONES
class ColaAcciones {
    private val acciones = mutableListOf<AccionUsuario>()

    fun agregarAccion(accion: AccionUsuario) {
        acciones.add(accion)
        println("✅ Acción agregada: ${accion.descripcion()}")
    }

    fun ejecutarTodas() {
        println("🚀 Ejecutando ${acciones.size} acciones...")

        acciones.forEach { accion ->
            try {
                accion.ejecutar()
                println("✅ ${accion.descripcion()}")
            } catch (e: BusinessException) {
                println("❌ Error en '${accion.descripcion()}': ${e.message}")
            }
        }
        acciones.clear()
        println("🎉 Todas las acciones completadas")
    }
    fun verAccionesPendientes(): List<AccionUsuario> = acciones.toList()

    fun cantidadAcciones() = acciones.size
}