import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Thread, ThreadDocument } from '@src/modules/threads/schema/thread.schema';
import mongoose from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

@Schema()
export class File {
  // @Prop({ ref: 'Thread' })
  // threadId: ObjectId[];
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Thread.name,
  })
  threadId: ThreadDocument;
ˇ
  @Prop({ required: true })
  src: string;

  @Prop({ required: true })
  publicId: string;
}

export type FileDocument = File & Document;
export const FileSchema = SchemaFactory.createForClass(File);

FileSchema.plugin(paginate);
