import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository.abstract';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmUserRepository } from './typeorm-user.repository';
import { UserEntity } from './entities/user.entity'; 
import { DatabaseModule } from '../database/database.module';
import { DataSource } from 'typeorm';

/**
 * Este proveedor le dice a NestJS:
 * "Cuando cualquier servicio pida 'UserRepository' (el contrato)...
 * ... entrégale una instancia de 'TypeOrmUserRepository' (la implementación)."
 */
const repositoryProvider = {
  provide: UserRepository, // El "contrato" (Token de Inyección)
  useFactory: (dataSource: DataSource) => {
    const baseRepository = dataSource.getRepository(UserEntity);
    return new TypeOrmUserRepository(baseRepository);
  },
  inject: ['DATA_SOURCE'],
};

@Module({
  imports: [
    DatabaseModule, // Importa DatabaseModule para tener acceso a 'DATA_SOURCE'
  ],
  controllers: [UsersController],
  providers: [
    repositoryProvider, // Registra nuestro "interruptor"
    UsersService,
  ],
  exports: [
    UserRepository,
    UsersService,
  ],
})
export class UsersModule {}