export class NotificationDto {
  messageBody: string;
  slack?: Slack;
  channelName: string;
}
class Slack {
  botIcon?: string;
}
