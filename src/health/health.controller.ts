import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService, private mongo: MongooseHealthIndicator) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.mongo.pingCheck('mongo')]);
  }
}
