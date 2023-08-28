import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '@src/common/repository';
import mongoose, { Document } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { TypeUser } from '../users.enum';
import * as _ from 'lodash';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: _.camelCase(User.name) + 's',
})
export class User extends BaseDocument {
  @Prop({ type: String, required: true })
  username: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({
    type: String,
    trim: true,
    default: 'https://i.imgur.com/Uoeie1w.jpg',
  })
  avatar: string;

  @Prop({
    type: String,
    trim: true,
    required: false,
    default: null,
  })
  bio: string;

  @Prop({ type: String, required: false, default: null })
  link: string;

  @Prop({ type: String, required: true, default: TypeUser.PUBLIC })
  type: TypeUser;

  @Prop({ type: String, required: false, default: null })
  fcm_token: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(paginate);
