import { Schema, model, Types } from 'mongoose';
const { String, Boolean, ObjectId, Number } = Schema.Types

export const DOCUMENT_NAME = 'Employee';
export const COLLECTION_NAME = 'employees';

// 员工类型
export enum EmployeeTypeEnum {
  //全职
  FULLTIME = 'Fulltime',
  //实习，未毕业
  INTERN = 'Intern',
  // 零时工，或是 parttime
  TEMPORARY = 'Temporary',
  //合同工
  CONTRACT = 'Contract',
  //试用工
  PROBATIONARY = "Probationary" 
}
// 试用结果类型
export enum probationResultTypeEnum {
  // 免试通过
  PPASS = 'Pass Pass',
  // 到期通过
  RPASS = 'Regular Pass',
  // 提前通过
  EPASS = 'Ealier Pass',
  // 延期通过
  DPASS = 'Delayed Pass',
  // 到期不通过
  FAIL = 'Regular Fail',
  // 提前不通过
  EFAIL = 'Ealier Fail',
  // 延期不通过
  DFAIL = 'Delayed Fail'
}
//学历类型
export enum EducationTypeEnum {
  //小学教育
  PSE = 'Primary school education',
  //初中教育
  MSE = 'Middle school education',
  //高中教育
  HSE = 'High school education',
  //中专
  SVE = 'Secondary vocational education',
  //大专
  HVE = 'Higher vocational education',
  //本科
  UGE = "Undergraduate education",
  //硕士
  MST = 'Master',
  //博士生
  PHD = 'Doctor'
}
//婚姻状态
enum MaritalStatusTypeEnum {
  // 单身
  SINGLE = 'Single',
  //已婚
  MARRIED = 'Married',
  //丧偶
  WIDOWED = 'Widowed',
  //离异
  DIVORCED = 'Divorced'
}

export default interface Employee {
  _id: Types.ObjectId;
  //关联主体 唯一 必填
  entity: Types.ObjectId;
  //种类，
  etype: EmployeeTypeEnum;
  //部门s,可隶属多个部门
  departments?:Types.ObjectId[];
  //直系管理员，
  manager?: Types.ObjectId;
  //工作座机
  workPhone?: string;
  //工作手机
  workMobile?: string;
  //工作邮箱
  workEmail?: string;
  //员工编号-(唯一识别号, [年]-[h3/1]-[月]-[h3/2]-[日]-[h3/3]-[性别] md5-hash后三位975 陈双鹏2024年01月01日入职男 2490170151 )
  EID?: string;
  //ETL 员工职称等级(K为管理体系，P为普通员工体系 K1-9 P1-9 如有细分则为 K1.1 K3.2 P7.4 ...)
  ETL?: string;
  //入职日期 = 试用期起始日期 = 进入公司的日期
  inauguratiionDate?: Date;
  //试用期
  probation?:{
    //试用期开始时间
    startDate?: Date;
    //计划试用时间 按天算
    period?: number;
    //试用期实际结束日期：提前转正，延期试用
    actualEndDate?: Date;
    //试用期结果
    result?: EmployeeTypeEnum;
    //试用期结果备注
    note?: string;
  },
  //个人隐私
  privacy?:{
    //家庭情况
    family?:{
      //婚姻情况
      status?: MaritalStatusTypeEnum,
      //需抚养子女数量
      dependentChildrenCount?: number
    },
    //国籍
    nationality?:{
      //出生国家
      country?: string,
      //出生城市
      city?: string,
      //出生日期
      birth?: Date,
      //身份证
      ID?: string,
      //护照
      passport?: string
      //税号
      taxNo?: string;
      //驾照号
      driverLicense?: string;
    },
    //紧急联系
    emergency?:{
      //联系人
      contact?: string,
      //联系电话
      phone?: string
    }
  },
  //教育
  education?:{
    //最高学历
    qulification?: EducationTypeEnum,
    //毕业院校
    school?: string,
    //毕业日期
    graduatedAt?: Date,
    //专业
    major?: string
  },
  meta:{
    //是否有效，当试用期结束时，1.如果通过则开启，如果不通过则关闭
    enabled: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Employee>(
  {
    entity: {
      type: ObjectId,
      required: true,
      unique:true
    },
    etype: {
      type: String,
      required:true,
      default: EmployeeTypeEnum.FULLTIME,
      enum: Object.values(EmployeeTypeEnum)
    },
    departments: [{
      type: ObjectId,
      ref:'Department'
    }],
    manager:{
      //只能是person，不能是公司entity
      type: ObjectId,
      ref: 'Entity'
    },
    workPhone:{
      type: String
    },
    workMobile:{
      type: String
    },
    workEmail:{
      type: String
    },
    EID: {
      type: String,
      trim:true
    },
    ETL: {
      type: String,
      trim:true
    },
    inauguratiionDate: {
      type: Schema.Types.Date,
    },
    probation:{
      period:{
        type: Number,
        // 默认试用期是90天
        default: 90
      },
      startDate:{
        type: Schema.Types.Date
      },
      actualEndDate:{
        type: Schema.Types.Date
      },
      result:{
        type: String,
        enum: Object.values(probationResultTypeEnum)
      },
      note:{
        type: String
      }
    },
    privacy:{
      family:{
        status: {
          type:String,
          enum: Object.values(MaritalStatusTypeEnum)
        },
        dependentChildrenCount:{
          type: Number
        }
      },
      nationality:{
        country: {
          type: String,
          trim:true
        },
        city: {
          type: String,
          trim:true
        },
        birth: {
          type: Schema.Types.Date,
        },
        ID: {
          type: String,
          unique: true,
          trim: true,
        },
        passport: {
          type: String,
          unique: true,
          trim: true,
        }
      },
      emergency:{
        contact: {
          type: String,
          trim: true
        },
        phone: {
          type: String,
          trim: true
        }
      }
    },
    education:{
      qulification: {
        type: String,
        enum: Object.values(EducationTypeEnum)
      },
      school: {
        type: String,
        trim: true
      },
      graduatedAt: {
        type: Schema.Types.Date
      }
    },
    meta:{
      enabled: {
        type: Boolean,
        default: false,
      }
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      default: new Date(),
      select: false
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      default: new Date(),
      select: false
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ entity: 1});


export const EmployeeModel = model<Employee>(DOCUMENT_NAME, schema, COLLECTION_NAME);