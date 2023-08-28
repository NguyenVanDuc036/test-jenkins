import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SettingsService } from '../settings.service';

@Injectable()
export class AccessMention implements CanActivate {
  constructor(private readonly settingMention: SettingsService) {}

  canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | Observable<boolean> | boolean {
    const request = context.switchToHttp().getRequest();
    const mention_list = request.body.mention;
    const user_id = request.user._id;

    return this.settingMention.checkAccessMention(mention_list, user_id);
  }
}
