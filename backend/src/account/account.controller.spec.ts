import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountRepository } from './model/account.repository';
import { AccountService } from './account.service';
import { JwtGuard } from './../user/guard/jwt.guard';
import { PriceInterceptor } from './../config/middlewares/price.interceptor';

describe('Account Controller', () => {
  let controller: AccountController;
  let module: TestingModule;
  let app: INestApplication;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([AccountRepository]),
        UserModule,
        RecordModule
      ],
      exports: [AccountService],
      providers: [AccountService, JwtGuard, PriceInterceptor],
      controllers: [AccountController]
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
