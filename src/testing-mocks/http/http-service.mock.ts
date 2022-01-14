export class HttpServiceMock {
  async post(url: string, data: any, headers?: any): Promise<any> {
    return "post";
  }
}
