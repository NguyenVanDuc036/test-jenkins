import { Injectable } from '@nestjs/common';
import { RepositoryProvider } from '@src/common/repository';
import { Types } from 'mongoose';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { CatchException } from '@src/common/exceptions/response.exception';

const ObjectId = Types.ObjectId;

@Injectable()
export class HashtagService {
  constructor(private repositoryProvider: RepositoryProvider) {}

  async checkIfHashtagExits(hashtag: string) {
    try {
      const result = await this.repositoryProvider.hashtagRepository.findOne({
        where: { name: hashtag },
      });
      return result;
    } catch (error) {
      throw new CatchException(error);
    }
  }

  async updateHashtag(hashtag: string, threadId: string) {
    try {
      return await this.repositoryProvider.hashtagRepository.findOneAndUpdate(
        { name: hashtag },
        {
          $setOnInsert: { name: hashtag },
          $push: { threadId: { id: new ObjectId(threadId) } },
        },
        { upsert: true, returnDocument: 'after' },
      );
    } catch (error) {
      throw new CatchException(error);
    }
  }

  async checkAndCreateHashtag(createHashtagDto: CreateHashtagDto) {
    try {
      const { hashtags, threadId } = createHashtagDto;
      const result = await Promise.all(
        hashtags.map(async (hashtag: string) => {
          return await this.updateHashtag(hashtag, threadId);
        }),
      );

      return result.map((item) => item.name);
    } catch (error) {
      throw new CatchException(error);
    }
  }

  async getIdThreads(hashtag: string) {
    const idThreads = await this.repositoryProvider.hashtagRepository.find({
      name: hashtag,
    });
    return idThreads;
  }

  async getHashtagsFromIdThread(idThread: string) {
    const data = await this.repositoryProvider.hashtagRepository
      .find({
        'threadId.id': idThread,
      })
      .select('name -_id');

    return data.map((item) => item.name);
  }
}
