import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AUTH_SCOPE } from '@src/common/constant';
import { BaseResponse } from '@src/common/enum/base-reponse';
import { LoginDto, RefreshToken } from './dtos/login.dto';
import { PortalController } from '@src/common/decorators';
import { GetUserByAccessToken } from '@src/common/decorators/user.decorator';
import { IsNotAuth } from '@src/common/decorators/isNotAuth.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@PortalController({ path: AUTH_SCOPE })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsNotAuth()
  @Post('login/google')
  async loginWithGoogle(@Body() body: LoginDto, @Res() res: Response) {
    const createToken = await this.authService.loginWithGoogle(
      body.token,
      body.fcm_token,
    );

    return res
      .status(HttpStatus.OK)
      .send(new BaseResponse({ data: createToken }));
  }

  @IsNotAuth()
  @Post('login/facebook')
  @UseGuards(AuthGuard('facebook'))
  async loginWithFacebook(@Body() body: LoginDto, @Res() res: Response) {
    const token = await this.authService.loginWithFacebook(
      body.token,
      body.fcm_token,
    );

    return res.status(HttpStatus.OK).send(new BaseResponse({ data: token }));
  }

  @Get('profile')
  getProfile(@GetUserByAccessToken() user) {
    return user;
  }

  @IsNotAuth()
  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshToken, @Res() res: Response) {
    const newAccessToken = await this.authService.refreshToken(body.token);

    return res
      .status(HttpStatus.OK)
      .send(new BaseResponse({ data: newAccessToken }));
  }
}
