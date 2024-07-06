import express from 'express';
// import { SuccessResponse } from '../../../core/ApiResponse';
// import asyncHandler from '../../../helpers/asyncHandler';
// import authorization from '../../../auth/authorization';
// import { RoleCodeEnum } from '../../../database/model/workon/Role';
// import validator from '../../../helpers/validator';
// import roleSchema from './schema';
// import { ProtectedRequest } from 'app-request';
// import RoleRepo from '../../../database/repository/RoleRepo';
// import Role from '../../../database/model/workon/Role';
import AdminRoute from './admin'

const router = express.Router();

// admin routes
router.use('/admin',AdminRoute)

export default router;
