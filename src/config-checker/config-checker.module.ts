import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConfigCheckerService } from "./config-checker.service";

@Module({
  imports: [ConfigModule],
  providers: [ConfigCheckerService],
})
export class ConfigCheckerModule {}
