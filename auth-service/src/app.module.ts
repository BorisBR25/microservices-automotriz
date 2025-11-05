import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { HealthController } from './controllers/health.controller';
import { AuthService } from './services/auth.service';
import { Usuario } from './entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Usuario],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([Usuario]),
  ],
  controllers: [AuthController, HealthController],
  providers: [AuthService],
})
export class AppModule {}
