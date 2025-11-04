import { Module, forwardRef } from '@nestjs/common';
import { UserRepository } from './user.repository.abstract';
import { InMemoryUserRepository } from './in-memory-user.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
// No importamos TypeOrmUserRepository ni TypeOrmModule por ahora.

/**
 * Este es el "interruptor" que pediste.
 * Este proveedor le dice a NestJS:
 * "Cuando cualquier servicio pida 'UserRepository' (el contrato)...
 * ... entrégale una instancia de 'InMemoryUserRepository' (la implementación)."
 */
const repositoryProvider = {
  provide: UserRepository, // El "contrato" (Token de Inyección)
  useClass: InMemoryUserRepository, // La "implementación" concreta
};

@Module({
  imports: [
    // Ya no es necesaria la importación de AuthModule aquí
    // No necesitamos TypeOrmModule.forFeature(...) aquí
    // porque estamos probando en memoria.
  ],
  controllers: [UsersController],
  providers: [
    repositoryProvider, // Registra nuestro "interruptor"
    UsersService,
  ],
  exports: [
    // Exportamos el "contrato" para que otros módulos (como AuthModule) lo usen
    UserRepository,
    UsersService,
  ],
})
export class UsersModule {}