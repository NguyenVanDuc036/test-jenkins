import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Setting, SettingSchema } from './schema/setting.schema';
import { FollowsService } from '../follows/follows.service';
import { Follow, FollowSchema } from '../follows/schema/follows.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Setting.name, schema: SettingSchema },
      { name: Follow.name, schema: FollowSchema },
    ]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService, FollowsService],
})
export class SettingsModule {}
