import {
  Controller,
  Get,
  HttpStatus,
  Res,
  Patch,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { USERS_SCOPE } from '@src/common/constant';
import { BaseResponse } from '@src/common/enum/base-reponse';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrivateAccessGuard } from '../settings/guards/private-account.guard';
import { PortalController } from '@src/common/decorators';

@PortalController({ path: USERS_SCOPE })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  @UseGuards(PrivateAccessGuard)
  async getUserById(@Param('userId') userId: string, @Res() res: Response) {
    const user = await this.usersService.findUserById(userId);
    res.status(HttpStatus.OK).send({
      message: 'User found',
      data: user,
    });
  }

  // @Get()
  // create(@Res() res) {
  //   // const data = this.usersService.find();
  //   return res.status(HttpStatus.OK).send(new BaseResponse({}));
  // }

  @Patch('edit-profile')
  async editProfile(
    @Body() updateUser: UpdateUserDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const update = await this.usersService.editProfile(
      req.user._id,
      updateUser,
    );

    return res.status(HttpStatus.OK).send(new BaseResponse({ data: update }));
  }
}
