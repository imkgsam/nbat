import InccodeItem, { InccodeItemModel } from '../model/workon/inccode/InccodeItem';
import InccodeType, { InccodeTypeModel } from '../model/workon/inccode/InccodeType';
import { Types } from "mongoose"
import { genEID } from '../../helpers/utils';


const InccodeItem = {
  create: async function create(newOne: InccodeItem): Promise<InccodeItem> {
    return await InccodeItemModel.create(newOne);
  },
  createNWithType : async function createNWithType(type: string, n: number): Promise<InccodeItem[] | null> {
    if(type && n > 0){
      let rt = []
      switch(type){
        case 'Employee':
          break;
        case 'MoldItem':
          break
        default: 
          console.log('not implemented')
          rt = null as any
        }
      return rt
    }else{
      return null
    }
    
    
  },
  findOneOrCreateForEmployee: async function findOneOrCreateForEmployee(name: string,inaugurationDate: Date,sex: string,employee: Types.ObjectId): Promise<InccodeItem | null> {
    const found = await InccodeItemModel.findOne({ ttype: 'Employee', item: employee })
    if(found)
      return found
    if(name && inaugurationDate && sex){
      const EID = genEID(name, inaugurationDate, sex)
      const EmployeeInccodeType = await InccodeTypeModel.findById('6604365182e422c9ee74b369')
      if( EmployeeInccodeType && EID.length <= EmployeeInccodeType?.length){
        return await InccodeItemModel.create({
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
  update: async function update(updateOne: InccodeItem): Promise<InccodeItem | null> {
    return InccodeItemModel.findByIdAndUpdate(updateOne._id, { $set: updateOne }, { new: true }).lean().exec();
  },
  enable: async function enable(id: string): Promise<InccodeItem | null> {
    return InccodeItemModel.findByIdAndUpdate(id, { 'meta.enabled': true }, { new: true }).lean().exec();
  },
  disable: async function disable(id: string): Promise<InccodeItem | null> {
    return InccodeItemModel.findByIdAndUpdate(id, { 'meta.enabled': false }, { new: true }).lean().exec();
  },
  findAll: async function findAll(): Promise<InccodeItem[]> {
    return InccodeItemModel.find({}).populate('item').lean().exec()
  },
  filters: async function filters(filters: any): Promise<InccodeItem[]> {
    if(Object.keys(filters).includes('meta')){
      for (const key of Object.keys(filters.meta)){
        filters[`meta.${key}`] = filters.meta[key]
      }
      delete filters.meta
    }
    return InccodeItemModel.find(filters).lean().exec()
  },
  delete: async function deleteOne(id: string): Promise<InccodeItem | null> {
    return null
  }
}

const InccodeType = {
  create: async function create(newOne: InccodeType): Promise<InccodeType> {
    return await InccodeTypeModel.create(newOne);
  },
  update: async function update(updateOne: InccodeType): Promise<InccodeType | null> {
    return InccodeTypeModel.findByIdAndUpdate(updateOne._id, { $set: updateOne }, { new: true }).lean().exec();
  },
  enable: async function enable(id: string): Promise<InccodeType | null> {
    return InccodeTypeModel.findByIdAndUpdate(id, { 'meta.enabled': true }, { new: true }).lean().exec();
  },
  disable: async function disable(id: string): Promise<InccodeType | null> {
    return InccodeTypeModel.findByIdAndUpdate(id, { 'meta.enabled': false }, { new: true }).lean().exec();
  },
  findAll: async function findAll(): Promise<InccodeType[]> {
    return InccodeTypeModel.find({})
  },
  filters: async function filters(filters: any): Promise<InccodeType[]> {
    if(Object.keys(filters).includes('meta')){
      for (const key of Object.keys(filters.meta)){
        filters[`meta.${key}`] = filters.meta[key]
      }
      delete filters.meta
    }
    return InccodeTypeModel.find(filters).lean().exec()
  },
  delete: async function deleteOne(id: string): Promise<InccodeType | null> {
    return InccodeTypeModel.findOneAndDelete({_id:id}).lean().exec()
  }
}

export default {
  InccodeItem,
  InccodeType
};
