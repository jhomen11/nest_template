import { User } from "./user.model";

/**
 * Este es el "Contrato" o "Interfaz" del Repositorio.
 * Define las *reglas* y los *métodos* que cualquier repositorio de usuarios
 * debe implementar, sin importar si es Postgres, en memoria, MongoDB, etc.
 *
 * El resto de la aplicación (ej: AuthService) dependerá de esta clase abstracta,
 * no de una implementación concreta.
 */
export abstract class UserRepository {
  /**
   * Busca un usuario por su nombre de usuario.
   * @param username El nombre de usuario a buscar.
   * @returns Una Promesa que resuelve al objeto 'User' si se encuentra, o 'undefined'.
   */
  abstract findOneByUsername(username: string): Promise<User | undefined>;

  /**
   * Busca un usuario por su email.
   * @param email El email a buscar.
   * @returns Una Promesa que resuelve al objeto 'User' si se encuentra, o 'undefined'.
   */
  abstract findOneByEmail(email: string): Promise<User | undefined>;

  abstract create(user: User): Promise<Omit<User, 'password'>>;

  abstract findAll(): Promise<User[]>;

}
