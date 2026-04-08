package ar.edu.unsam.algo3

import ar.edu.unsam.algo3.exceptions.BusinessException
import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import java.time.LocalDate
import java.time.Period
import config.EnvironmentVariables

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"      // campo que va a aparecer en el JSON
)

@JsonSubTypes(
    JsonSubTypes.Type(value = Comun::class, name = "Comun"),
    JsonSubTypes.Type(value = Vegano::class, name = "Vegano"),
    JsonSubTypes.Type(value = Exquisito::class, name = "Exquisito"),
    JsonSubTypes.Type(value = Conservador::class, name = "Conservador"),
    JsonSubTypes.Type(value = Fiel::class, name = "Fiel"),
    JsonSubTypes.Type(value = Impaciente::class, name = "Impaciente"),
    JsonSubTypes.Type(value = Marketinero::class, name = "Marketinero"),
    JsonSubTypes.Type(value = ComportamientoCompuesto::class, name = "ComportamientoCompuesto")
)

interface ComportamientoUsuario {
    fun esPlatoAcorde(plato: Plato, usuario: Usuario): Boolean
}

class Usuario(
    val nombre: String,
    val apellido: String,
    val username: String,
    val direccion: Direccion,
    override var id: Int? = null,
    val imgUrl: String

    ) : EntidadConId {
    // esto lo uso en el front:
    var tipoDieta: ComportamientoUsuario = Comun()
    var distanciaMaximaCercania: Double = EnvironmentVariables.DEFAULT_MAX_DISTANCE // Máxima distancia en km para considerar un local como cercano
    var ingredientesPreferidos: MutableSet<Ingrediente> = mutableSetOf()
    var ingredientesAEvitar: MutableSet<Ingrediente> = mutableSetOf()
    var localesPreferidos: MutableSet<Local> = mutableSetOf()
    var palabrasClave: MutableSet<String> = mutableSetOf()
    // -------------- lo de abajo no lo uso
    var password: String = ""
    var fechaNacimiento: LocalDate = LocalDate.now()
    var tiempoDeRegistro: LocalDate = LocalDate.now()
    val localesAPuntuar: MutableMap<Local, LocalDate> = mutableMapOf()
    val localesYaPuntuados = mutableSetOf<Local>()
    //Lista de acciones que tiene el usuario
    val accionesPendientes = ColaAcciones()
    // --------------
    private var cupones: MutableList<Cupon> = mutableListOf()
    private val observadores = mutableListOf<PedidoObserver>()

    fun validarPassword(passwordIngresada: String): Boolean {
        return this.password == passwordIngresada
    }
    fun registrarObserver(observer: PedidoObserver) {
        observadores.add(observer)
    }

    fun agregarCupon(nuevoCupon: Cupon){
        cupones.add(nuevoCupon)
    }

    fun existeCupon(cupon: Cupon): Cupon {
        if (!cupones.contains(cupon)){
            throw BusinessException("No se encontro el cupon")
        }
        return cupon
    }

    fun eliminarCuponesVencidos() {
        cupones = cupones.filter { !it.estaVencidoYSinAplicar() }.toMutableList()
    }

    val edad: Int
        get() = Period.between(fechaNacimiento, LocalDate.now()).years
    //devuelve días entre dos fechas, .days no devuelve todos los días

    // METODO PARA AGREGAR INGREDIENTES PREFERIDOS
    fun agregarIngredientePreferido(ingrediente: Ingrediente) {
        if (ingredientesAEvitar.contains(ingrediente)) {
            throw BusinessException("No se puede agregar a preferidos un ingrediente a evitar")
        }
        ingredientesPreferidos.add(ingrediente)
    }

    // METODO PARA AGREGAR INGREDIENTES A EVITAR
    fun agregarIngredienteAEvitar(ingrediente: Ingrediente) {
        if (ingredientesPreferidos.contains(ingrediente)) {
            throw BusinessException("No se puede agregar a ingredientes a evitar un ingrediente preferido")
        }
        ingredientesAEvitar.add(ingrediente)
    }

    //METODO PARA VER SI UNA DIRECCION ES CERCANA
    fun esCercano(direccion: Direccion) = this.direccion.ubicacion.distance(direccion.ubicacion) <= distanciaMaximaCercania

    //METODO PARA VALIDAD DISTANCIA
    private fun validarDistancia(pedido: Pedido) {
        if (!this.esCercano(pedido.local.direccion)) {
            throw BusinessException("El local está fuera del rango de distancia permitido")
        }
    }

    //METODO PARA VALIDAR LOS PLATOS ACORDES
    private fun validarPlatosAcordes(pedido: Pedido) {
        if (!this.sonPlatosAcordes(pedido.platos.toMutableList())) {
            throw BusinessException("El pedido contiene platos no acordes al usuario")
        }
    }

    // METODO PARA CONFIRMAR UN PEDIDO Y REGISTRAR UN LOCAL
    fun confirmarPedido(pedido: Pedido) {
        validarDistancia(pedido)
        validarPlatosAcordes(pedido)
        localesAPuntuar[pedido.local] = LocalDate.now()
        //Notifico a los interesados que el pedido fue realizado
        observadores.forEach { it.notificar(pedido) }

    }

    // METODO PARA VERIFICAR SI SE PUEDE PUNTUAR UN LOCAL
    fun puedePuntuar(local: Local): Boolean {
        val fechaRegistro = localesAPuntuar[local] ?: return false
        return fechaRegistro.plusDays(7).isAfter(LocalDate.now()) && !localesYaPuntuados.contains(local)
    }

    //METODO PARA PUNTUAR UN LOCAL
    fun puntuarLocal(local: Local, resena: Resena): Boolean {
        return puedePuntuar(local).also { puedePuntuar ->
            if (puedePuntuar) {
                local.agregarResena(resena)
                localesYaPuntuados.add(local)
            }
        }
    }

    // METODOS PARA VERIFICAR QUE TODOS TENGAN UN PLATO ACORDE
    fun esPlatoAcorde(plato: Plato): Boolean =
        (!tieneIngredienteAEvitar(plato)) && (tipoDieta.esPlatoAcorde(plato, this))

    fun sonPlatosAcordes(platos: MutableList<Plato>): Boolean =
        platos.all{esPlatoAcorde(it)
    }

    private fun tieneIngredienteAEvitar(plato: Plato) =
        plato.listaIngredientes.any { it in ingredientesAEvitar }

    fun esUsuarioViejo() = tiempoDeRegistro.isBefore(LocalDate.now().minusYears(1))
}

class Comun : ComportamientoUsuario {
    override fun esPlatoAcorde(plato: Plato, usuario: Usuario): Boolean {
        return true
    }
}

class Vegano : ComportamientoUsuario {
    override fun esPlatoAcorde(plato: Plato, usuario: Usuario): Boolean {
        return plato.listaIngredientes.none { it.origenAnimal }
    }
}

class Exquisito : ComportamientoUsuario {
    override fun esPlatoAcorde(plato: Plato, usuario: Usuario): Boolean {
        return plato.platoDeAutor
    }
}

class Conservador : ComportamientoUsuario {
    override fun esPlatoAcorde(plato: Plato, usuario: Usuario): Boolean {
        return plato.listaIngredientes.all { it in usuario.ingredientesPreferidos }
    }
}

class Fiel() : ComportamientoUsuario {
    var localesPreferidos: MutableSet<Local> = mutableSetOf()
    override fun esPlatoAcorde(plato: Plato, usuario: Usuario): Boolean {
        return localesPreferidos.contains(plato.local)
    }
}

class Impaciente : ComportamientoUsuario {
    override fun esPlatoAcorde(plato: Plato, usuario: Usuario): Boolean {
        return usuario.esCercano(plato.local.direccion)
    }
}

class Marketinero : ComportamientoUsuario {
    var palabrasClave: MutableSet<String> = mutableSetOf()
    override fun esPlatoAcorde(plato: Plato, usuario: Usuario): Boolean {
        val contienePalabraClave = palabrasClave.any { palabra ->
            plato.descripcion.lowercase().contains(palabra.lowercase())
        }
        return contienePalabraClave
    }
}

//CREO UN COMPORTAMIENTO PARA UN USUARIO PUEDA SER COMPUESTO
class ComportamientoCompuesto: ComportamientoUsuario {
    var comportamientos: List<ComportamientoUsuario> = listOf()
    override fun esPlatoAcorde(plato: Plato, usuario: Usuario): Boolean {
        return comportamientos.all { it.esPlatoAcorde(plato, usuario) }
    }
}
//CREO COMPORTAMIENTO PARA  UN USUARIO SE COMPORTE SEGUN LA EDAD DE TAL MANERA
open class ComportamientoSegunEdad : ComportamientoUsuario {
    open val exquisito: ComportamientoUsuario = Exquisito()
    open val conservador: ComportamientoUsuario = Conservador()

    override fun esPlatoAcorde(plato: Plato, usuario: Usuario): Boolean {
        return if (usuario.edad % 2 == 0) {
            exquisito.esPlatoAcorde(plato, usuario)
        } else {
            conservador.esPlatoAcorde(plato, usuario)
        }
    }
}
