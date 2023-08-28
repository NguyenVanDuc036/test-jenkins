import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { FOLLOWS_SCOPE } from '@src/common/constant';
import { BaseResponse } from '@src/common/enum/base-reponse';
import { CatchException, ExceptionResponse } from '@src/common/exceptions/response.exception';
import mongoose from 'mongoose';
import { FOLLOW_CONSTANT } from './constant';
import { FollowsService } from './follows.service';
import { createfollowDTO } from './dto/create-follow.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PortalController } from '@src/common/decorators';

@PortalController({ path: FOLLOWS_SCOPE })
export class FollowsController {
    constructor(private readonly followsService: FollowsService) { }

    @Get()
    async getAll() {
        try {
            return this.followsService.findAll({})
        } catch (error) {
            throw new CatchException(error)
        }
    }
    // ------------- GET USER MINH THEO DOI ------------
    @Get('followed/:id')
    async getFollowedUser(@Param() userId: string) {
        try {
            return this.followsService.findFollowed(userId)
        } catch (error) {
            throw new CatchException(error)
        }
    }

    // ------------- GET USER THEO DOI MINH ------------
    @Get('following/:id')
    async getFollowingUser(@Param() followedId: string) {
        try {
            return this.followsService.findFollowing(followedId)
        } catch (error) {
            throw new CatchException(error)
        }
    }

    @Post()
    async createfollow(@Body() follow: createfollowDTO) {
        try {
            return this.followsService.create(follow)
        } catch (error) {
            throw new CatchException(error)
        }
    }

    @Delete('/:id')
    async delete(@Param() _id: string) {
        try {
            const res = await this.followsService.delete(_id)
            if (res.deletedCount > 0 && res.acknowledged === true) return FOLLOW_CONSTANT.UNFOLLOW_SUCCESS
            throw new ExceptionResponse(HttpStatus.BAD_REQUEST, FOLLOW_CONSTANT.UNFOLLOW_FAILED)
            return res
        } catch (error) {
            throw new CatchException(error)
        }
    }
}
