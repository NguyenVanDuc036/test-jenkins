import { FcmService } from '@doracoder/fcm-nestjs';
import { Injectable } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';

@Injectable()
export class FCMService {
    constructor(private readonly fcmService: FcmService) { }

    async sendToDevices(
        deviceIds: Array<string>,
        payload: firebaseAdmin.messaging.MessagingPayload,
        silent: boolean,
    ) {
        await this.fcmService.sendNotification(deviceIds, payload, silent);
    }

    async sendToTopic(
        topic: 'all' | string,
        payload: firebaseAdmin.messaging.MessagingPayload,
        silent: boolean,
    ): Promise<any> {
        await this.fcmService.sendToTopic(topic, payload, silent);
    }
}