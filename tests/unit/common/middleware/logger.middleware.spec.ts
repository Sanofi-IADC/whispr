import { Request, Response, NextFunction } from 'express';
import { headersToString, logger } from '../../../../src/common/middleware/logger.middleware';

describe('Logger Middleware', () => {
  it('log should hide token', () => {
    expect(headersToString({ atest: 'aValue', authorization: 'Bearer thatShouldBeHidden' })).toBe(
      '{"atest":"aValue","authorization":"[HIDDEN size=25]"}',
    );
  });
  it('middleware should let go through', () => {
    const next = jest.fn() as unknown as NextFunction;
    const res = jest.fn() as unknown as Response;

    const req = { headers: { atest: 'aValue', authorization: 'Bearer thatShouldBeHidden' } } as unknown as Request;
    logger(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
