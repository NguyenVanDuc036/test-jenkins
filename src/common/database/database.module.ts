import { MONGO_URI, MONGO_URL_LOCAL } from '@common/configs/env';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [MongooseModule.forRoot(MONGO_URI)],
})
export class DatabaseModule { }
