import { IsNotEmpty, IsString } from 'class-validator';
import { OmitType } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  fcm_token: string;
}

export class RefreshToken extends OmitType(LoginDto, ['fcm_token']) {}
