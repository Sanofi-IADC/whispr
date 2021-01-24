import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck, HealthCheckService, MongooseHealthIndicator, HealthCheckResult,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService, private mongo: MongooseHealthIndicator) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([() => this.mongo.pingCheck('mongo')]);
  }
}
