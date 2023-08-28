import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ThreadsModule } from './threads/threads.module';
import { UsersModule } from './users/users.module';
import { LikesModule } from './likes/likes.module';
import { SettingsModule } from './settings/settings.module';
import { FollowsModule } from './follows/follows.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ThreadsModule,
    LikesModule,
    SettingsModule,
    FollowsModule,
  ],
})
export class ModulesModule { }
