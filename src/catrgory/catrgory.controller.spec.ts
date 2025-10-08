import { Test, TestingModule } from '@nestjs/testing';
import { CatrgoryController } from './catrgory.controller';

describe('CatrgoryController', () => {
  let controller: CatrgoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatrgoryController],
    }).compile();

    controller = module.get<CatrgoryController>(CatrgoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
