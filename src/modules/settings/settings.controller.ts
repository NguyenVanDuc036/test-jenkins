import {
  Controller,
  Res,
  HttpStatus,
  Param,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { SETTINGS_SCOPE } from '@src/common/constant';
import { SettingsService } from './settings.service';
import { GetUserByAccessToken } from '@src/common/decorators/user.decorator';
import { SETTING_MESSAGES } from '@src/common/constant/setting-messages';
import { stat } from 'fs';

@Controller(SETTINGS_SCOPE)
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Patch('/set-all-default')
  async resetDefaultSetting(@GetUserByAccessToken() user, @Res() res) {
    await this.settingsService.setDefaultSettings(user.id);
    res.status(HttpStatus.OK).send({
      message: SETTING_MESSAGES.RESET_DEFAULT_SETTING_SUCCESSFULLY,
    });
  }

  @Patch('/profile-private')
  async setProfilePrivate(
    @GetUserByAccessToken() user,
    @Body('status') status: boolean,
    @Res() res,
  ) {
    await this.settingsService.setProfilePrivate(user.id, status);
    res.status(HttpStatus.OK).send({
      message: SETTING_MESSAGES.SETTING_PROFILE_PRIVATE_SUCCESSFULLY,
    });
  }

  @Patch('/allow-mention')
  async setAllowMention(
    @GetUserByAccessToken() user,
    @Body('allow_mention') allow_mention: string,
    @Res() res,
  ) {
    await this.settingsService.setAllowMention(user.id, allow_mention);
    res.status(HttpStatus.OK).send({
      message: SETTING_MESSAGES.SETTING_ALLOW_MENTION_SUCCESSFULLY,
    });
  }

  @Patch('/muted-user/:muted_user_id')
  async mutedUser(
    @GetUserByAccessToken() user,
    @Param('muted_user_id') muted_user_id: string,
    @Res() res,
  ) {
    await this.settingsService.mutedUser(user.id, muted_user_id);
    res.status(HttpStatus.OK).send({
      message: SETTING_MESSAGES.MUTED_USER_SUCCESSFULLY,
    });
  }

  @Patch('/unmuted-user/:muted_user_id')
  async unmutedUser(
    @GetUserByAccessToken() user,
    @Param('muted_user_id') muted_user_id: string,
    @Res() res,
  ) {
    await this.settingsService.unmutedUser(user.id, muted_user_id);
    res.status(HttpStatus.OK).send({
      message: SETTING_MESSAGES.UNMUTED_USER_SUCCESSFULLY,
    });
  }

  @Patch('/hidden-words')
  async setHiddenWords(
    @GetUserByAccessToken() user,
    @Body('status') status: boolean,
    @Res() res,
  ) {
    await this.settingsService.setHiddenWords(user.id, status);
    res.status(HttpStatus.OK).send({
      message: SETTING_MESSAGES.SETTING_HIDDEN_WORDS_SUCCESSFULLY,
    });
  }

  @Patch('/custom-hidden-words')
  async setCustomHiddenWords(
    @GetUserByAccessToken() user,
    @Body('status') status: boolean,
    @Res() res,
  ) {
    await this.settingsService.setCustomHiddenWords(user.id, status);
    res.status(HttpStatus.OK).send({
      message: SETTING_MESSAGES.SETTING_CUSTOM_HIDDEN_WORDS_SUCCESSFULLY,
    });
  }

  @Patch('/add-custom-hidden-words')
  async addHiddenWords(
    @GetUserByAccessToken() user,
    @Body('hidden_words') hidden_words: string,
    @Res() res,
  ) {
    await this.settingsService.addHiddenWords(user.id, hidden_words);
    res.status(HttpStatus.OK).send({
      message: SETTING_MESSAGES.SETTING_HIDDEN_WORDS_SUCCESSFULLY,
    });
  }

  @Patch('/remove-custom-hidden-words')
  async removeHiddenWords(
    @GetUserByAccessToken() user,
    @Body('hidden_word') hidden_word: string,
    @Res() res,
  ) {
    await this.settingsService.removeHiddenWords(user.id, hidden_word);
    res.status(HttpStatus.OK).send({
      message: SETTING_MESSAGES.REMOVE_HIDDEN_WORD_SUCCESSFULLY,
    });
  }

  @Patch('/block-user/:blocked_user_id')
  async blockedUser(
    @GetUserByAccessToken() user,
    @Param('blocked_user_id') blocked_user_id: string,
    @Res() res,
  ) {
    await this.settingsService.blockUser(user.id, blocked_user_id);
    res.status(HttpStatus.OK).send({
      message: SETTING_MESSAGES.BLOCK_USER_SUCCESSFULLY,
    });
  }

  @Patch('/unblock-user/:blocked_user_id')
  async unblockedUser(
    @GetUserByAccessToken() user,
    @Param('blocked_user_id') blocked_user_id: string,
    @Res() res,
  ) {
    await this.settingsService.unBlockUser(user.id, blocked_user_id);
    res.status(HttpStatus.OK).send({
      message: SETTING_MESSAGES.UNBLOCK_USER_SUCCESSFULLY,
    });
  }

  @Patch('/hide-like')
  async hideLike(
    @GetUserByAccessToken() user,
    @Body('status') status: boolean,
    @Res() res,
  ) {
    await this.settingsService.setHideLike(user.id, status);
    res.status(HttpStatus.OK).send({
      message: SETTING_MESSAGES.SETTING_HIDE_LIKE_SUCCESSFULLY,
    });
  }

  @Patch('/show-alt-text')
  async showAltText(
    @GetUserByAccessToken() user,
    @Body('status') status: boolean,
    @Res() res,
  ) {
    await this.settingsService.setShowAltText(user.id, status);
    res.status(HttpStatus.OK).send({
      message: SETTING_MESSAGES.SETTING_SHOW_ALT_TEXT_SUCCESSFULLY,
    });
  }

  @Patch('/break-reminder')
  async breakReminder(
    @GetUserByAccessToken() user,
    @Body('break_reminder') break_reminder: string,
    @Res() res,
  ) {
    await this.settingsService.setBreakReminder(user.id, break_reminder);
    res.status(HttpStatus.OK).send({
      message: SETTING_MESSAGES.SETTING_BREAK_REMINDER_SUCCESSFULLY,
    });
  }

  @Patch('/deactivate-profile')
  async deactivateProfile(@GetUserByAccessToken() user, @Res() res) {
    await this.settingsService.deactivateProfile(user.id);
    res.status(HttpStatus.OK).send({
      message: SETTING_MESSAGES.DEACTIVATE_PROFILE_SUCCESSFULLY,
    });
  }

  @Patch('/upload-highest-quality')
  async uploadHighestQuality(
    @GetUserByAccessToken() user,
    @Body('status') status: boolean,
    @Res() res,
  ) {
    await this.settingsService.setUploadHighestQuality(user.id, status);
    res.status(HttpStatus.OK).send({
      message: SETTING_MESSAGES.SETTING_UPLOAD_HIGHEST_QUALITY_SUCCESSFULLY,
    });
  }
}
