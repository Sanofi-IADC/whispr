import { Module } from '@nestjs/common';
import { AWSCredsService } from './aws-creds.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [AWSCredsService],
  exports: [AWSCredsService]
})
export class AWSCredsModule {}
