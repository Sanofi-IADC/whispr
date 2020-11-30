import { Module } from '@nestjs/common';
import { DistributionService } from './distribution.service';

@Module({
  providers: [DistributionService],
  exports: [DistributionService],
})
export class DistributionModule {}
