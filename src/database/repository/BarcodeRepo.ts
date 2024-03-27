import BarcodeItem, { BarcodeItemModel } from '../model/BarcodeItem';
import BarcodeType, { BarcodeTypeModel } from '../model/BarcodeType';
import Role, { RoleModel } from '../model/Role';
import { Types } from "mongoose"


const BarcodeItem = {
  create: async function create(): Promise<BarcodeItem> {
    return {} as BarcodeItem
  },
  update: async function update(): Promise<BarcodeItem> {
    return {} as BarcodeItem
  },
  enable: async function enable(): Promise<BarcodeItem> {
    return { } as BarcodeItem
  },
  disable: async function disable(): Promise<BarcodeItem> {
    return { } as BarcodeItem
  },
  findAll: async function findAll(): Promise<BarcodeItem[]> {
    return []
  }
}

const BarcodeType = {
  create: async function create(newOne: BarcodeType): Promise<BarcodeType> {
    return await BarcodeTypeModel.create(newOne);
},
  update: async function update(updateOne: BarcodeType): Promise<BarcodeType | null> {
    return BarcodeTypeModel.findByIdAndUpdate(updateOne._id,{$set: updateOne},{ new: true }).lean().exec();
},
  enable: async function enable(id: string): Promise<BarcodeType | null> {
    return BarcodeTypeModel.findByIdAndUpdate(id,{'meta.enabled':true},{ new: true }).lean().exec();
},
  disable: async function disable(id: string): Promise<BarcodeType | null> {
    return BarcodeTypeModel.findByIdAndUpdate(id,{'meta.enabled':false},{ new: true }).lean().exec();
  },
  findAll: async function findAll(): Promise<BarcodeType[]> {
    return BarcodeTypeModel.find({})
  }
}



// async function findByCode(code: string): Promise<Role | null> {
//   return RoleModel.findOne({ code: code, 'meta.enabled': true }).lean().exec();
// }

// async function findByCodes(codes: string[]): Promise<Role[]> {
//   return RoleModel.find({ code: { $in: codes }, 'meta.enabled': true })
//     .lean()
//     .exec();
// }

// async function findByIds(ids: string[]): Promise<Role[]> {
//   return RoleModel.find({ _id: { $in: ids }, 'meta.enabled': true })
//     .lean()
//     .exec();
// }

// async function findAll(): Promise<Role[]> {
//   return RoleModel.find({})
//     // .select("-_id")
//     .lean()
//     .exec();
// }

// async function create(newRole: Role): Promise<Role> {
//   const createdRole = await RoleModel.create(newRole);
//   return createdRole.toObject();
// }

// async function enable(roleId: Types.ObjectId): Promise<Role | null> {
//   return RoleModel.findByIdAndUpdate(roleId,{'meta.enabled':true},{ new: true }).lean().exec();
// }

// async function disable(roleId: Types.ObjectId): Promise<Role | null> {
//   return RoleModel.findByIdAndUpdate(roleId,{'meta.enabled':false},{ new: true }).lean().exec();
// }

// async function filter(filters: object) : Promise<Role[]>{
//   return RoleModel.find(filters).lean().exec()
// }

// async function update(updatedOne: Role): Promise<Role | null> {
//   return RoleModel.findByIdAndUpdate(updatedOne._id,{$set: updatedOne},{ new: true }).lean().exec();
// }




export default {
  BarcodeItem,
  BarcodeType
};
