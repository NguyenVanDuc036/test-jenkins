import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schema/user.schema';
import { Model, connection } from 'mongoose';
import { BaseService } from '@src/common/services/base.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ExceptionResponse } from '@src/common/exceptions/response.exception';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JWT_CONFIG } from '@src/common/configs/env';
import * as _ from 'lodash';
import { GenerateToken } from './types/generate-token.type';
import { JwtToken } from './enums/jwt-token.enum';
import { SettingsService } from '../settings/settings.service';
import { verifyTokenFirebase } from '@src/common/firebase';

@Injectable()
export class AuthService extends BaseService<UserDocument> {
  constructor(
    @InjectModel(User.name) private readonly userModel,
    private jwtService: JwtService,
    private userService: UsersService,
    private settingService: SettingsService,
  ) {
    super(userModel);
  }

  verifyTokenAuth(accessToken: string) {
    const decodeToken: any = this.jwtService.decode(accessToken);

    if (!decodeToken)
      throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Invalid token');

    return decodeToken;
  }

  async createToken(payload: any): Promise<GenerateToken> {
    const accessToken = await this.jwtService.signAsync({
      ...payload,
      typeToken: JwtToken.ACCESS_TOKEN,
    });

    const refreshToken = await this.jwtService.signAsync(
      { ...payload, typeToken: JwtToken.REFRESH_TOKEN },
      {
        expiresIn: JWT_CONFIG.refreshTokenExp,
      },
    );

    const result = {
      accessToken,
      refreshToken,
    };

    return result;
  }

  async loginWithGoogle(accessToken: string, fcm_token: string) {
    const payload = this.verifyTokenAuth(accessToken);

    if (!payload.email_verified)
      throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Email not verify');

    const user: UserDocument = await this.userService.findUserByEmail(payload.email);

    if (user) {
      if (!user.fcm_token.includes(fcm_token)) {
        this.update(
          { id: user.id },
          { fcm_token: [...user.fcm_token, fcm_token] },
        );
      }

      return this.createToken(user.toObject());
    }

    const newDoc = {
      avatar: payload.picture,
      email: payload.email,
      fullName: payload.given_name + ' ' + payload.family_name,
      username: payload.name,
      fcm_token: [fcm_token],
    };

    const newUser = await this.create(newDoc);

    await this.settingService.setDefaultSettings(newUser.id);

    return this.createToken(newUser.toObject());
  }

  async loginWithFacebook(accessToken: string, fcm_token: string) {
    const payload = await verifyTokenFirebase(accessToken);
    // const payload = this.verifyTokenAuth(accessToken);

    if (!payload.emailVerified)
      throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Account not verify');

    const user = await this.userService.findUserByEmail(payload.email);

    if (user) {
      if (!user.fcm_token.includes(fcm_token)) {
        this.update(
          { id: user.id },
          { fcm_token: [...user.fcm_token, fcm_token] },
        );
      }

      return await this.createToken(user.toObject());
    }

    const newDoc = {
      avatar: payload.photoURL,
      email: payload.email,
      fullName: payload.displayName,
      username: payload.displayName,
      fcm_token: [fcm_token],
    };

    const newUser = await this.create(newDoc);

    await this.settingService.setDefaultSettings(newUser.id);

    return await this.createToken(newUser.toObject());
  }

  async refreshToken(token: string) {
    const verifyToken = await this.jwtService
      .verifyAsync(token)
      .catch((err) => {
        throw new ExceptionResponse(
          HttpStatus.BAD_REQUEST,
          'Token has expired or invalid',
        );
      });

    if (verifyToken.typeToken !== JwtToken.REFRESH_TOKEN)
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'This is not a refresh token',
      );

    const user = await this.userService
      .findUserById(verifyToken.id)
      .catch((err) => {
        throw new ExceptionResponse(
          HttpStatus.BAD_REQUEST,
          'Invalid token, user not found',
        );
      });

    const newAccessToken = await this.jwtService.signAsync({
      ...user.toObject(),
      typeToken: JwtToken.ACCESS_TOKEN,
    });

    return { accessToken: newAccessToken };
  }
}
