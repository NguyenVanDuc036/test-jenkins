import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { SettingsService } from '../settings.service';

@Injectable()
export class PrivateAccessGuard implements CanActivate {
  constructor(
    @Inject(SettingsService) private settingService: SettingsService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | boolean | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.settingService.checkAccessAccount(user.id, request.params.id);
  }
}
