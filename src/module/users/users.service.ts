// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
// ¡Ya no necesitamos bcrypt aquí!

// 1. Cambia 'passwordHash' por 'password'
export type User = {
  userId: number;
  username: string;
  password: string; // <-- RENOMBRADO
  roles: string[];
};

@Injectable()
export class UsersService {
  
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'admin',
      // 2. Guarda el texto plano
      password: 'admin123', // <-- TEXTO PLANO
      roles: ['admin', 'user'],
    },
    {
      userId: 2,
      username: 'user',
      // 3. Guarda el texto plano
      password: 'user123', // <-- TEXTO PLANO
      roles: ['user'],
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}