import ar.edu.unsam.algo3.ComportamientoSegunEdad
import ar.edu.unsam.algo3.ComportamientoUsuario
import ar.edu.unsam.algo3.ComportamientoCompuesto
import ar.edu.unsam.algo3.Conservador
import ar.edu.unsam.algo3.Direccion
import ar.edu.unsam.algo3.Exquisito
import ar.edu.unsam.algo3.Fiel
import ar.edu.unsam.algo3.GrupoAlimenticio
import ar.edu.unsam.algo3.Impaciente
import ar.edu.unsam.algo3.Ingrediente
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.Marketinero
import ar.edu.unsam.algo3.Plato
import ar.edu.unsam.algo3.Resena
import ar.edu.unsam.algo3.Usuario
import ar.edu.unsam.algo3.Vegano
import ar.edu.unsam.algo3.exceptions.BusinessException
import io.kotest.core.spec.IsolationMode
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.assertThrows
import org.uqbar.geodds.Point
import java.time.LocalDate
import java.time.LocalTime

class UsuarioSpec : DescribeSpec({
    isolationMode = IsolationMode.InstancePerTest

    describe(" Compruebo Usuario ") {
        /* Instanciación de Usuario */
        val usuario = Usuario(
            nombre = "dante",
            apellido = "tripodi",
            username = "Rubia",
            direccion = Direccion("calle falsa", 123, Point(-34.599220725558055, -58.40170853602751)),
            imgUrl = ""
        ).apply{
            password = "1234"
            fechaNacimiento = LocalDate.of(2002, 12, 2)
            tiempoDeRegistro = LocalDate.of(2024, 3, 29)
        }

        /* Instanciación de Ingredientes */
        val leche = Ingrediente("Leche", 200.00, GrupoAlimenticio.LACTEOS, true)
        val huevo = Ingrediente("Huevo", 10.00, GrupoAlimenticio.PROTEINAS, true)
        val banana = Ingrediente("Banana", 5.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false)
        val carne = Ingrediente("Carne", 1000.0, GrupoAlimenticio.PROTEINAS, true)
        val tomate = Ingrediente("Tomate", 200.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false)
        val lechuga =Ingrediente("Lechuga", 5.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false)

        /* Instanciación de Locales y Platos */
        val local = Local(nombre = "Pizzeria X", direccion = Direccion("calle falsa", 123, Point(-34.599220725558055, -58.40170853602751)))
        val localLejano =
            Local(nombre = "Restoran X", direccion = Direccion("calle falsa 2", 345, Point(-60.599220725558055, -100.40170853602751)))
        val plato = Plato("batido", local, mutableListOf(banana, huevo, leche))
        val platoVegano = Plato("vegano", local, mutableListOf(tomate))
        val platoDeAutor = Plato("autor", local, mutableListOf(tomate))
        val platoConservador = Plato("conservador", local, mutableListOf(tomate))
        val platoEsFiel = Plato("fiel", local, mutableListOf(tomate))
        val platoNoFiel = Plato("Felix", localLejano, mutableListOf(tomate))
        val platoMarketing = Plato("Marketing", local, mutableListOf(tomate))
        val platoCercano = Plato("Cercano", local, mutableListOf(tomate))

        //creo un pedido
        val pedido = _root_ide_package_.ar.edu.unsam.algo3.Pedido(usuario, local)
            .apply { agregarHoraDeEntrega(LocalTime.of(14, 0)) }

        /* Tests */
        it("COMPRUEBO LA EDAD ESPERADA ") {
            //mockkStatic(LocalDate::class) // Mockeamos LocalDate.now()
            //every { LocalDate.now() } returns LocalDate.of(2024, 3, 25)
            //Todos los LocalDate van a ser del 25/3/2024 (en este it)
            val edadEsperada = 22
            usuario.edad shouldBe edadEsperada
            //unmockkAll()
        }
        it("COMPRUEBO EL TIEMPO DE REGISTRO") {
            usuario.tiempoDeRegistro
                .isBefore(LocalDate.now().minusYears(1)) shouldBe true
        }

        it("CREO LOS INGREDIENTES PARA AGREGARLOS A SUS LISTAS") {
            //AGREGO INGREDIENTES PREFERIDOS EN SU LISTA Y CHEQUEO QUE ESTEN
            usuario.agregarIngredientePreferido(leche)
            usuario.ingredientesPreferidos shouldContain leche

            //AGREGO INGREDIENTES A EVITAR  EN SU LISTA E INTENTO AGREGARLOS A LOS PREFERIDOS
            usuario.agregarIngredienteAEvitar(banana)

            assertThrows<BusinessException> {
                usuario.agregarIngredientePreferido(banana)
            }
        }

        it("COMPRUEBO SI MI UBICACION ESTA EN EL RANGO") {
            usuario.esCercano(usuario.direccion) shouldBe true
        }

        it("CONFIRMA PEDIDO Y REGISTRA LOCAL") {
            usuario.confirmarPedido(pedido)
            usuario.puedePuntuar(local) shouldBe true
        }

        it("NO PUEDE PUNTUAR SI PASARON LOS 7 DIAS ") {
            usuario.confirmarPedido(pedido)
            usuario.localesAPuntuar.contains(local) shouldBe true
            // AGREGAMOS UN LOCAL CON EL TIEMPO ALTERADO( MAS DE 7 DIAS)
            usuario.localesAPuntuar[local] = LocalDate.now().minusDays(8)
            usuario.puedePuntuar(local) shouldBe false
        }

        it("USUARIO PUNTEA A UN LOCAL UNA SOLA VEZ") {
            val resena = Resena(
                idResena = 1,
                user = "Max Verstappen",
                comentario= "Excelente atención y la comida deliciosa!",
                puntuacion = 3.0,
                fecha = "Hace 2 días"
            )
            usuario.confirmarPedido(pedido)
            usuario.puntuarLocal(local, resena) shouldBe true
            local.puntuacion() shouldBe 3.0
            //COMPROBAMOS QUE NO SE PUEDA VOLVER A PUNTUAR ESE LOCAL
            val resena2 = Resena(
                idResena = 1,
                user = "Max Verstappen",
                comentario= "Excelente atención y la comida deliciosa!",
                puntuacion = 5.0,
                fecha = "Hace 2 días"
            )
            usuario.puntuarLocal(local, resena2) shouldBe false
            local.puntuacion() shouldBe 3.0 // NO SE HACE UN CAMBIO
        }

        it("NO SE PUEDE PUNTUAR UN LOCAL YA PUNTUADO") {
            usuario.confirmarPedido(pedido)
            //SIMULAMOS QUE EL LOCAL FUE PUNTUADO
            usuario.localesYaPuntuados.add(local)
            //PUNTUAMOS A UN LOCAL NUEVAMENTE
            val resena = Resena(
                idResena = 1,
                user = "Max Verstappen",
                comentario= "Excelente atención y la comida deliciosa!",
                puntuacion = 4.0,
                fecha = "Hace 2 días"
            )
            usuario.puntuarLocal(local, resena) shouldBe false
            //COMPROBAMOS QUE NO SE AGREGO LA PUNTUACION
            local.puntuacion() shouldBe 0.0
        }


        it("COMPROBAMOS QUE UN PLATO SEA ACORDE PARA LOS USUARIOS") {
            usuario.esPlatoAcorde(plato) shouldBe true
            usuario.agregarIngredienteAEvitar(banana)
            usuario.esPlatoAcorde(plato) shouldBe false
        }

        it("COMPRUEBO USUARIO VEGANO") {
            usuario.tipoDieta = Vegano()

            usuario.esPlatoAcorde(platoVegano) shouldBe true
            platoVegano.agregarIngredientes(mutableListOf(carne, huevo))
            usuario.esPlatoAcorde(platoVegano) shouldBe false
        }

        it("COMPRUEBO USUARIO EXQUISITO (QUE SEA DE AUTOR)") {
            usuario.tipoDieta = Exquisito()
            platoDeAutor.platoDeAutor = true

            usuario.esPlatoAcorde(platoDeAutor) shouldBe true

            platoDeAutor.platoDeAutor = false
            usuario.esPlatoAcorde(platoDeAutor) shouldBe false
        }

        it("COMPRUEBO USUARIO CONSERVADOR") {
            usuario.tipoDieta = Conservador()
            usuario.agregarIngredientePreferido(tomate)
            usuario.agregarIngredientePreferido(huevo)
            usuario.esPlatoAcorde(platoConservador) shouldBe true
            platoConservador.agregarIngredientes(mutableListOf(banana))
            usuario.esPlatoAcorde(platoConservador) shouldBe false
        }
        it("COMPRUEBO USUARIO NO SEA  CONSERVADOR") {
            usuario.tipoDieta = Conservador()
            platoConservador.agregarIngredientes(mutableListOf(banana))
            usuario.esPlatoAcorde(platoConservador) shouldBe false
        }

        it("COMPRUEBO USUARIO FIEL") {
            val fiel = Fiel()
            fiel.localesPreferidos = mutableSetOf(local)
            usuario.tipoDieta = fiel
            usuario.esPlatoAcorde(platoEsFiel) shouldBe true
            usuario.esPlatoAcorde(platoNoFiel) shouldBe false
        }

        it("COMPRUEBO USUARIO INFLUENCIADO") {
            val marketinero = Marketinero()
            marketinero.palabrasClave = mutableSetOf("bajo en sodio")
            usuario.tipoDieta = marketinero
            platoMarketing.descripcion = "bajo en sodio"

            usuario.esPlatoAcorde(platoMarketing) shouldBe true

            platoConservador.descripcion = "altos en grasa"
            usuario.esPlatoAcorde(platoConservador) shouldBe false
        }

        it("COMPRUEBO USUARIO IMPACIENTE") {
            usuario.tipoDieta = Impaciente()

            usuario.esCercano(local.direccion) shouldBe true
            usuario.esPlatoAcorde(platoCercano) shouldBe true
            usuario.esCercano(localLejano.direccion) shouldBe false
            usuario.esPlatoAcorde(platoNoFiel) shouldBe false
        }
        it("COMPRUEBO COMPORTAMIENTO COMPUESTO") {
            val comportamientoVegano = Vegano()
            val comportamientoConservador = Conservador()
            val comportamientos = mutableListOf(comportamientoVegano, comportamientoConservador)
            val comportamientoCompuesto = ComportamientoCompuesto()
            comportamientoCompuesto.comportamientos = comportamientos
            usuario.tipoDieta = comportamientoCompuesto
            usuario.agregarIngredientePreferido(tomate)
            usuario.esPlatoAcorde(platoConservador) shouldBe true
            usuario.esPlatoAcorde(platoVegano) shouldBe true
        }
        it("COMPRUEBO  QUE EL COMPORTAMIENTO COMPUESTO NO SE CUMPLA ") {
            val comportamientoVegano = Vegano()
            val comportamientoConservador = Conservador()
            val comportamientos = listOf(comportamientoVegano, comportamientoConservador)
            val comportamientoCompuesto = ComportamientoCompuesto()
            comportamientoCompuesto.comportamientos = comportamientos
            usuario.tipoDieta = comportamientoCompuesto
            usuario.agregarIngredientePreferido(carne)
            platoVegano.agregarIngredientes(mutableListOf(carne))
            platoConservador.agregarIngredientes(mutableListOf(lechuga))
            usuario.esPlatoAcorde(platoConservador) shouldBe false
            usuario.esPlatoAcorde(platoVegano) shouldBe false
        }

        //CREO LOS FALSOS COMPORTAMIENTOS DE EXQUISITO Y CONSERVADOR
        class ExquisitoStub(val respuesta: Boolean) : ComportamientoUsuario {
            override fun esPlatoAcorde(plato: Plato, usuario: Usuario): Boolean {
                return respuesta
            }
        }

        class ConservadorStub(val respuesta: Boolean) : ComportamientoUsuario {
            override fun esPlatoAcorde(plato: Plato, usuario: Usuario): Boolean {
                return respuesta
            }
        }
        describe("COMPORTAMIENTO SEGUN LA EDAD") {
            it("USUARIO SE COMPORTA COMO EXQUISITO  CUANDO LA EDAD ES PAR") {
                val usuarioEdadPar = usuario

                val comportamientoEdad = object : ComportamientoSegunEdad() {
                    override val exquisito = ExquisitoStub(respuesta = true)
                    override val conservador = ConservadorStub(respuesta = false)
                }

                comportamientoEdad.esPlatoAcorde(plato, usuarioEdadPar) shouldBe true
            }

            it("CASO CONTRARIO: USUARIO CON EDAD PAR NO SE COMPORTA COMO EXQUISITO") {
                val usuarioEdadPar = usuario

                val comportamientoEdad = object : ComportamientoSegunEdad() {
                    //CAMBIO LOS COMPORTAMIENTOS SABIENDO QUE ESPERA UN FALSO
                    override val exquisito = ExquisitoStub(respuesta = false)
                    override val conservador = ConservadorStub(respuesta = true)
                }

                comportamientoEdad.esPlatoAcorde(plato, usuarioEdadPar) shouldBe false
            }

            it("USUARIO SE COMPORTA COMO CONSERVADOR CUANDO LA EDAD ES IMPAR") {
                val fechaNacimientoImpar = LocalDate.of(2003, 12, 2)//EDAD IMPAR
                val usuarioEdadImpar = usuario

                val comportamientoEdad = object : ComportamientoSegunEdad() {
                    override val exquisito = ExquisitoStub(false)
                    override val conservador = ConservadorStub(true)
                }

                comportamientoEdad.esPlatoAcorde(plato,usuarioEdadImpar) shouldBe true
            }

            it("CASO CONTRARIO: USUARIO CON EDAD IMPAR NO SE COMPORTA COMO CONSERVADOR") {
                val fechaNacimientoImpar = LocalDate.of(2003, 12, 2)
                val usuarioEdadImpar = usuario

                val comportamientoEdad = object : ComportamientoSegunEdad() {
                    //CAMBIO LOS COMPORTAMIENTOS SABIENDO QUE ESPERA UN FALSO
                    override val exquisito = ExquisitoStub(true)
                    override val conservador = ConservadorStub(false)
                }

                comportamientoEdad.esPlatoAcorde(plato,usuarioEdadImpar) shouldBe false
            }
        }

    }
})