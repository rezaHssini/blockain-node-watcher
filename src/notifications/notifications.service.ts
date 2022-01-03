import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { NotificationDto } from './dtos/notification.dto';
import { NotificationParamsName } from './enum/params-name.enum';

@Injectable()
export class NotificationsService {
  constructor(private readonly http: HttpService, private readonly config: ConfigService) {}
  async send(message: any): Promise<void> {
    const url = this.config.get(NotificationParamsName.NOTIFICATIN_MS_URL);
    if (!url) {
      throw new Error("Can't send notification: URL is unknown.");
    }
    const requestBody = this.getRequestBody(message);
    let response;
    const response$ = this.http.post(url, requestBody);
    try {
      response = await firstValueFrom(response$);
    } catch (e) {
      const dataStr = JSON.stringify(e.response?.data || {});
      const msg = `${e.message}: (${dataStr})`;
      throw new Error(msg);
    }
    if (response.status > 400) {
      throw new Error(`Failed to send notification: ${response.status} ${response.statusText}`);
    }
  }
  private getRequestBody(message: string): NotificationDto {
    const channel = this.config.get(NotificationParamsName.NOTIFICATION_CHANNEL_NAME);
    if (!channel) {
      throw new Error("Can't send notification: CHANNEL is unknown.");
    }
    return {
      messageBody: message,
      botIcon: this.config.get(NotificationParamsName.NOTIFICATION_BOT_ICON),
      channelName: this.config.get(NotificationParamsName.NOTIFICATION_CHANNEL_NAME),
    };
  }
}
