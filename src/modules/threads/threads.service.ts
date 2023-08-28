import { Injectable } from '@nestjs/common';
import { DetailThreadType } from './dto/create-thread.dto';
import { RepositoryProvider } from '@src/common/repository';
import { HashtagService } from '../hashtags/hashtags.service';
import { FilesService } from '../files/files.service';
import { CloudinaryService } from '@src/common/cloudinary/provider';
import { UpdateThreadDto } from './dto/update-thread.dto';
import mongoose, { Types } from 'mongoose';
import { CatchException } from '@src/common/exceptions/response.exception';
import { ThreadType } from '@src/common/enum/thread.enum';
import { isEmpty } from 'class-validator';
import { THREAD_MESSAGE } from '@src/common/constant';
import { SettingsService } from '../settings/settings.service';
import { LikesService } from '../likes/likes.service';

const { ObjectId } = Types;

@Injectable()
export class ThreadService {
  constructor(
    private repositoryProvider: RepositoryProvider,
    private hashtagService: HashtagService,
    private fileService: FilesService,
    private cloudinaryService: CloudinaryService,
    private settingService: SettingsService,
    private likeService: LikesService,
  ) {}

  async uploadFile(threadId: string, fileReceives) {
    try {
      let src = [];

      for (const fileReceive of fileReceives.file) {
        const file = await this.cloudinaryService.uploadFile(fileReceive);
        await this.fileService.createFile(
          threadId,
          file.secure_url,
          file.public_id,
        );
        src.push(file.secure_url);
      }

      return src;
    } catch (error) {
      throw new CatchException(error);
    }
  }

  private validateThread(detailThread: DetailThreadType) {
    const type = detailThread.type;

    if (
      [ThreadType.COMMENT, ThreadType.QUOTE, ThreadType.RETHREAD].includes(
        type,
      ) &&
      !detailThread.parentId
    ) {
      throw new CatchException(THREAD_MESSAGE.PARENT_ID_MUST_BE_NOT_EMPTY);
    }

    if (type === ThreadType.RETHREAD && !isEmpty(detailThread.content)) {
      throw new CatchException(THREAD_MESSAGE.CONTENT_MUST_BE_EMPTY);
    }

    if (
      [ThreadType.COMMENT, ThreadType.QUOTE].includes(type) &&
      isEmpty(detailThread.content)
    ) {
      throw new CatchException(THREAD_MESSAGE.CONTENT_MUST_BE_NOT_EMPTY);
    }
  }

  private async checkHideLike(userId: string) {
    const setting = await this.settingService.getUserSetting(userId);

    if (setting.hide_like) {
      return true;
    }
    return false;
  }

  private async checkHiddenWords(userId: string) {
    const setting = await this.settingService.getUserSetting(userId);

    if (setting.hidden_words) {
      return true;
    }
    return false;
  }

  private async checkCustomHiddenWords(userId: string) {
    const setting = await this.settingService.getUserSetting(userId);

    if (setting.custom_hidden_words) {
      return setting.hidden_words_list;
    }
    return null;
  }

  async createThread(
    detailThread: DetailThreadType,
    fileReceives,
    user_id: string,
  ) {
    try {
      this.validateThread(detailThread);

      const thread = await this.repositoryProvider.threadRepository.create({
        ...detailThread,
        userId: user_id,
      });

      const hashtags = await this.hashtagService.checkAndCreateHashtag({
        threadId: thread._id.toString(),
        hashtags: detailThread.hashtags,
      });

      const src = await this.uploadFile(thread._id.toString(), fileReceives);

      return {
        ...thread.toObject(),
        hashtags,
        files: src,
      };
    } catch (error) {
      throw new CatchException(error);
    }
  }

  private async dataTransform(data, userId: string) {
    if (!data) return data;
    if (!Array.isArray(data)) data = [data];

    return await Promise.all(
      data.map(async (thread) => {
        const hashtags = await this.hashtagService.getHashtagsFromIdThread(
          thread._id,
        );

        const files = await this.fileService.getFilesFromIdThread(thread._id);

        let likes = null;

        if (!((await this.checkHideLike(userId)) && !thread.isHideLike)) {
          likes = await this.likeService.count({
            postId: thread._id,
          });
        }

        if (await this.checkHiddenWords(userId)) {
          thread.content = this.settingService.replaceWords(thread.content);
        }

        const customWords = await this.checkCustomHiddenWords(userId);

        if (customWords) {
          thread.content = this.settingService.replaceCustomWords(
            thread.content,
            customWords,
          );
        }

        return {
          ...thread.toObject(),
          hashtags,
          files,
          likes,
        };
      }),
    );
  }

  async getAllThread(user_id: string) {
    const muted_user_id_list = await this.settingService.getMutedBlockedUser(
      user_id,
    );

    const data = await this.repositoryProvider.threadRepository
      .find({
        status: true,
        userId: {
          $nin: muted_user_id_list,
        },
      })
      .sort('-createdAt');

    return await this.dataTransform(data, user_id);
  }

  async getThreadById(userId: string, id: string) {
    const muted_user_id_list = await this.settingService.getMutedBlockedUser(
      userId,
    );
    const data = await this.repositoryProvider.threadRepository.findOne({
      _id: id,
      status: true,
      userId: {
        $nin: muted_user_id_list,
      },
    });

    return await this.dataTransform(data, userId);
  }

  private async checkMutedUser(userId: string, accountId: string) {
    const muted_user_id_list = await this.settingService.getMutedBlockedUser(
      userId,
    );

    if (
      muted_user_id_list.includes(new mongoose.Schema.Types.ObjectId(accountId))
    ) {
      throw new CatchException(THREAD_MESSAGE.NO_THREADS_YET);
    }
  }

  async getThreadByUserId(userId: string, accountId: string) {
    await this.checkMutedUser(userId, accountId);
    const data = await this.repositoryProvider.threadRepository
      .find({
        userId: userId,
        status: true,
      })
      .sort('-createdAt');

    const dataTransform = await this.dataTransform(data, userId);

    return dataTransform;
  }

  async getThreadByHashtag(userId: string, hashtag: string) {
    const hashtag_arr = hashtag.split(',');
    const idThreads = await Promise.all(
      hashtag_arr.map(async (item) => {
        return await this.hashtagService.getIdThreads(item);
      }),
    );
    // Unique id thread
    const idThreadsUnique = [...new Set(idThreads.flat())];
    const data = await this.repositoryProvider.threadRepository
      .find({
        _id: idThreadsUnique,
        status: true,
      })
      .sort('-createdAt');

    return await this.dataTransform(data, userId);
  }

  async checkCreatorThread(id: string, user_id: string) {
    const data = await this.repositoryProvider.threadRepository.findOne({
      _id: id,
      userId: user_id,
      status: true,
    });

    if (!data) {
      throw new CatchException(THREAD_MESSAGE.DONT_HAVE_PERMISSION);
    }
  }

  async updateThread(
    id: string,
    updateThreadDto: UpdateThreadDto,
    user_id: string,
  ) {
    try {
      this.checkCreatorThread(id, user_id);

      return await this.repositoryProvider.threadRepository.findOneAndUpdate(
        {
          _id: id,
          status: true,
        },
        {
          updateThreadDto,
          updated_at: '$$NOW',
        },
        {
          returnDocument: 'after',
        },
      );
    } catch (error) {
      throw new CatchException(error);
    }
  }

  async deleteThread(id: string, user_id: string) {
    try {
      this.checkCreatorThread(id, user_id);

      const data =
        await this.repositoryProvider.threadRepository.findOneAndUpdate(
          {
            _id: new ObjectId(id),
            status: true,
          },
          [
            {
              $set: {
                status: false,
                updated_at: '$$NOW',
              },
            },
          ],
          {
            returnDocument: 'after',
          },
        );

      return data;
    } catch (error) {
      throw new CatchException(error);
    }
  }
}
