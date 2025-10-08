import { Test, TestingModule } from '@nestjs/testing';
import { CatrgoryService } from './catrgory.service';

describe('CatrgoryService', () => {
  let service: CatrgoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatrgoryService],
    }).compile();

    service = module.get<CatrgoryService>(CatrgoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
