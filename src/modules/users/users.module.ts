import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { FollowsService } from '../follows/follows.service';
import { Follow, FollowSchema } from '../follows/schema/follows.schema';
import { SettingsService } from '../settings/settings.service';
import { Setting, SettingSchema } from '../settings/schema/setting.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Follow.name, schema: FollowSchema },
      { name: Setting.name, schema: SettingSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, FollowsService, SettingsService],
})
export class UsersModule {}
