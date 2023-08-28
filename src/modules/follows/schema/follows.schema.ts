import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '@src/common/repository';
import mongoose, { Document } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class Follow {

    @Prop()
    userId: mongoose.Schema.Types.ObjectId

    @Prop({ index: true })
    followedId: mongoose.Schema.Types.ObjectId

}

export type FollowDocument = Follow & Document;
export const FollowSchema = SchemaFactory.createForClass(Follow);

FollowSchema.plugin(paginate);
