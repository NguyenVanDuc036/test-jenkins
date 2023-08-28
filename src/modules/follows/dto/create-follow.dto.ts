import { Prop } from "@nestjs/mongoose";
import { BaseDocument } from "@src/common/repository";
import { IsNotEmpty } from "class-validator";

export class createfollowDTO {
    @Prop()
    @IsNotEmpty()
    userId: string

    @Prop()
    @IsNotEmpty()
    followedId: string
}