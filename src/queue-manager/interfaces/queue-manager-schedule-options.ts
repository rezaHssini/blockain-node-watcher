import { ProcessOptions } from '@nestjs/bull/dist/decorators/process.decorator';

export interface QueueManagerScheduleOptions extends ProcessOptions {
  name: string;
  interval: number;
  expirationTime?: number;
}
