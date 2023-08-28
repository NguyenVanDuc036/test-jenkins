import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ThreadState, ThreadType } from '@src/common/enum/thread.enum';
import * as paginate from 'mongoose-paginate-v2';

@Schema({
  timestamps: true,
})
export class Thread {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: String, default: null })
  parentId: string;

  @Prop({ type: String })
  content: string;

  @Prop({ type: String })
  link: string;

  @Prop({ required: true })
  type: ThreadType;

  @Prop({ default: ThreadState.ANYONE })
  state: string;

  @Prop({ default: true })
  isHideLike: boolean;

  @Prop()
  mentions: string[];

  @Prop({ default: true })
  status: boolean;
}

export type ThreadDocument = Thread & Document;
export const ThreadSchema = SchemaFactory.createForClass(Thread);

ThreadSchema.plugin(paginate);
