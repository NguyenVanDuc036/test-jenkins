import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LIKES_SCOPE } from '@src/common/constant';
import { BaseResponse } from '@src/common/enum/base-reponse';
import { LikesService } from './likes.service';
import { createLikeDTO } from './dto/create-like.dto';
import { CatchException, ExceptionResponse } from '@src/common/exceptions/response.exception';
import mongoose from 'mongoose';
import { LIKE_CONSTANT } from './constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PortalController } from '@src/common/decorators';


@PortalController({ path: LIKES_SCOPE })
export class LikesController {
    constructor(private readonly likesService: LikesService) { }

    @Get()
    async getAll() {
        try {
            return await this.likesService.findAll({})
        } catch (error) {
            throw new CatchException(error)
        }
    }

    @Get('/:id')
    async getPostId(@Param() postId: string) {
        try {
            return await this.likesService.findAll({ postId: this.likesService.parseObjectId(postId) })
        } catch (error) {
            throw new CatchException(error)
        }
    }

    @Post()
    async createLike(@Req() req, @Body() like: createLikeDTO) {
        try {
            like.userLikeId = req.user._id
            return await this.likesService.create(like)
        } catch (error) {
            throw new CatchException(error)
        }
    }

    @Delete('/:id')
    async delete(@Param() _id: string) {
        try {
            const res = await this.likesService.delete(_id)
            if (res.deletedCount > 0 && res.acknowledged === true) return LIKE_CONSTANT.UNLIKE_SUCCESS
            throw new ExceptionResponse(HttpStatus.BAD_REQUEST, LIKE_CONSTANT.UNLIKE_FAILED)
            return res
        } catch (error) {
            throw new CatchException(error)
        }
    }
}
