import User from '../../database/model/Account';
import _ from 'lodash';

export const enum AccessMode {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
}

export async function getUserData(user: User) {
  const data = _.pick(user, ['accountName','avatar','roles','binding.email.account','_id','linkedTo.entity']);
  return data;
}
