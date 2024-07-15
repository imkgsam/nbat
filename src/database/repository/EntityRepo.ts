import Account, { AccountModel } from '../model/finished/Account';
import Employee, { EmployeeModel } from '../model/workon/Employee';
import Entity, { EntityModel, EntityTypeEnum } from '../model/finished/Entity';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import InccodeRepo from './InccodeRepo';
// import { genEID } from '../../helpers/utils';




/**
 *  用户获取profile
 */
async function findEntityDetailedInfoByUserId(id: Types.ObjectId): Promise<Entity | null> {
  console.log(id)
  return EntityModel.findOne({
    account: id
  })
    .select('+accountName +roles +email')
    .populate({
      path: 'employee', populate: [
        { path: 'departments' }, { path: 'EID', populate: { path: 'btype' } }
      ]
    })
    .populate('scompany', "name")
    .lean()
    .exec();
}


async function findOneByIdOrName(idOrName: string | Types.ObjectId): Promise<Entity | null> {
  return EntityModel.findOne({
    $and: [
      {
        'meta.enabled': true,
        'meta.verified': true,
        etype: EntityTypeEnum.PERSON,
        employee: { $ne: null },
      },
      { $or: [{ _id: idOrName }, { name: idOrName }] },
    ],
  })
    .lean()
    .exec();
}

async function findOneOrCreate(input: Entity): Promise<Entity> {
  const createdOne = await EntityModel.create(input);
  return createdOne.toObject();
}

async function findAllwithFilters(filters: object = {}): Promise<Entity[]> {
  return (
    EntityModel.find(filters)
      .select("name")
      .lean()
      .exec()
  );
}


async function findOneVECompanyByName(name: string): Promise<Entity | null> {
  return EntityModel.findOne({ name: name, etype: EntityTypeEnum.COMPANY, 'meta.enabled': true, 'meta.verified': true })
    .lean()
    .exec();
}


async function findOneByIdAndSetEmployee(entityId: Types.ObjectId, employeeId: Types.ObjectId): Promise<Entity | null> {
  return EntityModel.findOneAndUpdate({ _id: entityId }, { employee: employeeId }, { new: true })
    .lean()
    .exec();
}

async function findOneEEbyId(id: Types.ObjectId): Promise<Entity | null> {
  return EntityModel.findOne({ _id: id }).populate('employee')
    .lean()
    .exec();
}


// ------------------------ 

const Company = {
  create: (newOne: Entity) => create(newOne, EntityTypeEnum.COMPANY),
  update,
  filter: (filter: Entity) => filters(filter, EntityTypeEnum.COMPANY),
  delete: deleteOne
}

const Person = {
  create: (newOne: Entity) => create(newOne, EntityTypeEnum.PERSON),
  update,
  filter: (filter: Entity) => filters(filter, EntityTypeEnum.PERSON),
  delete: deleteOne
}

const Employee = {
  filter: async function filter(filters: any) {
    filters['etype'] = EntityTypeEnum.PERSON
    for (const key of Object.keys(filters.meta)) {
      filters[`meta.${key}`] = filters.meta[key]
    }
    delete filters.meta
    return EntityModel.find(filters).populate('account').populate({ path: 'employee', populate: [{ path: 'departments' }, { path: 'EID', populate: { "path": 'btype' } }] }).lean().exec()
  },
  create: async function create(newOne: Entity): Promise<Entity | null> {
    const employee = newOne.employee
    const account = newOne.account
    delete newOne.employee
    delete newOne.account
    const newEntity = await EntityModel.create({ ...newOne, etype: EntityTypeEnum.PERSON })
    if (newEntity) {
      if (newOne.meta.isEmployee && employee) {
        const newEmployee = await EmployeeModel.create({ ...employee, entity: newEntity._id })
        if (newEmployee) {
          newEntity.employee = newEmployee._id
          if (newEmployee.inaugurationDate && newOne?.personal?.sex && newOne?.name) {
            const newCode = await InccodeRepo.InccodeItem.findOneOrCreateForEmployee(newOne?.name, newEmployee.inaugurationDate, newOne?.personal?.sex, newEmployee._id)
            if (newCode) {
              newEmployee.EID = newCode._id
              await newEmployee.save()
            }
          }
        }
      }
      if (newOne.meta.isUser && account) {
        const { password } = account as any
        if (password) {
          const passwordHash = await bcrypt.hash(password, 10);
          const newAccount = await AccountModel.create({ ...account, entity: newEntity._id, password: passwordHash })
          if (newAccount) {
            console.log(5)
            newEntity.account = newAccount._id
          }
        }
      }
      await newEntity.save()
      const rt = await (await (newEntity.populate('account'))).populate('employee')
      return rt
    }
    return null
  },
  update: async function update(updateOne: Entity): Promise<Entity | null> {
    const updateAccount = updateOne.account as Account
    const updateEmployee = updateOne.employee as Employee
    delete updateOne.account
    delete updateOne.employee
    const updatedEntity = await EntityModel.findOneAndUpdate({ _id: updateOne._id }, { $set: updateOne }, { new: true })
    if (updatedEntity) {
      if (updatedEntity.meta.isUser) {
        if (updateAccount) {
          const { password } = updateAccount as any
          if (password) {
            await AccountModel.findOneAndUpdate({ entity: updatedEntity._id }, { $set: { ...updateAccount, password: await bcrypt.hash(password, 10) } }, { new: true, upsert: true })
          } else {
            await AccountModel.findOneAndUpdate({ entity: updatedEntity._id }, { $set: { ...updateAccount } }, { new: true, upsert: true })
          }
        } else {
          await AccountModel.findOneAndDelete({ entity: updatedEntity._id })
        }
      }
      if (updatedEntity.meta.isEmployee) {
        if (updateEmployee) {
          let newCode = null
          if (!updateEmployee.EID && updateEmployee.inaugurationDate && updatedEntity?.personal?.sex && updatedEntity?.name) {
            newCode = await InccodeRepo.InccodeItem.findOneOrCreateForEmployee(updatedEntity?.name, updateEmployee.inaugurationDate, updatedEntity?.personal?.sex, updateEmployee._id)
          }
          await EmployeeModel.findOneAndUpdate({ entity: updatedEntity._id }, { $set: { ...updateEmployee, EID: updateEmployee?.EID || newCode } }, { new: true, upsert: true })
        }
      }
      return EntityModel.findById(updateOne._id).populate('account').populate('employee').lean().exec()
    } else {
      return null
    }
  },
  deleteOne: async function deleteOne(id: Types.ObjectId): Promise<Entity | null> {
    const deletedEntity = await EntityModel.findOneAndDelete({ _id: id })
    if (deletedEntity) {
      if (deletedEntity.account)
        AccountModel.findOneAndDelete({ entity: deletedEntity._id })
      if (deletedEntity.employee)
        EmployeeModel.findOneAndDelete({ entity: deletedEntity._id })
    }
    return deletedEntity
  }
}

//          ------------------------ share functions ---------------------
async function enable(id: Types.ObjectId): Promise<Entity | null> {
  return EntityModel.findByIdAndUpdate(id, { 'meta.enabled': true }, { new: true },).lean().exec();
}
async function disable(id: Types.ObjectId): Promise<Entity | null> {
  return EntityModel.findByIdAndUpdate(id, { 'meta.enabled': false }, { new: true },).lean().exec();
}
async function verify(id: Types.ObjectId): Promise<Entity | null> {
  return EntityModel.findOneAndUpdate(
    { _id: id, 'meta.verified': false },
    { 'meta.verified': true },
    { new: true },
  )
    .lean()
    .exec();
}
async function create(newOne: Entity, type: EntityTypeEnum): Promise<Entity> {
  newOne.etype = type
  return EntityModel.create(newOne)
}
async function update(updateOne: Entity): Promise<Entity | null> {
  return EntityModel.findByIdAndUpdate(updateOne._id, { $set: updateOne }, { new: true }).lean().exec();
}
async function filters(filters: any, type: EntityTypeEnum): Promise<Entity[]> {
  filters['etype'] = type
  for (const key of Object.keys(filters.meta)) {
    filters[`meta.${key}`] = filters.meta[key]
  }
  delete filters.meta
  console.log(filters)
  return EntityModel.find(filters).populate('account');
}
async function deleteOne(id: Types.ObjectId): Promise<Entity | null> {
  return EntityModel.findOneAndDelete({ _id: id }).lean().exec();
}



export default {
  findOneOrCreate,

  findOneByIdOrName,
  findOneVECompanyByName,
  findOneByIdAndSetEmployee,
  // createCompany,
  // createPerson,
  findAllwithFilters,
  findOneEEbyId,
  findEntityDetailedInfoByUserId,

  Person,
  Company,
  Employee,


  // shared function 
  enable,
  disable,
  verify,
};
