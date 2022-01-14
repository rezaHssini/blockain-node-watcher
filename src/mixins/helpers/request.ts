import { firstValueFrom } from "rxjs";

export async function request(http, url): Promise<any> {
  if (!url) {
    throw new Error("Can't send request: URL is unknown.");
  }
  let response;
  const response$ = http.get(url);
  try {
    response = await firstValueFrom(response$);
  } catch (e) {
    const dataStr = JSON.stringify(e.response?.data || {});
    const msg = `${e.message}: (${dataStr})`;
    throw new Error(msg);
  }
  if (response.status > 400) {
    throw new Error(
      `${url} - Failed to send http request: ${response.status} ${response.statusText}`
    );
  }
  return response.data;
}
