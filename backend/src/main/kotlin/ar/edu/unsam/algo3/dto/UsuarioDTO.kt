package ar.edu.unsam.algo3.dto

import ar.edu.unsam.algo3.ComportamientoUsuario

data class UsuarioDTO(
    val nombre: String,
    val apellido: String,
    val direccion: String,
    val altura: Int,
    val latitud: Double,
    val longitud: Double,
    val imgUrl: String,
    val email: String,

    val ingredientesAEvitar: List<IngredienteDTO>,
    val ingredientesPreferidos: List<IngredienteDTO>,

    val distancia: Double,
    val tipoDieta: ComportamientoUsuario
)

data class LoginUsuarioDTO(
    val username: String,
    val password: String
)

data class RetornoUsuarioDTO(
    val id: Int,
    val username: String
)
