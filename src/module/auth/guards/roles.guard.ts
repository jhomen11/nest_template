import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtenemos los roles requeridos, ej: @Roles('admin')
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // Si no se definen roles, se permite el acceso
    }
    
    // Obtenemos el usuario que fue validado por JwtStrategy
    const { user } = context.switchToHttp().getRequest();
    
    // Verificamos si el usuario tiene al menos uno de los roles requeridos
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

// También un decorador simple para asignar roles a las rutas

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);