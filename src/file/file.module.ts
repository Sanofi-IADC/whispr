import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { ConfigModule } from '../config/config.module';
import { AWSCredsModule } from '../auth/aws-creds.module';

@Module({
  imports: [ConfigModule, AWSCredsModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
