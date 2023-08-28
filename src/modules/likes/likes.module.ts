import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from './schema/likes.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }])],
    controllers: [LikesController],
    providers: [LikesService],
})
export class LikesModule { }
