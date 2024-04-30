import MoldItem, { MoldItemModel } from '../model/mold/MoldItem';
import MoldGroup, { MoldGroupModel } from '../model/mold/MoldGroup';
import { Types } from "mongoose"


const MoldItem = {
  create: async function create(newOne: MoldItem, inBatch: boolean, count: number): Promise<MoldItem[]> {
    let rt = null
    if (inBatch && count > 1) {
      let lst = Array(count).fill(newOne)
      let imrt = await MoldItemModel.insertMany(lst)
      rt = imrt as MoldItem[]
    } else {
      rt = [await MoldItemModel.create(newOne)]
    }
    console.log(rt)
    const ids = rt.map(each=> each._id)
    
    return rt
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
    return MoldItemModel.find(filters).populate('supplier').populate('mold').populate('barcode').populate('product').populate('group.moldGroup').lean().exec()
  },
  delete: async function deleteOne(id: string): Promise<MoldItem | null> {
    return MoldItemModel.findOneAndDelete({ _id: id }).lean().exec()
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
    if (Object.keys(filters).includes('meta')) {
      for (const key of Object.keys(filters.meta)) {
        filters[`meta.${key}`] = filters.meta[key]
      }
      delete filters.meta
    }
    let rt = await MoldGroupModel.aggregate([
      {
        $match: filters
      },
      {
        $lookup: {
          from: "MoldItems",
          localField: '_id',
          foreignField: "group.moldGroup",
          as: "items"
        }
      },
      {
        $lookup: {
          from: "entites",
          localField: 'workers',
          foreignField: "_id",
          as: "workers"
        }
      },
      {
        $lookup: {
          from: "departments",
          localField: 'department',
          foreignField: "_id",
          as: "department"
        }
      },
      {
        $unwind: "$department"
      },
      {
        $lookup: {
          from: "entites",
          localField: 'manager',
          foreignField: "_id",
          as: "manager"
        }
      },
      {
        $unwind: "$manager"
      },
      {
        $lookup: {
          from: "Locations",
          localField: 'location',
          foreignField: "_id",
          as: "location"
        }
      },
      {
        $unwind: "$location"
      },
    ])
    rt = rt.map(each => {
      each['moldCount'] = each.items.length
      return each
    })
    return rt
    // return MoldGroupModel.find(filters).populate('workers').populate('department').populate('manager').populate('location').lean().exec()
  },
  delete: async function deleteOne(id: string): Promise<MoldGroup | null> {
    return MoldGroupModel.findOneAndDelete({ _id: id }).lean().exec()
  }
}

export default {
  MoldItem,
  MoldGroup
};
