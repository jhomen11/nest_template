// src/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller'; // 1. Importar el controlador
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';

import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule, // Ya no necesitamos forwardRef si UsersModule no importa AuthModule
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController], 
  providers: [
    AuthService, 
    LocalStrategy,
    JwtStrategy
  ],
  exports: [AuthService, JwtModule], // Exportamos JwtModule para que los guards puedan usarlo en otros módulos
})
export class AuthModule {}