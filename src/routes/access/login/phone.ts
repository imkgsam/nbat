import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import crypto from 'crypto';
import AccountRepo from '../../../database/repository/AccountRepo';
import { BadRequestError, AuthFailureError } from '../../../core/ApiError';
import KeystoreRepo from '../../../database/repository/KeystoreRepo';
import EntityRepo from '../../../database/repository/EntityRepo';
import { createTokens } from '../../../auth/authUtils';
import validator from '../../../helpers/validator';
import schema from '../schema';
import asyncHandler from '../../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import { getUserData } from '../utils';
import { PublicRequest } from '../../../types/app-request';
import Logger from '../../../core/Logger';
import { ProtectedRequest } from 'app-request';
import { SuccessMsgResponse } from '../../../core/ApiResponse';
import authentication from '../../../auth/authentication';
import User from '../../../database/model/Account';
import { RoleRequest } from 'app-request';
import { RoleCodeEnum } from '../../../database/model/Role';

const router = express.Router();

/**
 * login with phone and password
 */

/**
 * login with phone and phone verification code 
 */


export default router;
