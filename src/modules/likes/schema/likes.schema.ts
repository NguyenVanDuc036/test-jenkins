import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '@src/common/repository';
import mongoose, { Document } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class Like {

    @Prop({ index: true })
    postId: mongoose.Schema.Types.ObjectId

    @Prop({})
    userLikeId: mongoose.Schema.Types.ObjectId

}

export type LikeDocument = Like & Document;
export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.plugin(paginate);
