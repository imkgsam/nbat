import { Request } from 'express';
import moment from 'moment';
import Logger from '../core/Logger';
import {md5} from 'js-md5';
import crypto from 'crypto';
/**
 * retrive ip address from request header
 * @param req 
 * @returns ip or undifined
 */
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

/**
 * add mili-sec to current time
 * @param millis 
 * @returns Date
 */
export function addMillisToCurrentDate(millis: number) {
  return moment().add(millis, 'ms').toDate();
}

export function generateNdigitRandomNumber(n: number,min?: number,max?: number){
  if(n<1){
    throw new Error('N should be greater than 0')
  }else{
    let nmin = Math.pow(10,n-1)
    let nmax = Math.pow(10,n)-1
    if(n==1) {
      nmin--
    }
    if(min && max && min <= max){
      if(min > nmin){
        nmin = min
      }
      if(max < nmax){
        nmax = max
      }
    }
    return crypto.randomInt(nmin,nmax).toString().padEnd(n,'0')
  }
}


export function generate6DigitRandomNumber(){
  return generateNdigitRandomNumber(6,100000,999999)
}


































 //员工编号-(唯一识别号, [年]-[h3/1]-[月]-[h3/2]-[日]-[h3/3]-[性别] md5-hash后三位975 陈双鹏2024年01月01日入职男 2490170151 )
export function genEID(name: string, inaugurationDate: Date, sex: string){
  inaugurationDate = new Date(inaugurationDate)
  const md5hash = selectFirstNdigits(3,md5(name).toString(),'000')
  const year = inaugurationDate.getFullYear().toString().slice(-2,)
  const month = ('0'+inaugurationDate.getMonth()).slice(-2,)
  const date = ('0'+inaugurationDate.getDate()).slice(-2,)
  const sexCode = sex === 'Male' ? 1 : sex === 'Female' ? 0 : 2
  console.log(md5hash ,year ,month ,date ,sexCode)
  return `${year}${md5hash[0]}${month}${md5hash[1]}${date}${md5hash[2]}${sexCode}`
}


function selectFirstNdigits(count: number, input: string, defaultRt: string){
  if(!count || !input)
    return defaultRt
  if(count> input.length)
    return defaultRt
  let rt = ''
  for(let i=0;i<input.length;i++){
    if(isDigit(input[i])){
      rt=rt+input[i]
      if(rt.length=== count)
        break
    }
  }
  if(rt.length === count){
    return rt
  }
  return defaultRt
}

const isDigit = (character: string): boolean => {
  const DIGIT_EXPRESSION: RegExp = /^\d$/;
  if(!character)
    return false
  return DIGIT_EXPRESSION.test(character);
};

export function findOneSpotInSequence (arr: any[],min: number): number {
  console.log(arr,min)
  let rt = min
  if(arr && arr.length>0 ){
    for(let i=1; i< arr.length;i++){
      if(arr[i]-arr[i-1] !=1){
        rt = arr[i-1] + 1
        break
      }
    }
  }
  return rt
}

export function findNSpotInSequence( arr: any[],min:number,max: number, n:number): number[] {
  const rt = [] as number[]
  if(n && n>0 && arr && arr.length > 0){
    for(let i=1; i< arr.length;i++){
      if(arr[i]-arr[i-1] !=1){
        let diff = arr[i] - arr[i-1]
        let start = 1
        while(diff >1){
          rt.push(arr[i-1]+start)
          diff = diff -1
          n = n -1
          start = start + 1
          if(n===0){
            return rt
          }
        }
      }
    }
    let start = 1
    while(n>0){
      rt.push(max+start)
      start = start + 1
      n=n-1
    }
  }
  return rt
}