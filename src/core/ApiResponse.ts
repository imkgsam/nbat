import { Response } from 'express';
import { Tokens } from 'app-request';


// Helper code for the API consumer to understand the error and handle is accordingly
enum StatusCodeEnum {
  SUCCESS = '10000',
  FAILURE = '10001',
  RETRY = '10002',
  INVALID_ACCESS_TOKEN = '10003',
}

enum ResponseStatusEnum {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

abstract class ApiResponse {
  constructor(
    protected statusCode: StatusCodeEnum,
    protected status: ResponseStatusEnum,
    protected message: string,
  ) {}

  protected prepare<T extends ApiResponse>(
    res: Response,
    response: T,
    headers: { [key: string]: string },
  ): Response {
    for (const [key, value] of Object.entries(headers)) res.append(key, value);
    return res.status(this.status).json(ApiResponse.sanitize(response));
  }

  public send(
    res: Response,
    headers: { [key: string]: string } = {},
  ): Response {
    return this.prepare<ApiResponse>(res, this, headers);
  }

  //ace,11.15,remove undefined fileds in response, this is a generic identify function
  private static sanitize<T extends ApiResponse>(response: T): T {
    //ace，11.15，clone response
    const clone: T = {} as T;
    Object.assign(clone, response);
    // @ts-ignore
    delete clone.status;
    for (const i in clone) if (typeof clone[i] === 'undefined') delete clone[i];
    return clone;
  }
}

export class AuthFailureResponse extends ApiResponse {
  constructor(message = 'Authentication Failure') {
    super(StatusCodeEnum.FAILURE, ResponseStatusEnum.UNAUTHORIZED, message);
  }
}

export class NotFoundResponse extends ApiResponse {
  constructor(message = 'Not Found') {
    super(StatusCodeEnum.FAILURE, ResponseStatusEnum.NOT_FOUND, message);
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    return super.prepare<NotFoundResponse>(res, this, headers);
  }
}

export class ForbiddenResponse extends ApiResponse {
  constructor(message = 'Forbidden') {
    super(StatusCodeEnum.FAILURE, ResponseStatusEnum.FORBIDDEN, message);
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor(message = 'Bad Parameters') {
    super(StatusCodeEnum.FAILURE, ResponseStatusEnum.BAD_REQUEST, message);
  }
}

export class InternalErrorResponse extends ApiResponse {
  constructor(message = 'Internal Error') {
    super(StatusCodeEnum.FAILURE, ResponseStatusEnum.INTERNAL_ERROR, message);
  }
}

export class SuccessMsgResponse extends ApiResponse {
  constructor(message: string) {
    super(StatusCodeEnum.SUCCESS, ResponseStatusEnum.SUCCESS, message);
  }
}

export class FailureMsgResponse extends ApiResponse {
  constructor(message: string) {
    super(StatusCodeEnum.FAILURE, ResponseStatusEnum.SUCCESS, message);
  }
}

export class SuccessResponse<T> extends ApiResponse {
  constructor(message: string, private data: T) {
    super(StatusCodeEnum.SUCCESS, ResponseStatusEnum.SUCCESS, message);
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    return super.prepare<SuccessResponse<T>>(res, this, headers);
  }
}

export class AccessTokenErrorResponse extends ApiResponse {
  private instruction = 'refresh_token';

  constructor(message = 'Access token invalid') {
    super(
      StatusCodeEnum.INVALID_ACCESS_TOKEN,
      ResponseStatusEnum.UNAUTHORIZED,
      message,
    );
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    headers.instruction = this.instruction;
    return super.prepare<AccessTokenErrorResponse>(res, this, headers);
  }
}


export class TokenRefreshResponse extends ApiResponse {
  constructor(
    message: string,
    private data: Tokens
  ) {
    super(StatusCodeEnum.SUCCESS, ResponseStatusEnum.SUCCESS, message);
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    return super.prepare<TokenRefreshResponse>(res, this, headers);
  }
}
