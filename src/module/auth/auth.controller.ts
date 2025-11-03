import { Controller, Request, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RolesGuard, Roles } from './guards/roles.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

   // 1. Endpoint de Login
  // Usa el LocalAuthGuard para validar credenciales (username/password)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // req.user es el usuario validado por LocalStrategy
    return this.authService.login(req.user);
  }

  // @Post('register')
  // async register(@Request() req) {
  //   return this.authService.register(req.user);
  // }


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // req.user es el payload del JWT validado por JwtStrategy
    return req.user;
  }

  // 3. Endpoint protegido por Rol (Autenticado + Autorizado)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Solo usuarios con rol 'admin' pueden acceder
  @Get('admin/dashboard')
  getDashboard(@Request() req) {
    return {
      message: 'Bienvenido al dashboard de admin',
      user: req.user,
    };
  }
}
