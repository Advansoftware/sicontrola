import { Module } from '@nestjs/common';
import { RefuelsService } from './refuels.service';
import { RefuelsController } from './refuels.controller';

@Module({
  controllers: [RefuelsController],
  providers: [RefuelsService],
})
export class RefuelsModule {}
