import VerificationCode, { VerificationCodeModel } from '../model/workon/system/VerificationCode';

/**
 * find verification code
 * @param account 
 * @param code 
 * @param operation 
 * @param method 
 * @returns 
 */
async function findOne(account: string, code: string, operation: string, method: string): Promise<VerificationCode | null> {
  return VerificationCodeModel.findOne({ account, code, operation, method }).lean().exec();
}

/**
 * find verification code then remove it
 * @param account 
 * @param code 
 * @param operation 
 * @param method 
 * @returns 
 */
async function findOneAndRemove(account: string, code: string, operation: string, method: string): Promise<VerificationCode | null> {
  return VerificationCodeModel.findOneAndDelete({ account, code, operation, method }).lean().exec();
}
/**
 * look up verification code, if not exist then create one new
 * @param account 
 * @param code 
 * @param operation 
 * @param method 
 * @returns 
 */
async function findOneorCreate(account: string, code: string, operation: string, method: string, id:string=''): Promise<VerificationCode> {
  const found = await VerificationCodeModel.findOne({ account, operation, method })
  if (found) {
    return found
  } else {
    if(id){
      return VerificationCodeModel.create({ account, code, method, operation, accountId:id })
    }else{
      return VerificationCodeModel.create({ account, code, method, operation })
    }
  }
}

export default {
  findOne,
  findOneAndRemove,
  findOneorCreate
};
