import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserRepository } from './user.repository.abstract';
import { User } from './user.model';
import { UserEntity } from './entities/user.entity';

/**
 * Esta es la implementación "TypeORM" (Postgres) de nuestro contrato.
 * Se conectará a la base de datos para realizar las operaciones.
 */
@Injectable()
export class TypeOrmUserRepository extends UserRepository {
  
  /**
   * Inyectamos el repositorio oficial de TypeORM para la "UserEntity".
   * Esta es la única clase que hablará directamente con la tabla "users" en Postgres.
   */
  constructor(
    private readonly typeOrmRepository: Repository<UserEntity>,
  ) {
    super();
  }

  /**
   * Implementación del método 'findOneByUsername' usando TypeORM.
   */
  async findOneByUsername(username: string): Promise<User | undefined> {
    const userEntity = await this.typeOrmRepository.findOneBy({ username: username });
    if (!userEntity) {
      return undefined;
    }
    return this.mapEntityToModel(userEntity);
  }

  /**
   * Implementación del método 'findOneByEmail' usando TypeORM.
   */
  async findOneByEmail(email: string): Promise<User | undefined> {
    const userEntity = await this.typeOrmRepository.findOneBy({ email: email });
    if (!userEntity) {
      return undefined;
    }
    return this.mapEntityToModel(userEntity);
  }

  /**
   * Implementación del método 'create' para TypeORM.
   * CORREGIDO: Devuelve Omit<User, 'password'> para coincidir con el contrato.
   */
  async create(userModel: User): Promise<Omit<User, 'password'>> {
    // 1. "Traduce" del Modelo de Dominio (User) a la Entidad (UserEntity)
    const newEntity = this.mapModelToEntity(userModel);

    // 2. Guarda la nueva entidad en la base de datos
    const savedEntity = await this.typeOrmRepository.save(newEntity);

    // 3. "Traduce" la entidad guardada de vuelta al modelo
    const { password, ...result } = this.mapEntityToModel(savedEntity);
    return result;
  }

  /**
   * NUEVO: Implementación del método 'findAll' para TypeORM.
   */
  async findAll(): Promise<User[]> {
    // 1. Busca todas las entidades en la base de datos
    const entities = await this.typeOrmRepository.find();
    
    // 2. Mapea (traduce) cada entidad al modelo de dominio
    return entities.map(this.mapEntityToModel);
  }

  /**
   * Método privado para "traducir" la Entidad (BD) al Modelo (App).
   * CORREGIDO: Mapea entity.password -> model.password
   */
  private mapEntityToModel(entity: UserEntity): User {
    const model = new User();
    
    model.userId = entity.userId;
    model.username = entity.username;
    model.email = entity.email;
    model.fullName = entity.fullName;
    model.isActive = entity.isActive;
    model.roles = entity.roles;
    model.password = entity.password; // Mapea entity.password -> model.password
    
    return model;
  }

  /**
   * Método privado para "traducir" el Modelo (App) a la Entidad (BD).
   * CORREGIDO: Mapea model.password -> entity.password
   */
  private mapModelToEntity(model: User): UserEntity {
    const entity = new UserEntity();

    // No asignamos userId porque es un 'uuid' generado por la BD
    
    entity.username = model.username;
    entity.email = model.email;
    entity.fullName = model.fullName;
    entity.isActive = model.isActive;
    entity.roles = model.roles;
    entity.password = model.password; // Mapea model.password -> entity.password

    return entity;
  }
}
