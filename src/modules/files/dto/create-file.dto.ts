import { IsString } from 'class-validator';

export class CreateFileDto {
  @IsString()
  threadId: string;

  @IsString()
  src: string;

  @IsString()
  publicId: string;
}
