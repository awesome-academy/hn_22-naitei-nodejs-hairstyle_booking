import { Test, TestingModule } from '@nestjs/testing';
import { StylistController } from './stylist.controller';
import { StylistService } from './stylist.service';

describe('StylistController', () => {
  let controller: StylistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StylistController],
      providers: [StylistService],
    }).compile();

    controller = module.get<StylistController>(StylistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
