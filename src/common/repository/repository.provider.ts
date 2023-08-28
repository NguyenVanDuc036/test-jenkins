import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from '@src/modules/likes/schema/likes.schema';
import { User, UserDocument } from '@src/modules/users/schema/user.schema';
import { Model } from 'mongoose';
import {
  Thread,
  ThreadDocument,
} from '@src/modules/threads/schema/thread.schema';
import { Hashtag } from '@src/modules/hashtags/schema/hashtag.schema';
import { File, FileDocument } from '@src/modules/files/schema/file.schema';

@Injectable()
export class RepositoryProvider {
  constructor(
    @InjectModel(User.name)
    public userRepository: Model<UserDocument>,
    @InjectModel(Like.name)
    public likeRepository: Model<LikeDocument>,
    @InjectModel(Thread.name)
    public threadRepository: Model<ThreadDocument>,
    @InjectModel(Hashtag.name)
    public hashtagRepository: Model<Hashtag>,
    @InjectModel(File.name)
    public fileRepository: Model<FileDocument>,
  ) {}
}
