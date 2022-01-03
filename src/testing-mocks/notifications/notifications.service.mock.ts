export class NotificationsServiceMock {
  async send(message: any): Promise<void> {
    return message;
  }
}
