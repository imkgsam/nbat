import { RoleCodeEnum } from '../database/model/workon/Role';
import { RoleRequest } from 'app-request';
import { Response, NextFunction } from 'express';

export default (...roleCodes: RoleCodeEnum[]) =>
  (req: RoleRequest, res: Response, next: NextFunction) => {
    req.currentRoleCodes = roleCodes;
    next();
  };
