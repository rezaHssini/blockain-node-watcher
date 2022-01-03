import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class JobLockerService {
  constructor() {}

  async lock(
    queue: string,
    job: string,
    expireIn: number
  ): Promise<string | undefined | null> {
    return this.getLockId();
  }

  async unlock(queue: string, job: string, lockId: string): Promise<void> {

  }
  private getLockId(): string {
    return uuidv4();
  }
}
