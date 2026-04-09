export interface CredencialesUsuario {
  usuario: string
  password: string
}

export const CREDENCIALES_MOCK: CredencialesUsuario[] = [
  {
    usuario: 'luis',
    password: '123'
  }
]

export function validarCredencialesMock(usuario: string, password: string): boolean {
  return CREDENCIALES_MOCK.some((cred) => cred.usuario === usuario && cred.password === password)
}

export function obtenerUsuarioPorCredenciales(
  usuario: string,
  password: string
): CredencialesUsuario | undefined {
  return CREDENCIALES_MOCK.find((cred) => cred.usuario === usuario && cred.password === password)
}
