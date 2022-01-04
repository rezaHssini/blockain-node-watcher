import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class JobLockerService {
  async lock(): Promise<string | undefined | null> {
    return this.getLockId();
  }

  async unlock(): Promise<void> {
    return;
  }
  private getLockId(): string {
    return uuidv4();
  }
}
