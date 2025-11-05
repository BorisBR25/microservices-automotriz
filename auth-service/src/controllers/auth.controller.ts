import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('nombre') nombre: string,
  ) {
    return this.authService.register(email, password, nombre);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(email, password);
  }

  @Post('validate')
  async validate(@Body('token') token: string) {
    return this.authService.validateToken(token);
  }
}
