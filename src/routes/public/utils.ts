import Account from '../../database/model/finished/Account';
import _ from 'lodash';

export const enum AccessMode {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
}

export async function getUserData(account: Account) {
  const data = _.pick(account, ['accountName','avatar','roles','binding.email.account','_id','linkedTo.entity']);
  return data;
}
