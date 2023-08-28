// facebook.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { AuthService } from '../auth.service'; // You'll create this service to handle authentication.
import { FB_CONFIG } from '@src/common/configs/env';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {
    super({
      clientID: FB_CONFIG.clientId,
      clientSecret: FB_CONFIG.secret,
      callbackURL: 'http://localhost:3000/api/v1/auth/facebook/callback', // Adjust this URL accordingly.
      profileFields: ['id', 'emails', 'displayName', 'photos'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    // This method is called after the user is authenticated by Facebook.
    // You should use the profile data to find or create a user in your database.
    const user = profile;

    console.log(user);

    // Pass the user to Passport for authentication.
    done(null, user);
  }
}
