import { Controller, Post, UseGuards, Request, Get, Body, Res } from '@nestjs/common'; // 1. Importar @Res
import type { Response } from 'express'; // 2. Importar Response de Express
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles, RolesGuard } from './guards/roles.guard';
import { User } from '../users/user.model';
// (No necesitas CreateUserDto aquí, ya que está en UsersController)

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * CAMBIO: Endpoint de Login modificado para usar Cookies.
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req,
    // 3. Inyectamos la Respuesta de Express
    //    @Res({ passthrough: true }) permite que NestJS
    //    aún controle el envío final de la respuesta.
    @Res({ passthrough: true }) res: Response,
  ) {
    // 4. AuthService (del paso 2.A) ahora devuelve solo el string del token
    const token = await this.authService.login(req.user as Omit<User, 'password'>);

    // 5. Configuramos la cookie en la respuesta
    res.cookie('access_token', token, {
      httpOnly: true, // La cookie no es accesible por JavaScript en el navegador (previene XSS)
      secure: process.env.NODE_ENV === 'production', // Enviar solo por HTTPS en producción
      // sameSite: 'strict', // (Opcional pero recomendado) Previene ataques CSRF
      // maxAge: 3600000, // (Opcional) Tiempo de vida (ej: 1 hora)
    });

    // 6. Devolvemos una respuesta JSON amigable
    //    El token ya no se envía aquí, ¡va en la cookie!
    return {
      message: 'Login exitoso',
      user: req.user,
    };
  }

  // (El resto de tus endpoints como getProfile y getAdminData no cambian)

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  getAdminData(@Request() req) {
    return {
      message: 'Bienvenido, Administrador.',
      user: req.user,
    };
  }
}