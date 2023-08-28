import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateHashtagDto {
  @IsNotEmpty()
  @IsString()
  threadId: string;

  @IsArray()
  hashtags: string[];
}
