import { FcmModule } from '@doracoder/fcm-nestjs';
import { Module } from '@nestjs/common';
import { FCMService } from './fcm.service';

@Module({
  imports: [
    FcmModule.forRoot({
      firebaseSpecsPath: `${process.cwd()}/src/common/fcm/config.json`,
    }),
  ],
  providers: [FCMService],
  exports: [FCMService],
})
export class FirebaseModule {}
