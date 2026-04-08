package ar.edu.unsam.algo3

import java.time.LocalDate

class Inbox {
    var mensajes: MutableList<Mensaje> = mutableListOf()
}

data class Mensaje(
    val fechaDeEmision: LocalDate,
    val asunto: String,
    val cuerpo: String,
    var leido: Boolean = false
)