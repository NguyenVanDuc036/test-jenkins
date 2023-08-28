import { Injectable } from '@nestjs/common';
import { CatchException } from '@src/common/exceptions/response.exception';
import { RepositoryProvider } from '@src/common/repository';
import { Types } from 'mongoose';

const ObjectId = Types.ObjectId;

@Injectable()
export class FilesService {
  constructor(private repositoryProvider: RepositoryProvider) {}

  async createFile(threadId: string, src: string, publicId: string) {
    try {
      const file = await this.repositoryProvider.fileRepository.create({
        threadId: new ObjectId(threadId),
        src,
        publicId,
      });
      return file.src;
    } catch (error) {
      throw new CatchException(error);
    }
  }

  async getFilesFromIdThread(idThread: string) {
    const data = await this.repositoryProvider.fileRepository
      .find({
        threadId: idThread,
      })
      .select('src -_id');

    return data.map((item) => item.src);
  }
}
