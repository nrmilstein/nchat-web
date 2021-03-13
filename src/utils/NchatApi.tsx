class NchatApi {
  static apiUrl = "/api/v1/";

  static async fetch<T>(path: string, authKey?: string, init: RequestInit = {}):
    Promise<NchatApiSuccessResponse<T>> {

    let customHeaders: { [index: string]: string } = {
      "Accept": "application/json",
    }
    if (authKey) {
      customHeaders["X-API-KEY"] = authKey;
    }

    if (init.headers) {
      this.appendHeaders(init.headers, customHeaders);
    } else {
      init.headers = customHeaders;
    }

    const response = await fetch(this.apiUrl + path, init)

    // If we want to pass the response in an error later, we must clone it, because
    // response.body can only be consumed once.
    const responseClone = response.clone();

    const jsonResponse = await response.json();

    if (!response.ok || ("status" in jsonResponse && jsonResponse.status !== "success")) {
      if ("status" in jsonResponse && "message" in jsonResponse) {
        throw new NchatApiError("Nchat server error: " + jsonResponse.message,
          responseClone, jsonResponse);
      } else {
        throw new FetchError("Nchat server error.", responseClone);
      }
    }

    if (!("status" in jsonResponse)) {
      throw new FetchError("Missing 'status' field in nchat response.", responseClone);
    }

    return jsonResponse as NchatApiSuccessResponse<T>;
  }

  static async get<T>(path: string, authKey?: string, init?: RequestInit):
    Promise<NchatApiSuccessResponse<T>> {
    return this.fetch(path, authKey, init);
  }

  static async post<T>(path: string, body: any, authKey?: string, init?: RequestInit):
    Promise<NchatApiSuccessResponse<T>> {
    const postInit = {
      ...init,
      "method": "POST",
      "body": JSON.stringify(body),
    };
    return this.fetch<T>(path, authKey, postInit);
  }

  static async put<T>(path: string, body: any, authKey?: string, init?: RequestInit):
    Promise<NchatApiSuccessResponse<T>> {
    const putInit = {
      ...init,
      "method": "PUT",
      "body": JSON.stringify(body),
    };
    return this.fetch<T>(path, authKey, putInit);
  }

  static async delete<T>(path: string, authKey?: string, init?: RequestInit):
    Promise<NchatApiSuccessResponse<T>> {
    const deleteInit = {
      ...init,
      "method": "DELETE",
    };
    return this.fetch<T>(path, authKey, deleteInit);
  }

  private static appendHeaders(
    headers: HeadersInit,
    additionalHeaders: { [index: string]: string }) {
    for (const headerKey in additionalHeaders) {
      if (additionalHeaders.hasOwnProperty(headerKey)) {
        if (headers instanceof Headers) {
          headers.append(headerKey, additionalHeaders[headerKey]);
        } else if (Array.isArray(headers)) {
          headers.push([headerKey, additionalHeaders[headerKey]]);
        } else if (typeof headers === 'object') {
          headers[headerKey] = additionalHeaders[headerKey];
        }
      }
    }
  }
}

export interface NchatApiSuccessResponse<T> {
  status: string,
  data: T,
}

export interface NchatApiErrorResponse {
  status: string,
  message: string,
  code: number,
}

export class FetchError extends Error {
  response: Response;
  constructor(message: string, response: Response) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError)
    }
    this.response = response;
  }
}

export class NchatApiError extends FetchError {
  body: NchatApiErrorResponse;

  constructor(message: string, response: Response, body: NchatApiErrorResponse) {
    super(message, response);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NchatApiError)
    }
    this.body = body;
  }
}

export default NchatApi;
