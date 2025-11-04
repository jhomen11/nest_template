import { ConflictException, Injectable, Logger,
  OnModuleInit, } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from './user.repository.abstract';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  // Inyectamos UserRepository. readonly es una buena práctica.
  constructor(private readonly usersRepository: UserRepository) {}

  async onModuleInit() {
    this.logger.log(
      'Verificando la existencia del usuario administrador por defecto...',
    );

    // Leemos las variables de entorno
    const adminUsername = process.env.DEFAULT_ADMIN_USER;
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
    const adminPass = process.env.DEFAULT_ADMIN_PASS;
    const adminFullName = process.env.DEFAULT_ADMIN_FULLNAME;

    // Validamos que las variables existan
    if (!adminUsername || !adminEmail || !adminPass || !adminFullName) {
      this.logger.warn(
        'Faltan variables de entorno para el admin por defecto. Saltando creación.',
      );
      this.logger.warn(
        'Asegúrate de tener DEFAULT_ADMIN_USER, DEFAULT_ADMIN_PASS, etc., en tu .env',
      );
      return;
    }

    // Verificamos si el admin ya existe
    const existingAdmin =
      (await this.usersRepository.findOneByUsername(adminUsername)) ||
      (await this.usersRepository.findOneByEmail(adminEmail));

    if (existingAdmin) {
      this.logger.log(
        'El usuario administrador por defecto ya existe. Saltando creación.',
      );
      return;
    }

    // Si no existe, lo creamos
    this.logger.log('Usuario administrador no encontrado. Creando...');
    try {
      const adminDto: CreateUserDto = {
        username: adminUsername,
        password: adminPass,
        email: adminEmail,
        fullName: adminFullName,
      };

      // Llamamos a nuestro método 'create' modificado con los roles de admin
      await this.create(adminDto, ['admin', 'user']);

      this.logger.log(
        'Usuario administrador por defecto creado exitosamente.',
      );
    } catch (error) {
      if (error instanceof ConflictException) {
        this.logger.warn(
          'Carrera de condiciones detectada: El admin ya existe.',
        );
      } else {
        this.logger.error(
          'Error fatal al crear el usuario administrador por defecto.',
          error.stack,
        );
      }
    }
  }

  /**
   * Devuelve todos los usuarios sin su contraseña.
   */
  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.findAll();
    return users.map((user) => {
      const { password, ...result } = user;
      return result;
    });
  }

  /**
   * Crea un nuevo usuario, manejando validaciones y hasheo de contraseña.
   * Ahora acepta un array de roles opcional.
   */
  async create(
    createUserDto: CreateUserDto,
    roles: string[] = ['user'], // <-- Parámetro de roles (default 'user')
  ): Promise<Omit<User, 'password'>> {
    // 1. Validaciones
    const existingUserByUsername = await this.usersRepository.findOneByUsername(
      createUserDto.username,
    );
    if (existingUserByUsername) {
      throw new ConflictException('El nombre de usuario ya existe');
    }

    const existingUserByEmail = await this.usersRepository.findOneByEmail(
      createUserDto.email,
    );
    if (existingUserByEmail) {
      throw new ConflictException('El email ya está en uso');
    }

    // 2. Hashear la contraseña
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // 3. Construir el objeto de nuevo usuario
    const newUser: User = {
      ...createUserDto,
      userId: null, // <-- Dejamos que la BD genere el ID (soluciona el error de TS)
      password: hashedPassword,
      isActive: true,
      roles: roles, // <-- Usamos el parámetro de roles
    };

    // 4. Persistir el usuario usando el repositorio y devolver el resultado
    return this.usersRepository.create(newUser);
  }

  /**
   * Valida a un usuario por nombre de usuario y contraseña.
   * Usado por la estrategia de autenticación local (login).
   * @param username El nombre de usuario a validar.
   * @param pass La contraseña a comparar.
   * @returns El objeto de usuario sin la contraseña si es válido, de lo contrario null.
   */
  async validateUser(
    username: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersRepository.findOneByUsername(username);

    if (!user) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(pass, user.password);

    if (passwordMatches) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}