import BarcodeItem, { BarcodeItemModel } from '../model/barcode/BarcodeItem';
import BarcodeType, { BarcodeTypeModel } from '../model/barcode/BarcodeType';
import { Types } from "mongoose"
import { genEID } from '../../helpers/utils';


const BarcodeItem = {
  create: async function create(newOne: BarcodeItem): Promise<BarcodeItem> {
    return await BarcodeItemModel.create(newOne);
  },
  findOneOrCreateForEmployee: async function findOneOrCreateForEmployee(name: string,inaugurationDate: Date,sex: string,employee: Types.ObjectId): Promise<BarcodeItem | null> {
    const found = await BarcodeItemModel.findOne({ ttype: 'Employee', item: employee })
    if(found)
      return found
    if(name && inaugurationDate && sex){
      const EID = genEID(name, inaugurationDate, sex)
      const EmployeeBarcodeType = await BarcodeTypeModel.findById('6604365182e422c9ee74b369')
      if( EmployeeBarcodeType && EID.length <= EmployeeBarcodeType?.length){
        return await BarcodeItemModel.create({
          ttype: 'Employee',
          btype: '6604365182e422c9ee74b369',
          item: employee,
          num: EID,
          meta: {
            enabled: true
          }
        });
      }
    }
    return null
  },
  update: async function update(updateOne: BarcodeItem): Promise<BarcodeItem | null> {
    return BarcodeItemModel.findByIdAndUpdate(updateOne._id, { $set: updateOne }, { new: true }).lean().exec();
  },
  enable: async function enable(id: string): Promise<BarcodeItem | null> {
    return BarcodeItemModel.findByIdAndUpdate(id, { 'meta.enabled': true }, { new: true }).lean().exec();
  },
  disable: async function disable(id: string): Promise<BarcodeItem | null> {
    return BarcodeItemModel.findByIdAndUpdate(id, { 'meta.enabled': false }, { new: true }).lean().exec();
  },
  findAll: async function findAll(): Promise<BarcodeItem[]> {
    return BarcodeItemModel.find({})
  },
  filters: async function filters(filters: any): Promise<BarcodeItem[]> {
    return []
  },
  delete: async function deleteOne(id: string): Promise<BarcodeItem | null> {
    return null
  }
}

const BarcodeType = {
  create: async function create(newOne: BarcodeType): Promise<BarcodeType> {
    return await BarcodeTypeModel.create(newOne);
  },
  update: async function update(updateOne: BarcodeType): Promise<BarcodeType | null> {
    return BarcodeTypeModel.findByIdAndUpdate(updateOne._id, { $set: updateOne }, { new: true }).lean().exec();
  },
  enable: async function enable(id: string): Promise<BarcodeType | null> {
    return BarcodeTypeModel.findByIdAndUpdate(id, { 'meta.enabled': true }, { new: true }).lean().exec();
  },
  disable: async function disable(id: string): Promise<BarcodeType | null> {
    return BarcodeTypeModel.findByIdAndUpdate(id, { 'meta.enabled': false }, { new: true }).lean().exec();
  },
  findAll: async function findAll(): Promise<BarcodeType[]> {
    return BarcodeTypeModel.find({})
  },
  filters: async function filters(filters: any): Promise<BarcodeType[]> {
    if(Object.keys(filters).includes('meta')){
      for (const key of Object.keys(filters.meta)){
        filters[`meta.${key}`] = filters.meta[key]
      }
      delete filters.meta
    }
    return BarcodeTypeModel.find(filters).lean().exec()
  },
  delete: async function deleteOne(id: string): Promise<BarcodeType | null> {
    return BarcodeTypeModel.findOneAndDelete({_id:id}).lean().exec()
  }
}

export default {
  BarcodeItem,
  BarcodeType
};
