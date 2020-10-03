class NchatApi {
  static API_URL = "http://localhost:3000/api/v1/";

  static async fetch(path: string, apiKey?: string, init?: RequestInit):
    Promise<NchatApiResponse> {
    // Add apiKey to headers
    if (apiKey) {
      if (init) {
        let headers = init.headers
        if (headers) {
          if (headers instanceof Headers) {
            headers.append('X-API-KEY', apiKey);
          } else if (Array.isArray(headers)) {
            headers.push(['X-API-KEY', apiKey]);
          } else if (typeof headers === 'object') {
            headers['X-API-KEY'] = apiKey;
          }
        } else {
          init.headers = {
            "X-API-KEY": apiKey,
          }
        }
      } else {
        init = {
          "headers": {
            "X-API-KEY": apiKey,
          }
        }
      }
    }

    const response = await fetch(this.API_URL + path, init)

    // If we want to pass the response to an error later, we must clone it, because
    // response.body can only be consumed once, and we want to preserve this for the error.
    const responseClone = response.clone();

    const json = await response.json();

    if (!response.ok) {
      if ("status" in json && "message" in json) {
        throw new NchatApiErrorResponse(json.message, responseClone, json);
      } else {
        throw new NchatApiError("Could not make nchat API request.", responseClone);
      }
    }

    if (!("status" in json && "data" in json)) {
      throw new NchatApiError("Missing fields in nchat response.", responseClone);
    }

    return json as NchatApiResponse;
  }

  static async get(path: string, apiKey?: string, init?: RequestInit): Promise<NchatApiResponse> {
    return this.fetch(path, apiKey, init);
  }

  static async post(path: string, body: any, apiKey?: string, init?: RequestInit):
    Promise<NchatApiResponse> {
    const postInit = {
      ...init,
      "method": "POST",
      "body": JSON.stringify(body),
    };
    return this.fetch(path, apiKey, postInit);
  }

  static async put(path: string, body: any, apiKey?: string, init?: RequestInit):
    Promise<NchatApiResponse> {
    const putInit = {
      ...init,
      "method": "PUT",
      "body": JSON.stringify(body),
    };
    return this.fetch(path, apiKey, putInit);
  }

  static async delete(path: string, apiKey?: string, init?: RequestInit):
    Promise<NchatApiResponse> {
    const deleteInit = {
      ...init,
      "method": "DELETE",
    };
    return this.fetch(path, apiKey, deleteInit);
  }
}

interface NchatApiResponse {
  status: string,
  data?: any,
  code?: number,
  message?: string,
}

class NchatApiError extends Error {
  response: Response;
  constructor(message: string, response: Response) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NchatApiError)
    }
    this.response = response;
  }
}

class NchatApiErrorResponse extends NchatApiError {
  body: NchatApiResponse;

  constructor(message: string, response: Response, body: NchatApiResponse) {
    super(message, response);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NchatApiErrorResponse)
    }
    this.body = body;
  }
}

export default NchatApi;