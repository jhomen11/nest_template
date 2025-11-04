import { Module, forwardRef } from '@nestjs/common';
import { UserRepository } from './user.repository.abstract';
import { InMemoryUserRepository } from './in-memory-user.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmUserRepository } from './typeorm-user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
// No importamos TypeOrmUserRepository ni TypeOrmModule por ahora.

/**
 * Este proveedor le dice a NestJS:
 * "Cuando cualquier servicio pida 'UserRepository' (el contrato)...
 * ... entrégale una instancia de 'InMemoryUserRepository' (la implementación)."
 */
const repositoryProvider = {
  provide: UserRepository, // El "contrato" (Token de Inyección)
  // useClass: InMemoryUserRepository, // La "implementación" concreta
  useClass: TypeOrmUserRepository
};

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UsersController],
  providers: [
    repositoryProvider, // Registra nuestro "interruptor"
    UsersService,
    InMemoryUserRepository, 
    TypeOrmUserRepository, 
  ],
  exports: [
    UserRepository,
    UsersService,
  ],
})
export class UsersModule {}