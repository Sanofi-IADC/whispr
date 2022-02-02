import { ExtractJwt, Strategy } from '@mestrak/passport-multi-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super(
      configService.getAuthConfig()
    );
  }

  async validate(payload: any) {
    return payload;
  }
}