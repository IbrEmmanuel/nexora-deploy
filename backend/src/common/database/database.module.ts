import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

// Suppress Mongoose's unhandled rejection on auth failure
mongoose.connection.on('error', () => {});

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI') ?? '';
        return {
          uri,
          retryAttempts: 0,
          serverSelectionTimeoutMS: 3000,
          connectTimeoutMS: 3000,
          socketTimeoutMS: 5000,
          bufferCommands: false,
          connectionFactory: (connection: mongoose.Connection) => {
            connection.on('connected', () => console.log('MongoDB connected'));
            connection.on('error', (err: Error) =>
              console.warn('[MongoDB] Warning (analytics degraded):', err.message),
            );
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
