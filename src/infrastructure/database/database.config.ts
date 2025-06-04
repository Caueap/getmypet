import { ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const databaseConfig: MongooseModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const dbConnectionString = configService.get<string>('DATABASE_URI') || '';
    const password = configService.get<string>('DATABASE_PASSWORD') || '';

    if (!dbConnectionString) {
      throw new Error('Database connection string not found in environment variables');
    }

    const uri = dbConnectionString.replace('<DATABASE_PASSWORD>', password);

    return {
      uri,
    };
  },
}; 