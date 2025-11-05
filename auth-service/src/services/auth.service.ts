import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async register(email: string, password: string, nombre: string) {
    const existente = await this.usuarioRepository.findOne({ where: { email } });
    if (existente) {
      throw new ConflictException('El email ya esta registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = this.usuarioRepository.create({
      email,
      password: hashedPassword,
      nombre,
    });

    await this.usuarioRepository.save(usuario);

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET || 'automotriz-secret-key-2024',
      { expiresIn: '24h' }
    );

    return {
      message: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
      },
    };
  }

  async login(email: string, password: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { email } });
    if (!usuario) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET || 'automotriz-secret-key-2024',
      { expiresIn: '24h' }
    );

    return {
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
      },
    };
  }

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'automotriz-secret-key-2024'
      );
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Token invalido');
    }
  }
}
