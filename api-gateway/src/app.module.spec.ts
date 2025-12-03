import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { HttpModule } from '@nestjs/axios';

describe('AppModule', () => {
  it('should compile the module', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
    }).compile();

    expect(module).toBeDefined();
  });
});
