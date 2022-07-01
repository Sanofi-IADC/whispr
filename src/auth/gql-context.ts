export interface GqlContext {
  req: Request;
  res: Response;
  payload?: any;
  // required for subscription
  connection: any;
}
