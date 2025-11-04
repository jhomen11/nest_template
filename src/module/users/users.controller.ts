import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Endpoint para obtener todos los usuarios (Ruta Protegida por Rol de Admin)
   * GET /users
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Endpoint para que un ADMIN cree un nuevo usuario.
   * POST /users
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createByAdmin(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    // Reutilizamos la misma lógica centralizada en UsersService
    return this.usersService.create(createUserDto);
  }
}