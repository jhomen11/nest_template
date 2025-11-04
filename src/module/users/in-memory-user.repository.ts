import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository.abstract';
import { User } from './user.model';
import * as bcrypt from 'bcryptjs';

/**
 * Esta es la implementación "En Memoria" de nuestro contrato UserRepository.
 * Se usará para pruebas o para cuando no queramos depender de una base de datos.
 * Fíjate que "implements" el contrato "UserRepository".
 */
@Injectable()
export class InMemoryUserRepository extends UserRepository {

  async create(user: User): Promise<Omit<User, 'password'>> {
    this.users.push(user);
    const { password, ...result } = user;
    return Promise.resolve(result);
  }
  
  // Nuestra base de datos "falsa" en memoria.
  private readonly users: User[] = [
    {
      userId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      username: 'admin',
      email: 'admin@example.com',
      // Contraseña: admin123
      password: bcrypt.hashSync('admin123', 10), 
      fullName: 'Administrador del Sistema',
      isActive: true,
      roles: ['admin', 'user'],
    },
    {
      userId: '2c8e7abc-c8fd-4b2d-9b5d-ab8dfbbd4cee',
      username: 'user',
      email: 'user@example.com',
      // Contraseña: user123
      password: bcrypt.hashSync('user123', 10),
      fullName: 'Usuario Regular',
      isActive: true,
      roles: ['user'],
    },
  ];

  /**
   * Implementación del método 'findOneByUsername' del contrato.
   * Busca en el array en memoria.
   */
  async findOneByUsername(username: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.username === username);
    // Usamos Promise.resolve() para simular la asincronía de una base de datos real
    return Promise.resolve(user);
  }

  /**
   * Implementación del método 'findOneByEmail' del contrato.
   * Busca en el array en memoria.
   */
  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === email);
    return Promise.resolve(user);
  }

  /**
   * Implementación del método 'findAll' del contrato.
   * Devuelve todos los usuarios del array en memoria.
   */
  async findAll(): Promise<User[]> {
    return Promise.resolve(this.users);
  }
}
