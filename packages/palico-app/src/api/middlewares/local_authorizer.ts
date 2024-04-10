import { type RequestHandler } from 'express';
import { APIError } from '../apierror';
import { JWTAuthenticator, commonConfig } from '@palico-ai/common';

export const defaultRequestAuthorizer: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw APIError.unauthorized('No authorization header');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, authToken] = authHeader.split(' ');
    const secret = commonConfig.getSecretKey();
    const decoded = await JWTAuthenticator.decodeJWTToken(authToken, secret);
    if (!decoded) {
      throw APIError.unauthorized('Invalid token');
    }
    next();
  } catch (e) {
    next(e);
  }
};
