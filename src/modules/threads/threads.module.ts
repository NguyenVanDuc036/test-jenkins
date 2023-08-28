import { Module } from '@nestjs/common';
import { ThreadService } from './threads.service';
import { ThreadGateway } from './threads.gateway';
import { ThreadController } from './threads.controller';
import { HashtagService } from '../hashtags/hashtags.service';
import { FilesService } from '../files/files.service';
import { CloudinaryService } from '@src/common/cloudinary/provider';
import { SettingsService } from '../settings/settings.service';
import { LikesService } from '../likes/likes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Setting, SettingSchema } from '../settings/schema/setting.schema';
import { Follow, FollowSchema } from '../follows/schema/follows.schema';
import { FollowsService } from '../follows/follows.service';
import { Like, LikeSchema } from '../likes/schema/likes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Setting.name, schema: SettingSchema },
      { name: Follow.name, schema: FollowSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
  ],
  providers: [
    ThreadGateway,
    ThreadService,
    HashtagService,
    FilesService,
    CloudinaryService,
    SettingsService,
    LikesService,
    FollowsService,
  ],
  controllers: [ThreadController],
})
export class ThreadsModule {}
