import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';

export function headersToString(headerMap: IncomingHttpHeaders): string {
  const filtred = {
    ...headerMap,
    authorization: headerMap.authorization
      ? `[HIDDEN size=${headerMap.authorization.length}]`
      : null,
  };
  return JSON.stringify(filtred);
}

export function logger(req: Request, _res: Response, next: NextFunction) {
  if (req.headers) {
    Logger.log(headersToString(req.headers));
  }
  next();
}
