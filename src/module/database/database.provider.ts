import { Logger, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const logger = new Logger('DatabaseProviders');

export const databaseProviders: Provider[] = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      try {
        logger.log('Creando pool de conexiones para la base de datos...');
        const options: DataSourceOptions = {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT', 5432),
          database: configService.get<string>('DB_NAME'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          schema: configService.get<string>('DB_SCHEMA', 'template'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: configService.get<string>('NODE_ENV') !== 'production',
          poolSize: configService.get<number>('DB_POOL_SIZE', 10), // Tamaño del pool
        };
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        logger.log('Pool de conexiones a la base de datos creado exitosamente.');
        return dataSource;
      } catch (error) {
        logger.error('Error al crear el pool de conexiones:', error);
        throw error;
      }
    },
  },
];
