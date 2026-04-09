package ar.edu.unsam.algo3.loaders
import ar.edu.unsam.algo3.*
import ar.edu.unsam.algo3.repository.LocalRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.uqbar.geodds.Point

@Component
@Order(2)
class LocalDataLoader(private val localRepository: LocalRepository) : CommandLineRunner {
    val resena1 = Resena(
        idResena = 1,
        user = "Max Verstappen",
        comentario= "Excelente atención y la comida deliciosa!",
        puntuacion = 5.0,
        fecha = "2025-11-18"
    )
    val resena2 = Resena(
        idResena = 2,
        user = "Enrico Sangiuliano",
        comentario= "La pizza llegó caliente y con buen sabor. Volvería a pedir.",
        puntuacion = 4.5,
        fecha = "2025-11-01"
    )
    val resena3 = Resena(
        idResena = 3,
        user = "Pablo Foglia",
        comentario= "Excelente la puntualidad de la entrega. La ensalada medio pelo.",
        puntuacion = 3.5,
        fecha = "2025-10-23"
    )
    val resena4 = Resena(
        idResena = 4,
        user = "Luis Majul",
        comentario= "Muy cheto el spaghetti carbonara. El delivery medio lento.",
        puntuacion = 4.0,
        fecha = "2025-10-28"
    )
    override fun run(vararg args: String?) {
        localRepository.create(
            Local(4, "La casa de Juan", Direccion("Av. Córdoba",
            2445, Point(-34.599220725558055, -58.40170853602751))
        ).apply {
            agregarMetodoDePago(MetodosDePago.QR)
            agregarMetodoDePago(MetodosDePago.EFECTIVO)
            agregarMetodoDePago(MetodosDePago.TRANSFERENCIA)
            imgurl = "https://aprende.com/wp-content/uploads/2022/06/distribucion-mesas.jpg"
            usuario = Usuario("Juan", "Perez", "localJuan", Direccion("Av. Córdoba", 2445, Point(-34.599220725558055, -58.40170853602751)), imgUrl = "").apply { password = "123" }
            agregarResena(resena1)
            agregarResena(resena2)
            agregarResena(resena3)
            agregarResena(resena4)
        })

        localRepository.create(
            Local(
                1, "Pizzería Don Mateo",
                Direccion("Av. Corrientes", 1780, Point(-34.603531, -58.382091))
            ).apply {
                agregarMetodoDePago(MetodosDePago.QR)
                agregarMetodoDePago(MetodosDePago.TARJETA)
                imgurl = "https://www.clarin.com/img/2018/05/11/HypqZE7CG_1200x0__1.jpg"
                usuario = Usuario("Mateo", "Gomez", "localMateo", Direccion("Av. Corrientes", 1780, Point(-34.603531, -58.382091)), imgUrl = "").apply { password = "123" }
                agregarResena(resena1)
                agregarResena(resena2)
                agregarResena(resena3)
            }
        )

        localRepository.create(
            Local(
                3, "Sushi Bar Tokio",
                Direccion("Calle Humboldt", 1550, Point(-34.583911, -58.436517))
            ).apply {
                agregarMetodoDePago(MetodosDePago.EFECTIVO)
                imgurl = "https://media-cdn.tripadvisor.com/media/photo-m/1280/28/1f/2f/c2/dante-bar-michelangelo.jpg"
                usuario = Usuario("Tokio", "Owner", "localTokio", Direccion("Calle Humboldt", 1550, Point(-34.583911, -58.436517)), imgUrl = "").apply { password = "123" }
                agregarResena(resena1)
                agregarResena(resena2)
                agregarResena(resena3)
                agregarResena(resena4)
            }
        )

        localRepository.create(
            Local(
                2, "Café del Parque",
                Direccion("Gral. Paz", 3100, Point(-34.580230, -58.425812))
            ).apply {
                agregarMetodoDePago(MetodosDePago.TARJETA)
                imgurl = "https://www.clarin.com/img/2018/05/11/B1ImGVQAz_720x0__1.jpg"
                usuario = Usuario("Cafe", "Owner", "localCafe", Direccion("Gral. Paz", 3100, Point(-34.580230, -58.425812)), imgUrl = "").apply { password = "123" }
                agregarResena(resena1)
                agregarResena(resena1)
            }
        )

        println("✅ Datos del local mockeados en memoria")
    }
}