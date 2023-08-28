import { HttpStatus } from '@nestjs/common';
import * as mongoose from 'mongoose';
import {
  Aggregate,
  ClientSession,
  Document,
  FilterQuery,
  HydratedDocument,
  PaginateModel,
  PaginateOptions,
  PipelineStage,
  QueryOptions,
  QueryWithHelpers,
  UpdateQuery,
} from 'mongoose';
import { ExceptionResponse } from '@src/common/exceptions/response.exception';
import { PaginatedDocumentsResponseDto } from '../dto/pagination-params.dto';
import { paginateAggregate } from '@src/utils/paginate-aggregate';

export interface IWithTransactionOptions {
  onRollback?: CallableFunction;
}

export interface ITransactionSession {
  session: ClientSession;
}

export class BaseService<T extends Document> {
  constructor(private model: PaginateModel<T>) { }

  async create(
    createDocumentDto: T & any,
    options?: QueryOptions,
  ): Promise<HydratedDocument<T>> {
    const document = await this.model.create(createDocumentDto);
    if (options?.populate) await document.populate(options?.populate);
    return document;
  }

  async findAll(
    filter: FilterQuery<T>,
    options?: PaginateOptions,
  ): Promise<PaginatedDocumentsResponseDto<T>> {
    const paginateResult = await this.model.paginate(filter, options);
    const data = paginateResult.docs;
    delete paginateResult.docs;
    return {
      data,
      paginationOptions: paginateResult,
    };
  }

  async aggregate(
    filter: FilterQuery<T>,
    pipeline: PipelineStage[] = [],
    options?: PaginateOptions,
  ): Promise<Aggregate<Array<T> | PaginatedDocumentsResponseDto<T>> | any> {
    Object.keys(filter).forEach((data) => {
      if (mongoose.isValidObjectId(filter[data]))
        Object.assign(filter, {
          [data]: new mongoose.Types.ObjectId(filter[data]),
        });
    });

    const paginationOptions =
      options?.pagination === true
        ? paginateAggregate(options)
        : this.handleAggregateOptions(options);

    const results = await this.model.aggregate([
      {
        $match: filter,
      },
      ...pipeline,
      ...paginationOptions,
    ]);

    return options?.pagination === true ? results[0] : results;
  }

  private handleAggregateOptions(target) {
    if (target) {
      const paginationOptions: PipelineStage[] = [];
      Object.keys(target).forEach((data) => {
        if (data === 'limit') paginationOptions.push({ $limit: target[data] });
        else if (data === 'sort') {
          const sort: Record<string, 1 | any | -1> = target[data].includes('-')
            ? { [target[data].split('-')[1]]: -1 }
            : { [target[data]]: 1 };
          paginationOptions.push({ $sort: sort });
        }
      });

      return paginationOptions;
    }

    return [];
  }

  // async findOneById(
  //   id: string,
  //   options?: QueryOptions,
  // ): Promise<UnpackedIntersection<HydratedDocument<T>, {}>> {
  //   const document = await this.model
  //     .findById(id, null, options)
  //     .populate(options?.populate)
  //     .select(options?.select);
  //   if (options?.nullable !== true && !document)
  //     throw new HttpException(
  //       `${this.model.modelName} not found`,
  //       HttpStatus.NOT_FOUND,
  //     );

  //   return document;
  // }

  async update(
    filter: FilterQuery<T>,
    updateDocumentDto: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<HydratedDocument<T>> {
    const document = await this.model.findOneAndUpdate(
      filter,
      updateDocumentDto,
      options,
    );
    if (options?.nullable !== true && !document)
      throw new ExceptionResponse(
        HttpStatus.NOT_FOUND,
        `${this.model.modelName} not found`,
      );
    if (options?.populate) await document.populate(options?.populate);
    return document;
  }

  async updateAll(
    filter: FilterQuery<T>,
    updateDocumentDto: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<mongoose.mongo.UpdateResult> {
    return this.model.updateMany(filter, updateDocumentDto, options);
  }

  // async remove(
  //   filter: FilterQuery<T>,
  //   options?: QueryOptions,
  // ): Promise<UnpackedIntersection<HydratedDocument<T>, {}>> {
  //   const document = await this.model
  //     .findOneAndDelete(filter, options)
  //     .populate(options?.populate);
  //   if (options?.nullable !== true && !document)
  //     throw new HttpException(
  //       `${this.model.modelName} not found`,
  //       HttpStatus.NOT_FOUND,
  //     );

  //   return document;
  // }

  // async removeAll(filter: FilterQuery<T>, options?: QueryOptions) {
  //   return this.model.deleteMany(filter, options).populate(options?.populate);
  // }

  count(
    filter: FilterQuery<T>,
  ): QueryWithHelpers<number, HydratedDocument<T>, {}, T> {
    return this.model.countDocuments(filter);
  }

  async bulkWrite(writes: Array<any>): Promise<mongoose.mongo.BulkWriteResult> {
    return await this.model.bulkWrite(writes);
  }

  // execute commands and database query with transaction
  async withTx(cb: (session: ClientSession) => any) {
    const session = await this.model.startSession();

    session.startTransaction();

    try {
      const res = await cb(session);

      await session.commitTransaction();
      await session.endSession();

      return res;
    } catch (err) {
      await session.abortTransaction();
      await session.endSession();

      throw err;
    }
  }

  withTransaction = async (
    connection: mongoose.Connection,
    func: CallableFunction,
    { onRollback }: IWithTransactionOptions = {},
  ) => {
    const session = await connection.startSession();

    session.startTransaction();
    try {
      const res = await func({ session });
      await session.commitTransaction();
      return res;
    } catch (e) {
      await session.abortTransaction();
      if (onRollback) {
        await onRollback();
      }
      throw e;
    } finally {
      await session.endSession();
    }
  };
}
