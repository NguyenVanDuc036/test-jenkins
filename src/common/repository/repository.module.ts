import { Global, Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { RepositoryProvider } from './repository.provider';
import { User, UserSchema } from '@src/modules/users/schema/user.schema';
import { Like, LikeSchema } from '@src/modules/likes/schema/likes.schema';
import {
  Thread,
  ThreadSchema,
} from '@src/modules/threads/schema/thread.schema';
import {
  Hashtag,
  HashtagSchema,
} from '@src/modules/hashtags/schema/hashtag.schema';
import { File, FileSchema } from '@src/modules/files/schema/file.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Thread.name, schema: ThreadSchema },
      { name: Hashtag.name, schema: HashtagSchema },
      { name: File.name, schema: FileSchema },
    ]),
  ],
  providers: [RepositoryProvider],
  exports: [RepositoryProvider],
})
export class RepositoryModule {}
