import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository.abstract';
import { User } from './user.model';

/**
 * Esta es la implementación "En Memoria" de nuestro contrato UserRepository.
 * Se usará para pruebas o para cuando no queramos depender de una base de datos.
 * Fíjate que "implements" el contrato "UserRepository".
 */
@Injectable()
export class InMemoryUserRepository extends UserRepository {
  
  // Nuestra base de datos "falsa" en memoria.
  private readonly users: User[] = [
    {
      userId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      username: 'admin',
      email: 'admin@example.com',
      // Hasheado de "admin123"
      passwordHash: '$2b$10$Pcmh4G1NMUb2l.4QhXU3A.oTfL/f/3.aR6Iwn.a9L.s2O9I/5/wY.', 
      fullName: 'Administrador del Sistema',
      isActive: true,
      roles: ['admin', 'user'],
    },
    {
      userId: '2c8e7abc-c8fd-4b2d-9b5d-ab8dfbbd4cee',
      username: 'user',
      email: 'user@example.com',
      // Hasheado de "user123"
      passwordHash: '$2b$10$U2JVdC.AWMDEgL8.A1L9Q.s5S6m73yV.L/yA/u.R.b.S.A2/S.OaS',
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
}
