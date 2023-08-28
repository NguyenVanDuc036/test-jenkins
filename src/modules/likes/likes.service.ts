import { HttpStatus, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { CatchException, ExceptionResponse } from '@src/common/exceptions/response.exception';
import { RepositoryProvider } from '@src/common/repository';
import { createLikeDTO } from './dto/create-like.dto';
import { BaseService } from '@src/common/services/base.service';
import { Like, LikeDocument } from './schema/likes.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { PaginateModel } from 'mongoose';

@Injectable()
export class LikesService extends BaseService<LikeDocument>{
    constructor(
        private repository: RepositoryProvider,
        @InjectModel(Like.name) private likeModel: PaginateModel<LikeDocument>,

    ) {
        super(likeModel)
    }

    async delete(_id: string) {
        return await this.likeModel.deleteOne({ _id: this.parseObjectId(_id) })
    }

    parseObjectId(_id: string) {
        return new mongoose.Types.ObjectId(_id)
    }
}
