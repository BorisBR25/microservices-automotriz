import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './controllers/auth.controller';
import { InventarioController } from './controllers/inventario.controller';
import { HealthController } from './controllers/health.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [HttpModule],
  controllers: [AuthController, InventarioController, HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
