import {
  HttpStatus,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CatchException,
  ExceptionResponse,
} from '@src/common/exceptions/response.exception';
import { BaseService } from '@src/common/services/base.service';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { PaginateModel } from 'mongoose';
import { Follow, FollowDocument } from './schema/follows.schema';

@Injectable()
export class FollowsService extends BaseService<FollowDocument> {
  constructor(
    @InjectModel(Follow.name)
    private followModel: PaginateModel<FollowDocument>,
  ) {
    super(followModel);
  }

  async findFollowing(followedId: string) {
    return await this.followModel.findOne({
      followedId: this.parseObjectId(followedId),
    });
  }

  async findFollowed(userId: string) {
    return await this.followModel.findOne({
      userId: this.parseObjectId(userId),
    });
  }

  async checkFollowing(userId: string, followedId: string) {
    const result = await this.followModel.findOne({
      userId: this.parseObjectId(userId),
      followedId: this.parseObjectId(followedId),
    });
    return result ? true : false;
  }

  async delete(_id: string) {
    return await this.followModel.deleteOne({ _id: this.parseObjectId(_id) });
  }

  parseObjectId(_id: string) {
    return new mongoose.Types.ObjectId(_id);
  }
}
