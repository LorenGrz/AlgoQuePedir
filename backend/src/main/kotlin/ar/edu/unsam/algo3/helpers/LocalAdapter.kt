package ar.edu.unsam.algo3.helpers
import ar.edu.unsam.algo3.Credencial
import ar.edu.unsam.algo3.Direccion
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.MetodosDePago
import ar.edu.unsam.algo3.dto.*
import org.springframework.stereotype.Service
import org.uqbar.geodds.Point
import java.util.Locale
//import javax.smartcardio.Card
import kotlin.Int

interface LocalAdapter {
    fun toDto(local: Local): LocalDTO
    fun fromDto(localDto: LocalDTO, id: Int): Local
    fun newLocalFromRegister(registerDTO: LoginLocalDTO): Local
    fun toIdDTO(local: Local): RetornoLocalDTO
    fun toPublicDto(local: Local): PublicLocalDTO
    fun toResumenDto(local: Local): ResumenLocalDTO
    fun toCardDto(local: Local, esCercano: Boolean): CardLocalDTO
}


@Service
class LocalMapper: LocalAdapter {
    override fun toDto(local: Local): LocalDTO = LocalDTO(
        id = local.id ?: -1,
        nombre = local.nombre,
        direccion = local.direccion.calle,
        altura = local.direccion.altura,
        latitud = local.direccion.ubicacion.x,
        longitud = local.direccion.ubicacion.y,
        porcentajeApp = (local.getPorcentajeComision() * 100).let {
            String.format(Locale.US,"%.2f", it).toDouble()
        },
        porcentajeComision = (local.regaliasPorAutor * 100).let {
            String.format(Locale.US,"%.2f", it).toDouble()
        },
        url = local.imgurl,
        metodos = TipoPagoDTO(
            efectivo = MetodosDePago.EFECTIVO in local.metodosDePago,
            qr = MetodosDePago.QR in local.metodosDePago,
            transferencia = MetodosDePago.TRANSFERENCIA in local.metodosDePago
        )
    )

    override fun fromDto(localDto: LocalDTO, id: Int): Local {
        val local = Local(
            id = id,
            nombre = localDto.nombre,
            direccion = Direccion(
                calle = localDto.direccion,
                altura = localDto.altura,
                ubicacion = Point(
                    localDto.latitud,
                    localDto.longitud
                )
            )
        )

        local.setPorcentajeComision((localDto.porcentajeApp / 100).let {
            String.format(Locale.US, "%.4f", it).toDouble()
        })
        local.regaliasPorAutor = (localDto.porcentajeComision / 100).let {
            String.format(Locale.US, "%.4f", it).toDouble()
        }
        local.imgurl = localDto.url

        if (localDto.metodos.efectivo) local.agregarMetodoDePago(MetodosDePago.EFECTIVO)
        if (localDto.metodos.qr) local.agregarMetodoDePago(MetodosDePago.QR)
        if (localDto.metodos.transferencia) local.agregarMetodoDePago(MetodosDePago.TRANSFERENCIA)

        return local
    }

    override fun newLocalFromRegister(registerDTO: LoginLocalDTO): Local {
        val nuevoUsuario = ar.edu.unsam.algo3.Usuario(
            nombre = "",
            apellido = "",
            username = registerDTO.username,
            direccion = Direccion("", 0, Point(0.0, 0.0)),
            imgUrl = ""
        ).apply {
            password = registerDTO.password
        }

        val local = Local(
            id = null,      // se lo doy cuando llame a mapper.create()
            nombre = "",    // esto después se completa en editar perfil-local
            direccion = Direccion("", 0, Point(0.0, 0.0))
        )

        local.usuario = nuevoUsuario
        local.imgurl = ""
        local.regaliasPorAutor = 0.0
        local.setPorcentajeComision(0.10)

        return local
    }

    override fun toIdDTO(local: Local) = RetornoLocalDTO(
        id = local.id!!
    )

    override fun toPublicDto(local: Local): PublicLocalDTO = PublicLocalDTO(
        id = local.id!!,
        nombre = local.nombre,
        puntajeTotal = local.puntuacion(),
        totalVentas = 546,
        resenas = local.resenas,
        img = local.imgurl,
        distanciaKm = 10.00,
        envioGratis = local.esCertificado(),
        metodosDePago = local.metodosDePago
    )

    override fun toResumenDto(local: Local): ResumenLocalDTO = ResumenLocalDTO(
        id = local.id!!,
        nombre = local.nombre,
        puntuacion = local.puntuacion(),
        tiempoMin = local.tiempoQueTarda[0],
        tiempoMax = local.tiempoQueTarda[1],
        pesos = local.costoPromedio,
        imgUrl = local.imgurl,
        direccion = local.direccion
    )

    override fun toCardDto(local: Local, esCercano: Boolean): CardLocalDTO = CardLocalDTO(
        id = local.id!!,
        nombre = local.nombre,
        direccion = local.direccion.calle,
        altura = local.direccion.altura,
        img = local.imgurl,
        cercano = esCercano
    )
}