import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  /**
   * Función extractora personalizada
   * Esta función se encarga de leer la cookie 'access_token'
   * desde el objeto 'request'. Esto es posible gracias
   * al middleware 'cookie-parser' que instalamos en main.ts.
   */
  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }
    return null;
  }

  constructor() {
    super({
      // 3. CAMBIO PRINCIPAL:
      // Le decimos a Passport que deje de buscar en la cabecera
      // y que use nuestra función extractora personalizada.
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
        // (Opcional) Podemos dejar el método antiguo como fallback
        // por si queremos soportar ambos métodos de autenticación:
        // ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      
      // Esto no cambia:
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'unSecretoMuyFuertePorDefecto',
    });
  }

  async validate(payload: JwtPayload) {
    return { 
      userId: payload.sub, 
      username: payload.username, 
      roles: payload.roles,
      email: payload.email,
      fullName: payload.fullName,
    };
  }
}
