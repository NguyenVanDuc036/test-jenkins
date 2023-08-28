import {
  HttpStatus,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RepositoryProvider } from '@src/common/repository';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseService } from '@src/common/services/base.service';
import { Connection } from 'mongoose';

@Injectable()
export class UsersService extends BaseService<UserDocument> {
  constructor(
    @InjectModel(User.name)
    private userModel,
  ) {
    super(userModel);
  }

  async findUserById(id: string) {
    const isUser = await this.userModel.findById(id);

    return isUser;
  }

  async findUserByEmail(email: string) {
    const isUser = await this.userModel.findOne({ email });

    return isUser;
  }

  async editProfile(userId: string, updateUser: UpdateUserDto) {
    const update = await this.update({ _id: userId }, updateUser, {
      new: true,
    });

    return update;
  }

  async getMyThreads(userId: string) {}
}
