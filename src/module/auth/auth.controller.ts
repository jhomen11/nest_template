import { Controller, Post, UseGuards, Request, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles, RolesGuard } from './guards/roles.guard';
import { User } from '../users/user.model';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth') // Todas las rutas aquí empezarán con /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Endpoint de Login
   * POST /auth/login
   */
  @UseGuards(LocalAuthGuard) // 1. Activa LocalStrategy (valida user/pass)
  @Post('login')
  async login(@Request() req) {
    // 2. Si llega aquí, LocalStrategy validó al usuario y lo adjuntó a req.user
    // 3. AuthService.login() crea y devuelve el token JWT. El password ya fue validado con bcrypt en la estrategia.
    return this.authService.login(req.user as Omit<User, 'password'>);
  }

  /**
   * Endpoint de Perfil (Ruta Protegida)
   * GET /auth/profile
   */
  @UseGuards(JwtAuthGuard) // 1. Activa JwtStrategy (valida el token JWT)
  @Get('profile')
  getProfile(@Request() req) {
    // 2. Si llega aquí, el token es válido y JwtStrategy adjuntó
    //    el payload del token a req.user
    return req.user;
  }

  /**
   * Endpoint de Admin (Ruta Protegida por Rol)
   * GET /auth/admin
   */
  @UseGuards(JwtAuthGuard, RolesGuard) // 1. Valida el token, 2. Valida el rol
  @Roles('admin') // 3. Define que solo el rol 'admin' puede entrar
  @Get('admin')
  getAdminData(@Request() req) {
    return {
      message: 'Bienvenido, Administrador.',
      user: req.user,
    };
  }

}
