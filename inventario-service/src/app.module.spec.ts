import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AppModule', () => {
  it('should be defined', () => {
    expect(TypeOrmModule).toBeDefined();
  });
});
