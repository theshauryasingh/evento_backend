// eslint-disable-next-line no-unused-vars
import { loggers } from 'winston';
import { HttpStatus } from './typeDefs';

/**
 *
 * @param {import("express").Request} req
 * @returns
 */
export function getExecuteArgs(req) {
  // console.log(' ==>> ', req.body);
  return {
    params: req.params,
    query: req.query,
    body: req.body,
    ctx: req.ctx,
    cookies: req.cookies,
    headers: req.headers,
    files: req.files,
    file: req.file,
  };
}

export const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return ((diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS).toPrecision(2) + 'ms';
};

/**
 * @type {HttpStatus}
 */
export const HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
};

export class BaseError extends Error {
  /**
   *
   * @param {string} message
   * @param {number} httpCode
   * @param {string} name
   */
  constructor(message, httpCode, name) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.httpCode = httpCode;
    this.name = name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class APIError extends BaseError {
  constructor(
    message = 'could not process the request',
    httpCode = HttpStatusCode.INTERNAL_SERVER,
    name = 'Internal server error'
  ) {
    super(message, httpCode, name);
  }
}

export class BadRequestError extends BaseError {
  constructor(message = 'could not process the request') {
    super(message, HttpStatusCode.BAD_REQUEST, 'Bad request');
  }
}

export class NotFoundError extends BaseError {
  constructor(message = 'could not found the resource you requested') {
    super(message, HttpStatusCode.NOT_FOUND, 'Not found');
  }
}

export class UnauthorizedError extends BaseError {
  constructor(
    message = 'unauthorized request to access resource you requested'
  ) {
    super(message, HttpStatusCode.UNAUTHORIZED, 'Unauthorized');
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = 'forbidden to access resource you requested') {
    super(message, HttpStatusCode.FORBIDDEN, 'Forbidden');
  }
}

export class CustomError extends BaseError {
  constructor(
    message = 'an error occurred',
    httpCode = HttpStatusCode.INTERNAL_SERVER,
    name = 'error message'
  ) {
    super(message, httpCode, name);
  }
}