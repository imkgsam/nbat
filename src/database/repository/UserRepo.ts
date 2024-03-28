import Account, { AccountModel } from '../model/Account';
import { RoleModel } from '../model/Role';
import { InternalError } from '../../core/ApiError';
import { Types } from 'mongoose';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../model/Keystore';



async function findAll(): Promise<Account[]> {
  return AccountModel.find({}).lean().exec();
}


async function filters(filters: object): Promise<Account[]> {
  if(!filters)
    filters = {}
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

async function findByEmail(email: string): Promise<Account | null> {
  return AccountModel.findOne({ email: email})
    .select(
      '+email +password +roles +_id +entity',
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

async function update(
  account: Account,
  accessTokenKey: string,
  refreshTokenKey: string,
): Promise<{ account: Account; keystore: Keystore }> {
  account.updatedAt = new Date();
  await AccountModel.updateOne({ _id: account._id }, { $set: { ...account } })
    .lean()
    .exec();
  const keystore = await KeystoreRepo.create(
    account,
    accessTokenKey,
    refreshTokenKey,
  );
  return { account, keystore: keystore };
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
export default {
  exists,
  findPrivateProfileById,
  findById,
  findByEmail,
  findFieldsById,
  findPublicProfileById,
  create,
  update,
  updateInfo,
  changePassword,
  findAll,
  filters
};
