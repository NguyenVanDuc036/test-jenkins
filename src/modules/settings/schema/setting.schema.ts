import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BreakReminder } from '@src/common/enum/break-reminder';
import { SettingMention } from '@src/common/enum/setting-mention';
import { Document, ObjectId, Types } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

@Schema({
  timestamps: true,
})
export class Setting {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user_id: ObjectId;

  @Prop({ required: true, default: false })
  profile_private: boolean;

  @Prop({ required: true, default: SettingMention.EVERYONE })
  allow_mention: SettingMention;

  @Prop({ default: [] })
  muted_user_id: ObjectId[];

  @Prop({ required: true, default: false })
  hidden_words: boolean;

  @Prop({ required: true, default: false })
  custom_hidden_words: boolean;

  @Prop({ default: [] })
  hidden_words_list: string[];

  @Prop({ default: [] })
  blocked_user_id: ObjectId[];

  @Prop({ required: true, default: false })
  hide_like: boolean;

  @Prop({ required: true, default: false })
  show_alt_text: boolean;

  @Prop({ required: true, default: BreakReminder.NEVER })
  break_reminder: BreakReminder;

  @Prop({ required: true, default: false })
  deactivate_profile: boolean;

  @Prop({ required: true, default: false })
  upload_highest_quality: boolean;
}

export type SettingDocument = Setting & Document;
export const SettingSchema = SchemaFactory.createForClass(Setting);

SettingSchema.plugin(paginate);
