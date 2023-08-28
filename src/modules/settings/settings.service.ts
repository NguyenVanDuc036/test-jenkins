import { Injectable } from '@nestjs/common';
import { Setting, SettingDocument } from './schema/setting.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CatchException } from '@src/common/exceptions/response.exception';
import mongoose, { Types } from 'mongoose';
import { BreakReminder } from '@src/common/enum/break-reminder';
import { SettingMention } from '@src/common/enum/setting-mention';
import { SETTING_MESSAGES } from '@src/common/constant/setting-messages';
import { FollowsService } from '../follows/follows.service';
import { badWords } from '@src/common/constant/bad-words';

const ObjectId = Types.ObjectId;

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name)
    private setting: Model<SettingDocument>,
    private followService: FollowsService,
  ) {}

  async getUserSetting(user_id: string) {
    return await this.setting.findOne({ user_id });
  }

  async setDefaultSettings(user_id: string) {
    return await this.setting.findOneAndUpdate(
      { user_id },
      {
        $setOnInsert: {
          user_id,
        },
        $set: {
          profile_private: false,
          allow_mention: SettingMention.EVERYONE,
          hidden_words: false,
          hide_like: false,
          show_alt_text: false,
          break_reminder: BreakReminder.NEVER,
          upload_highest_quality: false,
          updated_at: '$$NOW',
        },
      },
      { upsert: true, returnDocument: 'after' },
    );
  }

  async setProfilePrivate(user_id: string, status: boolean) {
    return await this.setting.findOneAndUpdate(
      { user_id },
      [
        {
          $set: {
            profile_private: status,
            updated_at: '$$NOW',
          },
        },
      ],
      { returnDocument: 'after' },
    );
  }

  async setAllowMention(user_id: string, allow_mention: string) {
    return await this.setting.findOneAndUpdate(
      { user_id },
      {
        $set: {
          allow_mention,
          updated_at: '$$NOW',
        },
      },
      { returnDocument: 'after' },
    );
  }

  async mutedUser(user_id: string, muted_user_id: string) {
    return await this.setting.findOneAndUpdate(
      { user_id },
      {
        $push: {
          muted_user_id: new ObjectId(muted_user_id),
          updated_at: '$$NOW',
        },
      },
      { returnDocument: 'after' },
    );
  }

  async unmutedUser(user_id: string, muted_user_id: string) {
    return await this.setting.findOneAndUpdate(
      { user_id },
      {
        $pull: {
          muted_user_id: new ObjectId(muted_user_id),
          updated_at: '$$NOW',
        },
      },
      { returnDocument: 'after' },
    );
  }

  async setHiddenWords(user_id: string, status: boolean) {
    return await this.setting.findOneAndUpdate(
      { user_id },
      {
        $set: {
          hidden_words: status,
          updated_at: '$$NOW',
        },
      },
      { returnDocument: 'after' },
    );
  }

  async setCustomHiddenWords(user_id: string, status: boolean) {
    return await this.setting.findOneAndUpdate(
      { user_id },
      {
        $set: {
          custom_hidden_words: status,
          updated_at: '$$NOW',
        },
      },
      { returnDocument: 'after' },
    );
  }

  async addHiddenWords(user_id: string, hidden_words: string) {
    const hidden_words_list = hidden_words.split(',');
    return await this.setting.findOneAndUpdate(
      { user_id },
      {
        $push: {
          hidden_words_list: { $each: hidden_words_list },
          updated_at: '$$NOW',
        },
      },
      { returnDocument: 'after' },
    );
  }

  async removeHiddenWords(user_id: string, hidden_word: string) {
    return await this.setting.findOneAndUpdate(
      { user_id },
      {
        $pull: {
          hidden_words_list: hidden_word,
          updated_at: '$$NOW',
        },
      },
      { returnDocument: 'after' },
    );
  }

  async blockUser(user_id: string, blocked_user_id: string) {
    return await this.setting.findOneAndUpdate(
      { user_id },
      {
        $push: {
          blocked_user_id: new ObjectId(blocked_user_id),
          updated_at: '$$NOW',
        },
      },
      { returnDocument: 'after' },
    );
  }

  async unBlockUser(user_id: string, blocked_user_id: string) {
    return await this.setting.findOneAndUpdate(
      { user_id },
      {
        $pull: {
          blocked_user_id: new ObjectId(blocked_user_id),
          updated_at: '$$NOW',
        },
      },
      { returnDocument: 'after' },
    );
  }

  async setHideLike(user_id: string, status: boolean) {
    return await this.setting.findOneAndUpdate(
      { user_id },
      {
        $set: {
          hide_like: status,
          updated_at: '$$NOW',
        },
      },
      { returnDocument: 'after' },
    );
  }

  async setShowAltText(user_id: string, status: boolean) {
    return await this.setting.findOneAndUpdate(
      { user_id },
      {
        $set: {
          show_alt_text: status,
          updated_at: '$$NOW',
        },
      },
      { returnDocument: 'after' },
    );
  }

  async setBreakReminder(user_id: string, break_reminder: string) {
    return await this.setting.findOneAndUpdate(
      { user_id },
      {
        $set: {
          break_reminder,
          updated_at: '$$NOW',
        },
      },
      { returnDocument: 'after' },
    );
  }

  async deactivateProfile(user_id: string) {
    return await this.setting.findOneAndUpdate(
      { user_id },
      {
        $set: {
          deactivate_profile: true,
          updated_at: '$$NOW',
        },
      },
    );
  }

  async setUploadHighestQuality(user_id: string, status: boolean) {
    return await this.setting.findOneAndUpdate(
      { user_id },
      {
        $set: {
          upload_highest_quality: status,
          updated_at: '$$NOW',
        },
      },
      { returnDocument: 'after' },
    );
  }

  async checkAccessAccount(user_id: string, account_id: string) {
    // TODO: Check if user has followed the private account
    const userSetting = await this.getUserSetting(user_id);
    const checkBlocked = userSetting.blocked_user_id.includes(
      new mongoose.Schema.Types.ObjectId(user_id),
    );
    const checkFollowing = this.followService.checkFollowing(
      user_id,
      account_id,
    );
    if (
      (userSetting.profile_private &&
        account_id !== user_id &&
        checkBlocked &&
        !checkFollowing) ||
      userSetting.deactivate_profile
    )
      return false;

    return true;
  }

  async checkAccessMention(mentions: string[], user_id: string) {
    const userSettings = await this.setting.find({
      user_id: { $in: mentions },
      allow_mention: SettingMention.NO_ONE || SettingMention.FOLLOWING,
    });

    if (userSettings.length > 0) {
      userSettings.forEach((userSetting) => {
        const checkBlocked = userSetting.blocked_user_id.includes(
          new mongoose.Schema.Types.ObjectId(user_id),
        );
        const checkSettingNoOne =
          userSetting.allow_mention === SettingMention.NO_ONE;
        const checkFollowing = this.followService.checkFollowing(
          user_id,
          userSetting.user_id.toString(),
        );
        if (checkBlocked || checkSettingNoOne || !checkFollowing) {
          throw new CatchException(SETTING_MESSAGES.MENTION_USER_FAILED);
        }
      });
    }

    return true;
  }

  async getMutedUserId(user_id: string) {
    const userSetting = await this.getUserSetting(user_id);
    return userSetting.muted_user_id;
  }

  async getBlockedUserId(user_id: string) {
    const userSetting = await this.getUserSetting(user_id);
    return userSetting.blocked_user_id;
  }

  public async getMutedBlockedUser(userId: string) {
    const muted_user_id_list = await this.getMutedUserId(userId);

    const blocked_user_id_list = await this.getBlockedUserId(userId);

    const merge_list = [
      ...new Set([...muted_user_id_list, ...blocked_user_id_list]),
    ];

    return merge_list;
  }

  public replaceWords = (text: string) => {
    const regexPattern = new RegExp(badWords.join('|'), 'gi');
    const replacement = '****';

    return text.replace(regexPattern, replacement);
  };

  public replaceCustomWords = (text: string, hidden_words_list: string[]) => {
    const regexPattern = new RegExp(hidden_words_list.join('|'), 'gi');
    const replacement = '****';

    return text.replace(regexPattern, replacement);
  };
}
