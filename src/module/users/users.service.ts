import { ConflictException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from './user.repository.abstract';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  // Inyectamos UserRepository. readonly es una buena práctica.
  constructor(private readonly usersRepository: UserRepository) {}

  /**
   * Devuelve todos los usuarios sin su contraseña.
   */
  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.findAll();
    // Nos aseguramos de quitar la contraseña de cada usuario
    return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }

  /**
   * Crea un nuevo usuario, manejando validaciones y hasheo de contraseña.
   * @param createUserDto - DTO con los datos para crear el usuario.
   * @returns El usuario creado sin la contraseña.
   */
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // 1. Validar que el usuario o email no existan
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
      userId: uuidv4(),
      password: hashedPassword,
      isActive: true,
      roles: ['user'], // Rol por defecto
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