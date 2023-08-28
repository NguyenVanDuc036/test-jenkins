import { Module } from '@nestjs/common';
import { HashtagService } from './hashtags.service';

@Module({
  providers: [HashtagService],
})
export class HashtagsModule {}
