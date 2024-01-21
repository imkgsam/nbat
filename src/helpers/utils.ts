import { Request } from 'express';
import moment from 'moment';
import Logger from '../core/Logger';
import {md5} from 'js-md5';

export function findIpAddress(req: Request) {
  try {
    if (req.headers['x-forwarded-for']) {
      return req.headers['x-forwarded-for'].toString().split(',')[0];
    } else if (req.connection && req.connection.remoteAddress) {
      return req.connection.remoteAddress;
    }
    return req.ip;
  } catch (e) {
    Logger.error(e);
    return undefined;
  }
}

export function addMillisToCurrentDate(millis: number) {
  return moment().add(millis, 'ms').toDate();
}

export function genEID(name: string, inauguratiionDate: Date, sex: string){
  const md5hash = md5(name)
  const year = inauguratiionDate.getFullYear().toString().slice(-3,)
  const month = inauguratiionDate.getMonth()
  const date = inauguratiionDate.getDate()
  const sexCode = sex === 'Male' ? 1 : sex === 'Female' ? 0 : 2
  return`${year}${md5hash[0]}${month}${md5hash[1]}${date}${sexCode}`
}