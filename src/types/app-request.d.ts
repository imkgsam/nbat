import { Request } from 'express';
import Account from '../database/model/Account';
import Keystore from '../database/model/Keystore';
import ApiKey from '../database/model/ApiKey';

declare interface PublicRequest extends Request {
  apiKey: ApiKey;
}

declare interface RoleRequest extends PublicRequest {
  currentRoleCodes: string[];
}

declare interface ProtectedRequest extends RoleRequest {
  account: Account;
  accessToken: string;
  keystore: Keystore;
}

declare interface Tokens {
  accessToken: string;
  refreshToken: string;
  expires: Date
}
