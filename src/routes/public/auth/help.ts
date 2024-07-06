import express from 'express';
import { SuccessResponse, FailureMsgResponse } from '../../../core/ApiResponse';
import VerificationCodeRepo from '../../../database/repository/VerificationCodeRepo';
import AccountRepo from '../../../database/repository/AccountRepo';
import validator from '../../../helpers/validator';
import schema from '../schema';
import asyncHandler from '../../../helpers/asyncHandler';
import { PublicRequest } from '../../../types/app-request';
import { VerificationMethodsEnum, OperationsEnum } from '../../../database/model/workon/system/VerificationCode';
import { generate6DigitRandomNumber } from '../../../helpers/utils';
import { sendMail } from '../../../services/email';
import { sendSMSText } from '../../../services/sms';
import { BadRequestError, AuthFailureError } from '../../../core/ApiError';
import bcrypt from 'bcrypt';

const router = express.Router();


/**
 * forget password by email, step 1: submit and send vcode
 */
router.post(
    '/forgetpw/submit',
    validator(schema.forgetPassword_submit),
    asyncHandler(async (req: PublicRequest, res) => {
        const { account, method } = req.body
        //check for method
        if (!method || !Object.values(VerificationMethodsEnum).includes(method)) {
            return new FailureMsgResponse('Invalid Method').send(res)
        }
        //check for existing Login Account
        const foundAccount = await AccountRepo.findOneByEmailorPhone(account)
        if (!foundAccount) {
            return new FailureMsgResponse('Account not available').send(res)
        }
        if (!foundAccount.meta.enabled || !foundAccount.meta.verified) {
            return new FailureMsgResponse('Account not enabled or verified, could not proceed').send(res)
        }
        const code = generate6DigitRandomNumber()
        const vcobj = await VerificationCodeRepo.findOneorCreate(account, code, OperationsEnum.ForgetPassword, method)
        switch (method) {
            case VerificationMethodsEnum.Email:
                await sendMail(account, `Your one-time Verification code is ${vcobj.code}`)
                break
            case VerificationMethodsEnum.Phone:
                await sendSMSText(account, `Your one-time Verification code is ${vcobj.code}`)
                break
        }
        return new SuccessResponse('Operation success')
    })
)

/**
 * forget password by email, step 2: verify vcode
 */
router.post(
    '/forgetpw/verify',
    validator(schema.forgetPassword_verify),
    asyncHandler(async (req: PublicRequest, res) => {
        const { method, account, code } = req.body
        const vc = await VerificationCodeRepo.findOne(account, code, OperationsEnum.ForgetPassword, method)
        if (vc) {
            new SuccessResponse('Operation Success').send(res)
        } else {
            new FailureMsgResponse('Invalid Code').send(res)
        }
    })
)


/**
 * forget password by email, step 2: verify vcode
 */
router.post(
    '/forgetpw/reset',
    validator(schema.forgetPassword_reset),
    asyncHandler(async (req: PublicRequest, res) => {
        const { method, account, code, newPassword } = req.body
        const vc = await VerificationCodeRepo.findOneAndRemove(account, code, OperationsEnum.ForgetPassword, method)
        if (vc) {
            const foundAccount = await AccountRepo.findOneByEmailorPhone(account);
            if (!foundAccount) throw new BadRequestError('User not Found');
            const newPasswordHash = await bcrypt.hash(newPassword, 10);
            const newAccount = await AccountRepo.changePassword(account,newPasswordHash)
            if(newAccount)
                return new SuccessResponse('Operation Success').send(res)
            else
                return new FailureMsgResponse('Operation failed').send(res)
        } else {
            return new FailureMsgResponse('Invalid Code').send(res)
        }
    })
)


export default router;
