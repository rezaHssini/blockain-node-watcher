import { Module } from "@nestjs/common";
import { ServiceExplorerService } from "./service-explorer.service";

@Module({
  providers: [ServiceExplorerService],
  exports: [ServiceExplorerService],
})
export class ServiceExplorerModule {}
