package ar.edu.unsam.algo3
import ar.edu.unsam.algo3.exceptions.NotFoundException

// Se implementa el patron strategy para determinar el metodo de busqueda según el tipo de repositorio
interface SearchStrategy<T> {
    fun matches(obj: T, value: String): Boolean
}

// Si alguna de las condiciones se cumple, devuelve true, que es recibido por el filter y devuelve el array con las coincidencias
class UsuarioSearchStrategy : SearchStrategy<Usuario> {
    override fun matches(obj: Usuario, value: String): Boolean {
        return obj.nombre.contains(value, ignoreCase = true) ||
                obj.apellido.contains(value, ignoreCase = true) ||
                obj.username.equals(value, ignoreCase = true)
    }
}

class LocalSearchStrategy : SearchStrategy<Local> {
    override fun matches(obj: Local, value: String): Boolean {
        return obj.nombre.contains(value, ignoreCase = true) ||
                obj.direccion.calle.equals(value, ignoreCase = true) ||
                obj.usuario.username.equals(value, ignoreCase = false)  // esto o obj.credencil.username == value (coincidencia exacta)
    }
}

class DeliverySearchStrategy : SearchStrategy<Delivery> {
    override fun matches(obj: Delivery, value: String): Boolean {
        return obj.username.startsWith(value, ignoreCase = true)
    }
}

class IngredienteSearchStrategy : SearchStrategy<Ingrediente> {
    override fun matches(obj: Ingrediente, value: String): Boolean {
        return obj.nombre.equals(value, ignoreCase = true)
    }
}

class PlatoSearchStrategy : SearchStrategy<Plato> {
    override fun matches(obj: Plato, value: String): Boolean {
        return obj.descripcion.contains(value, ignoreCase = true) ||
                obj.nombre.contains(value, ignoreCase = true) ||
                obj.local.nombre.contains(value, ignoreCase = true) ||
                obj.local.direccion.calle.equals(value, ignoreCase = true)
    }
}

class CuponSearchStrategy : SearchStrategy<Cupon> {
    override fun matches(obj: Cupon, value: String): Boolean {
        return obj.porcentajeBase.toString().equals(value, ignoreCase = true)
    }
}

class PedidoSearchStrategy : SearchStrategy<Pedido> {
    override fun matches(obj: Pedido, value: String): Boolean {
        return obj.local.nombre.contains(value, ignoreCase = true) ||
                obj.cliente.nombre.contains(value, ignoreCase = true)
    }
}

// Todas las clases principales van a heredar esta, para que tengan una propiedad id por fuera del constructor propio de la clase
interface EntidadConId {
    var id: Int?
}

open class Repositorio<T : EntidadConId>(
    private val searchStrategy: SearchStrategy<T>,
) {
    private val objetos = mutableSetOf<T>()
    private var proximoId = 1

    fun create(obj: T) {
        if (obj.id != null && existeConId(obj.id!!)) {
            update(obj)
        }
        if (obj.id != null) {   //Esto lo hago para respetar el numero de ID que me trae el service, afecta? podría sacarlo
            objetos.add(obj)    //y dejar que los ids los maneje el repositorio (quedando unicamente ids autoincrementales 1-n)
        } else {
            obj.id = proximoId++
            objetos.add(obj)
        }
    }

    fun delete(obj: T) {
        validarConId(obj)
        val objABorrar = getById(obj.id!!)
        objetos.remove(objABorrar)
    }

    private fun validarConId(obj: T) {
        if (obj.id == null) {
            throw IllegalArgumentException("El objeto no tiene ID asignado.")
        }
    }

    fun update(obj: T) {
        validarConId(obj)
        val objetoViejo = getById(obj.id!!)
        objetos.remove(objetoViejo)
        objetos.add(obj)
    }

    fun getById(id: Int): T {
        return objetos.find { it.id == id } ?: throw NotFoundException("No se encontró el objeto con ID $id.")
    }

    fun getAll(): List<T> = objetos.toList()

    fun search(value: String): List<T> {
        return objetos.filter { searchStrategy.matches(it, value) }
    }

    fun existeConId(id: Int): Boolean = objetos.any { it.id == id } // Para el service, true or false
}

class RepositorioPedidos(searchStrategy: SearchStrategy<Pedido>) : Repositorio<Pedido>(searchStrategy) {
    fun getOrdenesLocal(local: Local): List<Pedido> {
        return getAll().filter { it.local == local }
    }

    fun alcanzaObjetivoPlatos(local: Local, cantidadPlatosa: Int): List<Pedido> {
        val ordenesLocal = getOrdenesLocal(local)
        val ordenesNumerosasLocal = ordenesLocal.filter { it.platos.size > cantidadPlatosa }

        return ordenesNumerosasLocal
    }

    fun alcanzaObjetivoVegano(local: Local): List<Pedido> {
        val ordenesLocal = getOrdenesLocal(local)
        val ordenesVeganasLocal = ordenesLocal.filter { it.esVegano() }

        return ordenesVeganasLocal
    }
}