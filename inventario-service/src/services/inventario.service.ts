import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';

@Injectable()
export class InventarioService implements OnModuleInit {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async onModuleInit() {
    await this.inicializarProductos();
  }

  private async inicializarProductos() {
    const count = await this.productoRepository.count();
    if (count === 0) {
      const productos = [
        {
          nombre: 'Filtro de Aceite Premium',
          codigo: 'FLT-001',
          categoria: 'Filtros',
          stock: 50,
          precio: 25.99,
          descripcion: 'Filtro de aceite compatible con motores 4 cilindros',
        },
        {
          nombre: 'Pastillas de Freno Delanteras',
          codigo: 'FRN-002',
          categoria: 'Frenos',
          stock: 30,
          precio: 89.99,
          descripcion: 'Pastillas de freno ceramicas para vehiculos compactos',
        },
        {
          nombre: 'Bateria 12V 60Ah',
          codigo: 'BAT-003',
          categoria: 'Electricidad',
          stock: 15,
          precio: 150.00,
          descripcion: 'Bateria libre de mantenimiento 12 voltios',
        },
        {
          nombre: 'Amortiguadores Traseros',
          codigo: 'AMR-004',
          categoria: 'Suspension',
          stock: 20,
          precio: 220.00,
          descripcion: 'Par de amortiguadores hidraulicos para suspension trasera',
        },
        {
          nombre: 'Bujias de Platino',
          codigo: 'BUJ-005',
          categoria: 'Motor',
          stock: 100,
          precio: 35.00,
          descripcion: 'Set de 4 bujias de platino larga duracion',
        },
        {
          nombre: 'Radiador de Aluminio',
          codigo: 'RAD-006',
          categoria: 'Refrigeracion',
          stock: 10,
          precio: 180.00,
          descripcion: 'Radiador de aluminio alta eficiencia',
        },
        {
          nombre: 'Discos de Freno',
          codigo: 'FRN-007',
          categoria: 'Frenos',
          stock: 25,
          precio: 120.00,
          descripcion: 'Par de discos de freno ventilados',
        },
        {
          nombre: 'Correa de Distribucion',
          codigo: 'COR-008',
          categoria: 'Motor',
          stock: 40,
          precio: 65.00,
          descripcion: 'Correa de distribucion reforzada',
        },
      ];

      await this.productoRepository.save(productos);
      console.log('Productos de ejemplo inicializados en la base de datos');
    }
  }

  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find();
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async create(productoData: Partial<Producto>): Promise<Producto> {
    const producto = this.productoRepository.create(productoData);
    return this.productoRepository.save(producto);
  }

  async update(id: number, productoData: Partial<Producto>): Promise<Producto> {
    await this.findOne(id);
    await this.productoRepository.update(id, productoData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
  }

  async actualizarStock(id: number, cantidad: number): Promise<Producto> {
    const producto = await this.findOne(id);
    producto.stock += cantidad;
    return this.productoRepository.save(producto);
  }
}
