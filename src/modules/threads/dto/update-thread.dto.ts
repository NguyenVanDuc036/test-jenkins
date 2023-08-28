import { ThreadState } from '@src/common/enum/thread.enum';
import { IsBoolean, IsString } from 'class-validator';

export class UpdateThreadDto {
  @IsString()
  state?: ThreadState;

  @IsBoolean()
  isLikeCount?: boolean;
}
