import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.model';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  /**
   * Inyectamos el "CONTRATO" (UserRepository), no una implementación concreta.
   * NestJS (gracias al UsersModule) nos pasará aquí el UsersService.
   */
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida a un usuario delegando la lógica al UsersService.
   * Esta es la lógica que usará nuestra LocalStrategy (para el login).
   */
  async validateUser(
    username: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.validateUser(username, pass);
    if (!user) return null;
    return user;
  }

  /**
   * Genera un token JWT para un usuario validado.
   */
  async login(user: Omit<User, 'password'>): Promise<string> {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.userId,
      roles: user.roles,
      fullName: user.fullName,
      email: user.email,
    };

    // CAMBIO AQUÍ: Devuelve solo el string firmado
    return this.jwtService.sign(payload);
  }

  /**
   * Registra un nuevo usuario delegando la lógica al UsersService.
   * @param createUserDto - DTO con los datos para crear el usuario.
   */
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    return this.usersService.create(createUserDto);
  }
}
