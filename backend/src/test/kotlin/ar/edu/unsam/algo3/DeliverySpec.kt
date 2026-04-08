import ar.edu.unsam.algo3.*
import ar.edu.unsam.algo3.exceptions.BusinessException
import io.kotest.assertions.throwables.shouldNotThrowAny
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.core.spec.IsolationMode
import io.kotest.matchers.doubles.shouldBeLessThan
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.assertThrows
import org.uqbar.geodds.Point
import org.uqbar.geodds.Polygon
import java.time.LocalTime
import java.time.LocalDate

class DeliverySpec : DescribeSpec({
    isolationMode = IsolationMode.InstancePerTest

    //DELIVERY
    val zonaTrabajo = Polygon(
        listOf(
            Point(0.0, 0.0),
            Point(10.0, 0.0),
            Point(10.0, 10.0),
            Point(0.0, 10.0)
        )
    )
    var puntoEntrega = Point(5.0, 5.0)
    val delivery = Delivery(
        "Fede", "fedeUsername",
        "fede123", zonaTrabajo, DeliveryComun()
    )
    //LOCAL
    var direccionLocal = Direccion(
        "Sarmiento", 1200, Point(5.0, 5.0)
    )
    val local = Local(
        nombre = "SarmientoPanchos", direccion = direccionLocal
    )

    //USUARIO
    val fechaDeNacimiento = LocalDate.of(2003, 11, 17)
    var direccionUser = Direccion(
        "Belgrano", 120, Point(8.0, 8.0)
    )
    val tiempoRegistro: LocalDate = LocalDate.of(2024, 3, 28)
    var usuario = Usuario(
        "Santiago", "Rodriguez", "UserSanti",
        direccionUser, imgUrl = ""
    ). apply {
        password = "santi123"
        fechaNacimiento = fechaDeNacimiento
        tiempoDeRegistro = tiempoRegistro
    }

    //PEDIDO
    var pedido = Pedido(
        usuario, local,
    ).apply {
        agregarHoraDeEntrega(LocalTime.of(14,0))
        agregarMedioDePago(MetodosDePago.EFECTIVO)
    }
    pedido.cambioDeEstadoDePedido(EstadosDePedido.PREPARADO)
    pedido.delivery = delivery

    describe("Creo delivery y pruebo funciones") {
        it("dentro zona de trabajo") {
            delivery.estaDentro(puntoEntrega) shouldBe true
        }

        it("fuera de zona de trabajo") {
            puntoEntrega = Point(11.0, 5.0)

            assertThrows<BusinessException> {
                delivery.estaDentro(puntoEntrega)
            }
        }
    }

    describe("Evaluo pedidos") {
        it("Acepto Pedido que cumpla las 3 condiciones") {
            shouldNotThrowAny { delivery.aceptarPedido(pedido) }
        }

        it("No acepto pedido por pedido NO preparado") {
            pedido.cambioDeEstadoDePedido(_root_ide_package_.ar.edu.unsam.algo3.EstadosDePedido.CANCELADO)
            assertThrows<BusinessException> {
                delivery.aceptarPedido(pedido)
            }
        }

        it("No acepto pedido por local fuera de zona de trabajo") {
            direccionLocal = Direccion("SarmientoPanchos", 5500, Point(5.0, 13.0))
            local.direccion = direccionLocal

            assertThrows<BusinessException> {
                delivery.aceptarPedido(pedido)
            }
        }

        it("No acepto pedido por entrega fuera de zona de trabajo") {
            direccionUser = Direccion(
                "Belgrano", 3200, Point(20.0, 4.0)
            )
            usuario = Usuario(
                "Agustín", "Menéndez", "AgusUser",
                direccionUser, imgUrl = ""
            ).apply{
                password ="Agus789"
                fechaNacimiento = fechaDeNacimiento
            }
            pedido = _root_ide_package_.ar.edu.unsam.algo3.Pedido(usuario, local)
                .apply { agregarHoraDeEntrega(LocalTime.of(14, 0)) }

            assertThrows<BusinessException> {
                delivery.aceptarPedido(pedido)
            }
        }
    }

    describe("Evaluo Delivery con horario") {
        //Cambio el criterio del delivery instanciado y le paso la franja horaria en la que trabaja
        // 10 30 18 00
        delivery.criterio = PorHorario(LocalTime.of(10, 30)..LocalTime.of(18, 0))
        direccionUser = Direccion(
            "Belgrano", 3200, Point(3.0, 4.0)
        )
        usuario = Usuario(
            "Agustín", "Menéndez", "AgusUser",
            direccionUser, imgUrl = ""
        ).apply {
            password = "Agus789"
            fechaNacimiento
        }
        direccionLocal = Direccion("SarmientoPanchos", 5500, Point(5.0, 6.0))
        local.direccion = direccionLocal
        pedido = _root_ide_package_.ar.edu.unsam.algo3.Pedido(usuario, local,)
            .apply { agregarHoraDeEntrega(LocalTime.of(14, 0)) }
        pedido.estadoActual = _root_ide_package_.ar.edu.unsam.algo3.EstadosDePedido.PREPARADO

        it("Delivery ACEPTA pedido con horario") {
            delivery.aceptarPedido(pedido) shouldBe true
        }

        it("Ingreso horarios desordenados") {
            //Aca tengo que avisarle a Kotlin que el criterio es de tipo PorHorario para que me deje usar el metodo cambioHorario()
            //De otra manera deduce que es la interfaz ComportamientoDelivery que no tiene ese metodo y se rompe
            //A esto se lo conoce como "safe cast"

            val criterioHorario = delivery.criterio as PorHorario

            assertThrows<IllegalArgumentException> {
                criterioHorario.cambioHorario(LocalTime.of(18, 30)..LocalTime.of(10, 0))
            }
        }

        it("Delivery NO ACEPTA pedido con horario fuera de lo estipulado") {
            //Mismo escenario
            val criterioHorario = delivery.criterio as PorHorario
            criterioHorario.cambioHorario(LocalTime.of(13, 30)..LocalTime.of(16, 0))
            pedido.horaEntrega = LocalTime.of(18, 0)

            delivery.aceptarPedido(pedido) shouldBe false
        }
    }

    describe("Evaluo Delivery con monto") {
        delivery.criterio = PorMonto()
        val fideos = Ingrediente("Fideos", 1.00, GrupoAlimenticio.CEREALES_Y_TUBERCULOS, false)
        val plato = Plato("Fideos", local, mutableListOf(fideos))
        //Hago que el valor total del pedido valga más de 30.000 para que sea aceptado
        //Le sumo mas de 6 lucas porque con los descuentos, el valorTotal baja a 31k aprox.
        plato.valorBase = 36000.00

        it("Delivery acepta pedido mayor a 30.000") {
            pedido.agregarPlato(plato)
            println(pedido.totalAPagar())
            delivery.aceptarPedido(pedido) shouldBe true
        }

        it("Delivery NO ACEPTA pedido menos a 30.000") {
            //Le bajo el costo al pedido por debajo de los 30.000 para que throwee exception
            plato.valorBase = 34000.00
            pedido.agregarPlato(plato)

            delivery.aceptarPedido(pedido) shouldBe false
        }
    }

    describe("Evaluo Delivery con determinados locales") {
        delivery.criterio = PorLocal()

        it("Agrego/saco local a lista y acepta/rechazo pedido") {
            //Mismo escenario que en el delivery PorHorario
            val criterioLocal = delivery.criterio as PorLocal
            criterioLocal.agregarLocal(local)

            delivery.aceptarPedido(pedido) shouldBe true

            criterioLocal.quitarLocal(local)

            delivery.aceptarPedido(pedido) shouldBe false
        }
    }

    describe("Evaluo Delivery certificado") {
        delivery.criterio = PorCertificado()

        it("Acepto/rechazo pedido certificado") {
            val resena = Resena(
                idResena = 1,
                user = "Max Verstappen",
                comentario= "Excelente atención y la comida deliciosa!",
                puntuacion = 5.0,
                fecha = "Hace 2 días"
            )
            val resena2 = Resena(
                idResena = 1,
                user = "Max Verstappen",
                comentario= "Excelente atención y la comida deliciosa!",
                puntuacion = 4.0,
                fecha = "Hace 2 días"
            )
            val resena3 = Resena(
                idResena = 1,
                user = "Max Verstappen",
                comentario= "Excelente atención y la comida deliciosa!",
                puntuacion = 2.5,
                fecha = "Hace 2 días"
            )
            local.agregarResena(resena)
            local.agregarResena(resena2)
            local.puntuacion() shouldBe 4.5


            pedido.esCertificado() shouldBe true

            delivery.aceptarPedido(pedido) shouldBe true

            local.agregarResena(resena3) // bajo la puntuacion a 3.3
            local.puntuacion() shouldBeLessThan 4.0

            pedido.esCertificado() shouldBe false

            delivery.aceptarPedido(pedido) shouldBe false
        }
    }

    describe("Evaluo comportamiento AND"){
        //PLATO
        val fideos = Ingrediente("Fideos", 1.00, GrupoAlimenticio.CEREALES_Y_TUBERCULOS, false)
        val plato = Plato("Fideos", local, mutableListOf(fideos))
        plato.valorBase = 36000.00

        //DELIVERY
        val comportamientos = mutableListOf<ComportamientoDelivery>()
        comportamientos.add(PorMonto())
        comportamientos.add(PorHorario(LocalTime.of(9, 0)..LocalTime.of(18, 0)))

        val deliveryAND = Delivery("Fede", "fedeUsername",
            "fede123", zonaTrabajo, ComportamientoAND(comportamientos))

        //LOCAL
        var direccionLocal = Direccion(
            "Sarmiento", 1200, Point(5.0, 5.0)
        )
        val local = Local(
            nombre = "SarmientoPanchos", direccion= direccionLocal
        )

        //USUARIO
        val fechaDeNacimiento = LocalDate.of(2003, 11, 17)
        var direccionUser = Direccion(
            "Belgrano", 120, Point(8.0, 8.0)
        )
        val tiempoRegistro: LocalDate = LocalDate.of(2024, 3, 28)
        var usuario = Usuario(
            "Santiago", "Rodriguez", "UserSanti",
            direccionUser,imgUrl = ""
        ).apply{
            password = "santi123"
            fechaNacimiento = fechaDeNacimiento
            tiempoDeRegistro = tiempoRegistro
        }

        //PEDIDO
        val pedidoAND = _root_ide_package_.ar.edu.unsam.algo3.Pedido(usuario, local)
            .apply {
                agregarHoraDeEntrega(LocalTime.of(14, 0))
                agregarMedioDePago(MetodosDePago.EFECTIVO)
            }
        pedidoAND.cambioDeEstadoDePedido(_root_ide_package_.ar.edu.unsam.algo3.EstadosDePedido.PREPARADO)
        pedidoAND.delivery = deliveryAND
        pedidoAND.agregarPlato(plato)

        it("creo Delivery y acepto pedido"){
            deliveryAND.aceptarPedido(pedidoAND) shouldBe true
        }

        it("NO acepto pedido AND"){
            val comportamientos = mutableListOf<ComportamientoDelivery>(
                PorMonto(),
                PorHorario(LocalTime.of(9, 0)..LocalTime.of(12, 0)),
            )   // Horario de entrega fuera de rango ->FALSO
            val deliveryAND = Delivery("Fede", "fedeUsername",
                "fede123", zonaTrabajo, ComportamientoAND(comportamientos))

            deliveryAND.aceptarPedido(pedidoAND) shouldBe false
        }
    }

    describe("Evaluo comportamiento OR"){
        //DELIVERY
        val comportamientos = mutableListOf<ComportamientoDelivery>()
        comportamientos.add(PorHorario(LocalTime.of(9, 0)..LocalTime.of(18, 0)))
        comportamientos.add(PorCertificado())

        val deliveryOR = Delivery("Fede", "fedeUsername",
            "fede123", zonaTrabajo, ComportamientoOR(comportamientos))

        //LOCAL
        var direccionLocal = Direccion(
            "Sarmiento", 1200, Point(5.0, 5.0)
        )
        val local = Local(
            nombre = "SarmientoPanchos", direccion = direccionLocal
        )
        val resena = Resena(
            idResena = 1,
            user = "Max Verstappen",
            comentario= "Excelente atención y la comida deliciosa!",
            puntuacion = 5.0,
            fecha = "Hace 2 días"
        )
        val resena2 = Resena(
            idResena = 1,
            user = "Max Verstappen",
            comentario= "Excelente atención y la comida deliciosa!",
            puntuacion = 4.0,
            fecha = "Hace 2 días"
        )

        local.agregarResena(resena)
        local.agregarResena(resena2)
        //4.5 promedio ->certificado

        //USUARIO
        val fechaDeNacimiento = LocalDate.of(2003, 11, 17)
        var direccionUser = Direccion(
            "Belgrano", 120, Point(8.0, 8.0)
        )
        val tiempoRegistro: LocalDate = LocalDate.of(2024, 3, 28)
        var usuario = Usuario(
            "Santiago", "Rodriguez", "UserSanti",
             direccionUser, imgUrl = ""
        ).apply{
            password = "santi123"
            fechaNacimiento = fechaDeNacimiento
            tiempoDeRegistro = tiempoRegistro
        } // +1 año de uso, certificado

        //PEDIDO
        val pedidoOR = _root_ide_package_.ar.edu.unsam.algo3.Pedido(usuario, local)
            .apply {
                agregarHoraDeEntrega(LocalTime.of(14, 0))
                agregarMedioDePago(MetodosDePago.EFECTIVO)
            }
        pedidoOR.cambioDeEstadoDePedido(_root_ide_package_.ar.edu.unsam.algo3.EstadosDePedido.PREPARADO)
        pedidoOR.delivery = deliveryOR

        it("acepto pedido OR"){
            deliveryOR.aceptarPedido(pedidoOR) shouldBe true
        }

        it("NO acepto pedido OR"){
            val tiempoRegistro: LocalDate = LocalDate.of(2025, 3, 28)
            var usuario = Usuario(
                "Santiago", "Rodriguez", "UserSanti",
                direccionUser, imgUrl = ""
            ).apply{
                password = "santi123"
                fechaNacimiento = fechaDeNacimiento
                tiempoDeRegistro = tiempoRegistro
            } // -1 año de uso, NO certificado

            val pedidoOR = _root_ide_package_.ar.edu.unsam.algo3.Pedido(usuario, local)
                .apply {
                    agregarHoraDeEntrega( LocalTime.of(20, 0))
                    agregarMedioDePago(MetodosDePago.EFECTIVO)
                }
            // pedido fuera de rango de horario

            pedidoOR.cambioDeEstadoDePedido(_root_ide_package_.ar.edu.unsam.algo3.EstadosDePedido.PREPARADO)
            pedidoOR.delivery = deliveryOR

            deliveryOR.aceptarPedido(pedidoOR) shouldBe false
        }
    }

    describe("Evaluo un AND dentro de un OR"){
        val comportamientoHorario = PorHorario(LocalTime.of(9, 0)..LocalTime.of(18, 0))
        val comportamientoCertificado = PorCertificado()
        val comportamientoMonto = PorMonto()

        val comportamientoAND = ComportamientoAND(
            listOf(comportamientoCertificado, comportamientoMonto)
        )

        val comportamientoOR = ComportamientoOR(
            listOf(comportamientoHorario, comportamientoAND)
        )

        val delivery = Delivery(
            "Fede", "fedeUsername", "fede123", zonaTrabajo, comportamientoOR
        )

        delivery.aceptarPedido(pedido) shouldBe true
        // PorHorario acepta pedido dentro del OR
        // PorMonto devuelve FALSE, arruinando el AND (certificado da TRUE)
    }
})