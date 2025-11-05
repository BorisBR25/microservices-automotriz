import { Controller, Post, Body } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  private authServiceUrl: string;

  constructor(private httpService: HttpService) {
    this.authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
  }

  @Public()
  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('nombre') nombre: string,
  ) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/register`, {
        email,
        password,
        nombre,
      })
    );
    return response.data;
  }

  @Public()
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/login`, {
        email,
        password,
      })
    );
    return response.data;
  }
}
