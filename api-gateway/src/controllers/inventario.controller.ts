import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Public } from '../decorators/public.decorator';

@Controller('inventario')
export class InventarioController {
  private inventarioServiceUrl: string;

  constructor(private httpService: HttpService) {
    this.inventarioServiceUrl = process.env.INVENTARIO_SERVICE_URL || 'http://localhost:3004';
  }

  @Public()
  @Get()
  async findAll() {
    const response = await firstValueFrom(
      this.httpService.get(`${this.inventarioServiceUrl}/inventario`)
    );
    return response.data;
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.inventarioServiceUrl}/inventario/${id}`)
    );
    return response.data;
  }

  @Post()
  async create(@Body() productoData: any) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.inventarioServiceUrl}/inventario`, productoData)
    );
    return response.data;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() productoData: any) {
    const response = await firstValueFrom(
      this.httpService.put(`${this.inventarioServiceUrl}/inventario/${id}`, productoData)
    );
    return response.data;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const response = await firstValueFrom(
      this.httpService.delete(`${this.inventarioServiceUrl}/inventario/${id}`)
    );
    return response.data;
  }
}
