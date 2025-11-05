import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { InventarioService } from '../services/inventario.service';
import { Producto } from '../entities/producto.entity';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Get()
  async findAll(): Promise<Producto[]> {
    return this.inventarioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Producto> {
    return this.inventarioService.findOne(+id);
  }

  @Post()
  async create(@Body() productoData: Partial<Producto>): Promise<Producto> {
    return this.inventarioService.create(productoData);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() productoData: Partial<Producto>,
  ): Promise<Producto> {
    return this.inventarioService.update(+id, productoData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.inventarioService.delete(+id);
  }

  @Post(':id/stock')
  async actualizarStock(
    @Param('id') id: string,
    @Body('cantidad') cantidad: number,
  ): Promise<Producto> {
    return this.inventarioService.actualizarStock(+id, cantidad);
  }
}
