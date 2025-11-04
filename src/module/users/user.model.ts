/**
 * Modelo de Dominio.
 * El objeto 'User' que usa la lógica de negocio (AuthService, etc.)
 */
export class User {
  userId: string;
  username: string;
  email: string;
  
  /**
   * MODIFICADO:
   * Renombramos 'passwordHash' a 'password' para reflejar
   * que estamos probando con contraseñas en texto plano.
   */
  password: string; 

  fullName: string;
  isActive: boolean;
  roles: string[];
}
