import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schema/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONFIG } from '@src/common/configs/env';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from '../users/users.service';
import { Setting, SettingSchema } from '../settings/schema/setting.schema';
import { SettingsService } from '../settings/settings.service';
import { FollowsService } from '../follows/follows.service';
import { Follow, FollowSchema } from '../follows/schema/follows.schema';
import { FacebookStrategy } from './strategies/facebook.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Setting.name, schema: SettingSchema },
      { name: Follow.name, schema: FollowSchema },
    ]),
    PassportModule,
    JwtModule.register({
      secret: JWT_CONFIG.secret,
      signOptions: { expiresIn: JWT_CONFIG.accessTokenExp },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UsersService,
    SettingsService,
    FollowsService,
    FacebookStrategy,
  ],
})
export class AuthModule {}
