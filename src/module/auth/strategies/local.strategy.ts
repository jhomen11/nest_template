import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

/**
 * Esta estrategia maneja la autenticación de username/password (login).
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  
  /**
   * Inyectamos el AuthService para usar su método 'validateUser'.
   */
  constructor(private authService: AuthService) {
    // Por defecto, 'passport-local' busca 'username' y 'password'.
    // Si quisieras usar 'email' en lugar de 'username', lo cambiarías aquí:
    // super({ usernameField: 'email' });
    super();
  }

  /**
   * Este método es llamado automáticamente por Passport cuando se usa el 'LocalAuthGuard'.
   * Recibe el username y password que el usuario envió en el body.
   */
  async validate(username: string, password: string): Promise<any> {
    
    // Llama al AuthService que ya configuramos.
    // 'validateUser' usará el UserRepository (en memoria) y bcrypt.
    const user = await this.authService.validateUser(username, password);
    
    // Si 'validateUser' devuelve null, lanzamos una excepción que
    // NestJS convertirá en una respuesta HTTP 401.
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    
    // Si tiene éxito, Passport adjunta el objeto 'user' (sin el hash)
    // al objeto 'request' (request.user), que luego usamos en
    // el AuthController para llamar a 'authService.login(req.user)'.
    return user;
  }
}