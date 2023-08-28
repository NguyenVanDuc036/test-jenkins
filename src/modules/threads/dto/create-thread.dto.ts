import { ThreadType } from '@src/common/enum/thread.enum';
import { ThreadState } from '@src/common/enum/thread.enum';
import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class DetailThreadType {
  @IsString()
  userId?: string;

  @IsString()
  parentId?: string;

  @IsString()
  threadId?: string;

  @IsString()
  content?: string;

  @IsString()
  link?: string;

  @IsNotEmpty()
  @IsString()
  type: ThreadType;

  @IsString()
  state?: ThreadState;

  @IsBoolean()
  isLikeCount?: boolean;

  @IsArray()
  hashtags: string[];

  @IsArray()
  mentions: string[];
}

export class DataReceiveDto {
  @IsNotEmpty()
  @IsString()
  data: string;
}
