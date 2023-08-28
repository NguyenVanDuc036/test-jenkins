import { SettingMention } from '@src/common/enum/setting-mention';

export class SettingDto {
  userId: string;
  profilePrivate?: boolean;
  allowMention?: SettingMention;
  mutedUserId?: string[];
  hiddenWords?: boolean;
  customHiddenWords?: string[];
}
