import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../users/user.repository.abstract';
import * as bcrypt from 'bcryptjs'; // Usamos bcryptjs como decidimos
import { User } from '../users/user.model';

@Injectable()
export class AuthService {
  /**
   * Inyectamos el "CONTRATO" (UserRepository), no una implementación concreta.
   * NestJS (gracias al Paso 5) nos pasará aquí el InMemoryUserRepository.
   */
  constructor(
    private usersRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida a un usuario contra el repositorio.
   * Esta es la lógica que usará nuestra LocalStrategy (para el login).
   */
  async validateUser(username: string, pass: string): Promise<any> {
    // 1. Busca al usuario usando el repositorio
    const user = await this.usersRepository.findOneByUsername(username);

    if (!user) {
      console.log(`AuthService: Usuario no encontrado '${username}'`);
      return null;
    }

    // 2. Compara la contraseña (usando el passwordHash del modelo)
    const passwordMatches = await bcrypt.compare(pass, user.passwordHash);

    if (user && passwordMatches) {
      // 3. Si todo está bien, devuelve el usuario (sin el hash)
      const { passwordHash, ...result } = user;
      return result;
    }

    console.log(`AuthService: Contraseña incorrecta para '${username}'`);
    return null;
  }

  /**
   * Genera un token JWT para un usuario validado.
   */
  async login(user: Omit<User, 'passwordHash'>) {
    // El 'user' que recibimos aquí ya fue validado y no tiene el hash

    const payload = {
      username: user.username,
      sub: user.userId, // 'sub' (subject) es el estándar de JWT para el ID
      roles: user.roles,
      fullName: user.fullName,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
