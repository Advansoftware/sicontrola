import { Module } from '@nestjs/common';
import { SecretaryService } from './secretary.service';
import { SecretaryController } from './secretary.controller';

@Module({
  controllers: [SecretaryController],
  providers: [SecretaryService],
})
export class SecretaryModule {}
