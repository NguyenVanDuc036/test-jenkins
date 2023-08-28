import { Types } from 'mongoose';
import { TypeUser } from '../users.enum';
import { IsEnum } from 'class-validator';

export class CreateUserDto {
  _id?: string | Types.ObjectId;

  username: string;

  email: string;

  fullName: string;

  avatar: string;

  bio?: string;

  link?: string;

  @IsEnum(TypeUser)
  type?: TypeUser;

  fcm_token?: string;
}
