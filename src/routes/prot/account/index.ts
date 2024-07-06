import express from 'express';
import { FailureMsgResponse, SuccessResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import AccountRepo from '../../../database/repository/AccountRepo';
import schema from './schema'
import validator, { ValidationSourceEnum } from '../../../helpers/validator';
import { ProtectedRequest } from 'app-request';
import Account from '../../../database/model/finished/Account';
import { VerificationMethodsEnum } from '../../../database/model/workon/system/VerificationCode';
import { generate6DigitRandomNumber } from '../../../helpers/utils';
import VerificationCodeRepo from '../../../database/repository/VerificationCodeRepo';
import { OperationsEnum } from '../../../database/model/workon/system/VerificationCode';
import { sendSMSText } from '../../../services/sms';
import { sendMail } from '../../../services/email';
import AdminRoute from './admin'

const router = express.Router();

/**
 * role: Everyone
 * 更新账户基本信息，不涉及roles 以及登录邮箱
 */
router.put('/',
  validator(schema.updateAccountProfile),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await AccountRepo.update({ ...req.body } as Account);
    return new SuccessResponse('Operation success', { ...updatedOne, roles: updatedOne?.roles.map(each => each.code) }).send(res);
  }),
);


/**
 * role: Everyone
 * 申请账户添加或修改绑定邮箱/手机
 * status: totest
 */
router.post('/',
  validator(schema.updateBinding),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const { method, account } = req.body
    if(!method || !account)
      return new FailureMsgResponse('Data missing')
    let found = null
    if (method === VerificationMethodsEnum.Email)
      found = await AccountRepo.findOneBy({ 'binding.email.account': account })
    else if (method === VerificationMethodsEnum.Phone)
      found = await AccountRepo.findOneBy({ 'binding.phone.account': account })
    else
      console.log('not support')
    if (found) {
      return new FailureMsgResponse(`This ${method} ${account} is occupied`).send(res)
    } else {
      const code = generate6DigitRandomNumber()
      const vcobj = await VerificationCodeRepo.findOneorCreate(account, code, OperationsEnum.UpdateBinding, method, req.account._id.toString())
      switch (method) {
        case VerificationMethodsEnum.Email:
          await sendMail(account, `Your one-time Verification code is ${vcobj.code}`)
          break
        case VerificationMethodsEnum.Phone:
          await sendSMSText(account, `Your one-time Verification code is ${vcobj.code}`)
          break
      }
      return new SuccessResponse('Operation Success').send(res)
    }
  })
)


/**
 * role: Everyone
 * 验证并确认 添加或修改绑定邮箱/手机
 * status: totest
 */
router.post('/',
  validator(schema.verifyupdateBinding),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const { method, account, code } = req.body
    if(!method || !account || !code)
      return new FailureMsgResponse('Data missing')
    const vcobj = await VerificationCodeRepo.findOneAndRemove(account,code,OperationsEnum.UpdateBinding,method)
    if(vcobj){
      if(vcobj.accountId && vcobj.accountId === req.account._id){
        const foundAccount = await AccountRepo.findById(vcobj.accountId)
        if(foundAccount){
          switch(method){
            case VerificationMethodsEnum.Email:
              foundAccount.binding.email.account = account
              foundAccount.binding.email.verified = true
              break
            case VerificationMethodsEnum.Phone:
              foundAccount.binding.phone = {account,verified:true}
              break
          }
          const updatedOne = await AccountRepo.update(foundAccount)
          return new SuccessResponse('Operation success',{updatedOne})
        }else{
          return new FailureMsgResponse('Account not found').send(res)
        }
      }else{
        return new FailureMsgResponse('Account not matched').send(res)
      }
    }else{
      return new FailureMsgResponse('Code is invalid').send(res)
    }
  })
)


// admin routes
router.use('/admin',AdminRoute)

export default router;
