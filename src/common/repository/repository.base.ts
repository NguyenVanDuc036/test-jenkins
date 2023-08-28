import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class BaseDocument extends Document {
  @Prop({ default: 'none' })
  state: string;

}

export type DocumentBase = BaseDocument & Document;
export const BaseSchema = SchemaFactory.createForClass(BaseDocument);
