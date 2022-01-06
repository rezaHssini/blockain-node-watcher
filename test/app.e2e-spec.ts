import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { HttpServiceMock } from "./../src/testing-mocks/http/http-service.mock";
import { NotificationsService } from "./../src/notifications/notifications.service";
import { NotificationsServiceMock } from "./../src/testing-mocks/notifications/notifications.service.mock";
import { HttpService } from "@nestjs/axios";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useClass(HttpServiceMock)
      .overrideProvider(NotificationsService)
      .useClass(NotificationsServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("should be defined", () => {
    expect(app).toBeDefined();
  });

  it("/health-check (GET)", () => {
    return request(app.getHttpServer())
      .get("/health-check")
      .expect(200)
      .expect("Ok");
  });
});
