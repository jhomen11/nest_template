import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { UsersModule } from './module/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './module/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigModule esté disponible globalmente
    }),
    DatabaseModule, // Módulo de configuración de la base de datos
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
