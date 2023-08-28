import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '@src/common/repository';
import {
  Thread,
  ThreadDocument,
} from '@src/modules/threads/schema/thread.schema';
import mongoose, { Document } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

@Schema()
export class Hashtag extends BaseDocument {
  // @Prop({ ref: 'Thread' })
  // threadId: ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Thread.name,
  })
  threadId: ThreadDocument;

  @Prop({ required: true })
  name: string;
}

export type HashtagDocument = Hashtag & Document;
export const HashtagSchema = SchemaFactory.createForClass(Hashtag);

HashtagSchema.plugin(paginate);
