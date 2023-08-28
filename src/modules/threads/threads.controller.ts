import {
  Controller,
  Get,
  HttpStatus,
  Res,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Query,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { THREAD_MESSAGE, THREAD_SCOPE } from '@src/common/constant';
import { ThreadService } from './threads.service';
import { DataReceiveDto } from './dto/create-thread.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer/interceptors/file-fields.interceptor';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { GetUserByAccessToken } from '@src/common/decorators/user.decorator';
import { AccessMention } from '../settings/guards/access-mention.guard';

@Controller(THREAD_SCOPE)
export class ThreadController {
  constructor(private threadServices: ThreadService) {}

  @Post()
  @UseGuards(AccessMention)
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'file',
        maxCount: 100,
      },
    ]),
  )
  async createThread(
    @Body() dataReceiveDto: DataReceiveDto,
    @UploadedFiles() fileReceives,
    @GetUserByAccessToken() user,
    @Res() res,
  ) {
    const data = await this.threadServices.createThread(
      JSON.parse(dataReceiveDto.data),
      fileReceives,
      user.id,
    );

    res.status(HttpStatus.OK).send({
      message: THREAD_MESSAGE.CREATE_THREAD_SUCCESS,
      data,
    });
  }

  @Get()
  async getAll(@GetUserByAccessToken() user, @Res() res) {
    const result = await this.threadServices.getAllThread(user.id);
    res.status(HttpStatus.OK).send({
      message: THREAD_MESSAGE.GET_ALL_THREAD_SUCCESS,
      data: result,
    });
  }

  @Get(':id')
  async getThreadById(
    @GetUserByAccessToken() user,
    @Param('id') id: string,
    @Res() res,
  ) {
    const result = await this.threadServices.getThreadById(user.id, id);
    res.status(HttpStatus.OK).send({
      message: THREAD_MESSAGE.GET_THREAD_BY_ID_SUCCESS,
      data: result,
    });
  }

  @Get('user/:accountId')
  async getThreadByUserId(
    @GetUserByAccessToken() user,
    @Param('accountId') accountId: string,
    @Res() res,
  ) {
    const result = await this.threadServices.getThreadByUserId(
      user.id,
      accountId,
    );
    res.status(HttpStatus.OK).send({
      message: THREAD_MESSAGE.GET_THREAD_BY_USER_ID_SUCCESS,
      data: result,
    });
  }

  @Get()
  async getThreadByHashtag(
    @Query('hashtag') hashtag: string,
    @Res() res,
    @GetUserByAccessToken() user,
  ) {
    const result = await this.threadServices.getThreadByHashtag(
      user.id,
      hashtag,
    );
    res.status(HttpStatus.OK).send({
      message: THREAD_MESSAGE.GET_THREAD_BY_HASHTAG_SUCCESS,
      data: result,
    });
  }

  @Patch(':id')
  async updateThread(
    @Param('id') id: string,
    @Body() updateThreadDto: UpdateThreadDto,
    @GetUserByAccessToken() user,
    @Res() res,
  ) {
    const data = await this.threadServices.updateThread(
      id,
      updateThreadDto,
      user.id,
    );

    res.status(HttpStatus.OK).send({
      message: THREAD_MESSAGE.UPDATE_THREAD_SUCCESS,
      data,
    });
  }

  @Delete(':id')
  async deleteThread(
    @Param('id') id: string,
    @GetUserByAccessToken() user,
    @Res() res,
  ) {
    const data = await this.threadServices.deleteThread(id, user.id);

    res.status(HttpStatus.OK).send({
      message: THREAD_MESSAGE.DELETE_THREAD_SUCCESS,
      data,
    });
  }
}
