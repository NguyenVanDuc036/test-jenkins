import { TypeUser } from '../users.enum';
import { CreateUserDto } from './create-user.dto';
import { PartialType, OmitType } from '@nestjs/swagger';

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  '_id',
  'email',
]) {}
