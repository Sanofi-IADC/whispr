import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    PassportModule, ConfigModule,
    JwtModule.register({
      secret: 'some_secret_thing',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
