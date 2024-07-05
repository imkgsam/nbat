import Account, { AccountModel } from '../model/finished/Account';
import { RoleModel } from '../model/workon/Role';
import { InternalError } from '../../core/ApiError';
import { Types } from 'mongoose';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../model/workon/system/Keystore';

async function findAll(): Promise<Account[]> {
  return AccountModel.find({}).lean().exec();
}

async function filters(filters: object): Promise<Account[]> {
  return AccountModel.find(filters).lean().exec();
}

async function exists(id: Types.ObjectId): Promise<boolean> {
  const account = await AccountModel.exists({ _id: id, 'meta.enabled': true });
  return account !== null && account !== undefined;
}

async function findPrivateProfileById(
  id: Types.ObjectId,
): Promise<Account | null> {
  return AccountModel.findOne({ _id: id, 'meta.enabled': true ,'meta.verified':true })
    .select('+email')
    .populate({
      path: 'roles',
      match: { 'meta.enabled': true },
      select: "+code -_id -meta",
    })
    .lean<Account>()
    .exec();
}

// contains critical information of the user
async function findById(id: Types.ObjectId): Promise<Account | null> {
  return AccountModel.findOne({ _id: id, 'meta.enabled': true })
    .select('+email +password +roles')
    .populate({
      path: 'roles',
      match: { 'meta.enabled': true },
    })
    .lean()
    .exec();
}

async function findOneByEmail(email: string): Promise<Account | null> {
  console.log(email)
  return AccountModel.findOne({ 'binding.email.account': email })
    .select(
      '+binding.email.account +security.password +roles +_id +linkedTo.entity',
    )
    .populate({
      path: 'roles',
      match: { 'meta.enabled': true },
      select: { code: 1, _id: 0 },
    })
    .lean()
    .exec();
}


async function findOneByEmailorPhone(account: string): Promise<Account | null> {
  console.log(account)
  return AccountModel.findOne({ $or :[{'binding.email.account': account},{'binding.phone.account':account}] })
    .select(
      '+binding.email.account +binding.phone.account +security.password +roles +_id +linkedTo.entity',
    )
    .populate({
      path: 'roles',
      match: { 'meta.enabled': true },
      select: { code: 1, _id: 0 },
    })
    .lean()
    .exec();
}

async function findFieldsById(
  id: Types.ObjectId,
  ...fields: string[]
): Promise<Account | null> {
  return AccountModel.findOne({ _id: id, 'meta.enabled': true }, [...fields])
    .lean()
    .exec();
}

async function findPublicProfileById(id: Types.ObjectId): Promise<Account | null> {
  return AccountModel.findOne({ _id: id, 'meta.enabled': true }).lean().exec();
}

async function create(
  account: Account,
  accessTokenKey: string,
  refreshTokenKey: string,
  roleCode: string,
): Promise<{ account: Account; keystore: Keystore }> {
  const role = await RoleModel.findOne({ code: roleCode })
    .select('+code')
    .lean()
    .exec();
  if (!role) throw new InternalError('Role must be defined');

  account.roles = [role];
  const createdUser = await AccountModel.create(account);
  const keystore = await KeystoreRepo.create(
    createdUser,
    accessTokenKey,
    refreshTokenKey,
  );
  return {
    account: { ...createdUser.toObject(), roles: account.roles },
    keystore: keystore,
  };
}

// async function update(
//   account: Account,
//   accessTokenKey: string,
//   refreshTokenKey: string,
// ): Promise<{ account: Account; keystore: Keystore }> {
//   account.updatedAt = new Date();
//   await AccountModel.updateOne({ _id: account._id }, { $set: { ...account } })
//     .lean()
//     .exec();
//   const keystore = await KeystoreRepo.create(
//     account,
//     accessTokenKey,
//     refreshTokenKey,
//   );
//   return { account, keystore: keystore };
// }


async function update(updatedOne: Account): Promise<Account | null> {
  return AccountModel.findByIdAndUpdate(updatedOne._id,{$set: updatedOne},{ new: true }).populate('roles','code').lean().exec()
}

async function updateInfo(account: Account): Promise<any> {
  account.updatedAt = new Date();
  return AccountModel.updateOne({ _id: account._id }, { $set: { ...account } })
    .lean()
    .exec();
}

async function changePassword(email: string,newPassword: string,): Promise< Account | null> {
  return AccountModel.findOneAndUpdate({ email: email }, { $set: { password: newPassword } }, {new: true}).lean().exec();
}


async function disable(id: Types.ObjectId): Promise<Account | null> {
  return AccountModel.findByIdAndUpdate(id,{$set: {'meta.enabled':false}},{ new: true }).lean().exec()
}

async function enable(id: Types.ObjectId): Promise<Account | null> {
  return AccountModel.findByIdAndUpdate(id,{$set: {'meta.enabled':true}},{ new: true }).lean().exec()
}

export default {
  exists,
  findPrivateProfileById,
  findById,
  findOneByEmail,
  findOneByEmailorPhone,
  findFieldsById,
  findPublicProfileById,
  create,
  update,
  updateInfo,
  changePassword,
  findAll,
  filters,
  disable,
  enable
};
