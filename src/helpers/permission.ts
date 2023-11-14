import { Response, NextFunction } from 'express';
import { ForbiddenError } from '../core/ApiError';
import { PublicRequest } from '../types/app-request';

export default (permission: string) =>
  (req: PublicRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.apiKey?.permissions)
        return next(new ForbiddenError('Permission Denied 1'));

      const exists = req.apiKey.permissions.find(
        (entry) => entry === permission,
      );
      if (!exists) return next(new ForbiddenError('Permission Denied 2'));

      next();
    } catch (error) {
      next(error);
    }
  };
