import { ProtectedRequest } from 'app-request';
import { AuthFailureError } from '../core/ApiError';
import RoleRepo from '../database/repository/RoleRepo';
import asyncHandler from '../helpers/asyncHandler';
import authentication from './authentication';

import { RoleCodeEnum } from '../database/model/Role';
import { Response, NextFunction } from 'express';

const authorization = (...roleCodes: RoleCodeEnum[]) =>
  [authentication,asyncHandler(async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roles || !roleCodes)
      throw new AuthFailureError('Permission denied');

    const roles = await RoleRepo.findByCodes(roleCodes);
    if (roles.length === 0) throw new AuthFailureError('Permission denied');
    let authorized = false;
    for (const userRole of req.user.roles) {
      if (authorized) break;
      for (const role of roles) {
        if (userRole._id.equals(role._id)) {
          authorized = true;
          break;
        }
      }
    }

    if (!authorized) throw new AuthFailureError('Permission denied');

    return next();
  })];

  export default authorization;
