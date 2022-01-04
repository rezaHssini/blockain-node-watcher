import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";

@Controller()
export class AppController {
  @Get("/health-check")
  @ApiOkResponse({
    description: "Health check.",
  })
  healthCheck(): string {
    return "Ok";
  }
}
