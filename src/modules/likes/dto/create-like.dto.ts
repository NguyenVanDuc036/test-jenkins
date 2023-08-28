import { Prop } from "@nestjs/mongoose";
import { BaseDocument } from "@src/common/repository";
import { IsNotEmpty } from "class-validator";

export class createLikeDTO {
    @Prop()
    @IsNotEmpty()
    postId: string

    @Prop()
    @IsNotEmpty()
    userLikeId: string
}