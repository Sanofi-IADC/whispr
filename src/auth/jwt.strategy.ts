/* eslint-disable class-methods-use-this */
import { Strategy } from '@sanofi-iadc/passport-multi-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super(configService.getAuthConfig());
  }

  validate(payload: any) {
    return payload;
  }
}
