import MoldItem, { MoldItemModel } from '../model/mold/MoldItem';
import MoldGroup, { MoldGroupModel } from '../model/mold/MoldGroup';
import { Types } from "mongoose"


const MoldItem = {
  create: async function create(newOne: MoldItem): Promise<MoldItem> {
    return await MoldItemModel.create(newOne);
  },
  findAll: async function findAll(): Promise<MoldItem[]> {
    return MoldItemModel.find({}).lean().exec()
  },
  enable: async function enable(id: string): Promise<MoldItem | null> {
    return MoldItemModel.findByIdAndUpdate(id, { 'meta.enabled': true }, { new: true }).lean().exec();
  },
  disable: async function disable(id: string): Promise<MoldItem | null> {
    return MoldItemModel.findByIdAndUpdate(id, { 'meta.enabled': false }, { new: true }).lean().exec();
  },
  filters: async function filters(filters: any): Promise<MoldItem[]> {
    return []
  },
  delete: async function deleteOne(id: string): Promise<MoldItem | null> {
    return null
  },
  update: async function update(updateOne: MoldItem): Promise<MoldItem | null> {
    return MoldItemModel.findByIdAndUpdate(updateOne._id, { $set: updateOne }, { new: true }).lean().exec();
  },
  
}

const MoldGroup = {
  create: async function create(newOne: MoldGroup): Promise<MoldGroup> {
    return await MoldGroupModel.create(newOne);
  },
  findAll: async function findAll(): Promise<MoldGroup[]> {
    return MoldGroupModel.find({})
  },
  update: async function update(updateOne: MoldGroup): Promise<MoldGroup | null> {
    return MoldGroupModel.findByIdAndUpdate(updateOne._id, { $set: updateOne }, { new: true }).lean().exec();
  },
  enable: async function enable(id: string): Promise<MoldGroup | null> {
    return MoldGroupModel.findByIdAndUpdate(id, { 'meta.enabled': true }, { new: true }).lean().exec();
  },
  disable: async function disable(id: string): Promise<MoldGroup | null> {
    return MoldGroupModel.findByIdAndUpdate(id, { 'meta.enabled': false }, { new: true }).lean().exec();
  },
  filters: async function filters(filters: any): Promise<MoldGroup[]> {
    if(Object.keys(filters).includes('meta')){
      for (const key of Object.keys(filters.meta)){
        filters[`meta.${key}`] = filters.meta[key]
      }
      delete filters.meta
    }
    return MoldGroupModel.find(filters).lean().exec()
  },
  delete: async function deleteOne(id: string): Promise<MoldGroup | null> {
    return MoldGroupModel.findOneAndDelete({_id:id}).lean().exec()
  }
}

export default {
  MoldItem,
  MoldGroup
};
