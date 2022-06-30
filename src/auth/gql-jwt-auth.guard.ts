/* eslint-disable class-methods-use-this */
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlJwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const finalContext = ctx.getContext();
    const { req } = finalContext;
    // if subscriptions/webSockets, let it pass headers from connection.context to passport-jwt
    if (ctx && finalContext && finalContext.headers) {
      return finalContext;
    }
    return req;
  }
}
