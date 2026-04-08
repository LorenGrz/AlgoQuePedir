package ar.edu.unsam.algo3

interface EmailSender{
    fun enviarEmail(email: Email)
}

data class Email(val de: String, val para: String, val asunto: String, val contenido:String)