package ar.edu.unsam.algo3.service

import ar.edu.unsam.algo3.Usuario
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.dto.LoginLocalDTO
import ar.edu.unsam.algo3.dto.LoginUsuarioDTO
import ar.edu.unsam.algo3.exceptions.ConflictException
import ar.edu.unsam.algo3.exceptions.NotFoundException
import ar.edu.unsam.algo3.exceptions.UnauthorizedException
import ar.edu.unsam.algo3.helpers.LocalMapper
import ar.edu.unsam.algo3.helpers.UsuarioMapper
import ar.edu.unsam.algo3.repository.LocalRepository
import ar.edu.unsam.algo3.repository.UsuarioRepository
import org.springframework.stereotype.Service

@Service
class AuthService(
    val localRepository: LocalRepository,
    val usuarioRepository: UsuarioRepository,
    private val localMapper: LocalMapper,
    private val usuarioMapper: UsuarioMapper
){
    fun registerLocal(credencial: LoginLocalDTO) : Local {
        val existe = localRepository.search(credencial.username).firstOrNull()
        if( existe != null ) { throw ConflictException("Este usuario ya está registrado") }
        val nuevoLocal = localMapper.newLocalFromRegister(credencial)
        localRepository.create(nuevoLocal)
        return nuevoLocal
    }

    fun loginLocal(credencial: LoginLocalDTO): Local {
        val usuario = localRepository.search(credencial.username).firstOrNull()
        if ( usuario == null ) { throw NotFoundException("Usuario no registrado.") }
        if ( usuario.credencial.password != credencial.password ) { throw UnauthorizedException("Usuario o contraseña incorrecto.") }
        return usuario
    }

    fun registrarUsuario(credencial: LoginUsuarioDTO) : Usuario {
        val existe = usuarioRepository.search(credencial.username).firstOrNull()
        if( existe != null ) { throw ConflictException("Este usuario ya está registrado")
        }
        val nuevoUsuario = usuarioMapper.newUsuarioFromRegister(credencial)
        usuarioRepository.create(nuevoUsuario)
        return nuevoUsuario
    }

    fun loguearUsuario(credencial: LoginUsuarioDTO): Usuario {
        val usuario = usuarioRepository.search(credencial.username).firstOrNull()
        if ( usuario == null ) { throw NotFoundException("Usuario no registrado.") }
        if ( !usuario.validarPassword(credencial.password) ) { throw UnauthorizedException("Usuario o contraseña incorrecto.") }
        return usuario
    }

}