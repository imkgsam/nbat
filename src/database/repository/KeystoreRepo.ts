import Keystore, { KeystoreModel } from '../model/workon/system/Keystore';
import { Types } from 'mongoose';
import Account from '../model/finished/Account';

async function findforKey(client: Account, key: string): Promise<Keystore | null> {
  return KeystoreModel.findOne({
    client: client,
    primaryKey: key,
    status: true,
  })
    .lean()
    .exec();
}

async function remove(id: Types.ObjectId): Promise<Keystore | null> {
  return KeystoreModel.findOneAndDelete({_id: id}).lean().exec();
}

async function removeAllForClient(client: Account) {
  return KeystoreModel.deleteMany({ client: client }).exec();
}

async function find(
  client: Account,
  primaryKey: string,
  secondaryKey: string,
): Promise<Keystore | null> {
  return KeystoreModel.findOne({
    client: client,
    primaryKey: primaryKey,
    secondaryKey: secondaryKey,
  })
    .lean()
    .exec();
}

async function create(
  client: Account,
  primaryKey: string,
  secondaryKey: string,
): Promise<Keystore> {
  const now = new Date();
  const keystore = await KeystoreModel.create({
    client: client,
    primaryKey: primaryKey,
    secondaryKey: secondaryKey,
    createdAt: now,
    updatedAt: now,
  });
  return keystore.toObject();
}

export default {
  findforKey,
  remove,
  removeAllForClient,
  find,
  create,
};
