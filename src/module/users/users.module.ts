import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository.abstract';
import { InMemoryUserRepository } from './in-memory-user.repository';
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
    // No necesitamos TypeOrmModule.forFeature(...) aquí
    // porque estamos probando en memoria.
  ],
  providers: [
    repositoryProvider, // Registra nuestro "interruptor"
    // También registramos la clase concreta para que Nest la pueda instanciar
    InMemoryUserRepository, 
  ],
  exports: [
    // Exportamos el "contrato" para que otros módulos (como AuthModule) lo usen
    UserRepository, 
  ],
})
export class UsersModule {}