import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { usuarioService } from '../../services/usuarioService'
import { Usuario } from '../../classes/usuario/Usuario'
import { AxiosError, AxiosResponse } from 'axios'

vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

const USUARIO_MOCK = new Usuario({
  nombre: 'Denichan',
  apellido: 'Higa',
  direccion: 'Artigas',
  altura: 6000,
  latitud: -34.603722,
  longitud: -58.381592,
  imgUrl: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.tecnomedis.com.pe%2F%3Fb%3D71090719001170&psig=AOvVaw18TYsqPetTxXN1NZO6ikzo&ust=1764032641393000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJDq4u3LiZEDFQAAAAAdAAAAABAE',
  email: 'dmhiga@unsam.com',
  ingredientesAEvitar: [],
  ingredientesPreferidos: [],
  tipoDieta: {},
  distancia: 1
})

describe('UsuarioService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

    it('debe obtener un usuario exitosamente', async () => {
        const id = 1
        mockedAxios.get.mockResolvedValue({ data: USUARIO_MOCK })

        const result = await usuarioService.getUsuario(id)

        expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(`/usuario/${id}`)
        )
        expect(result).toEqual(USUARIO_MOCK)
    })

    it('debe manejar errores al obtener usuario', async () => {
        const id = 1
        const error = new AxiosError('Error al obtener usuario')
        error.response = {
        status: 404,
        data: { message: 'Usuario no encontrado' }
        } as unknown as AxiosResponse
        mockedAxios.get.mockRejectedValue(error)

        await expect(usuarioService.getUsuario(id)).rejects.toThrow()
        expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(`/usuario/${id}`)
        )
    })

    it('debe actualizar un usuario exitosamente', async () => {
      const id = 1
      mockedAxios.put.mockResolvedValue({ data: undefined })

      await usuarioService.actualizarUsusario(id, USUARIO_MOCK)

      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining(`/usuario/${id}`),
        USUARIO_MOCK
      )
    })

    it('debe manejar errores al actualizar usuario', async () => {
      const id = 1
      const error = new AxiosError('Error al actualizar usuario')
      error.response = {
        status: 400,
        data: { message: 'Datos inválidos' }
      } as unknown as AxiosResponse
      mockedAxios.put.mockRejectedValue(error)

      await expect(
        usuarioService.actualizarUsusario(id, USUARIO_MOCK)
      ).rejects.toThrow()
      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining(`/usuario/${id}`),
        USUARIO_MOCK
      )
    })
})
