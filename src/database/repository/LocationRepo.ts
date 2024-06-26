import Location, { LocationModel } from '../model/workon/Location';
import { Types } from "mongoose"

async function findAll(): Promise<Location[]> {
  return LocationModel.find({}).populate('company')
    .lean()
    .exec();
}

async function create(newOne: Location): Promise<Location> {
  const createdOne = await LocationModel.create(newOne);
  return createdOne.toObject();
}

async function enable(id: Types.ObjectId): Promise<Location | null> {
  return LocationModel.findByIdAndUpdate(id,{'meta.enabled':true},{ new: true }).lean().exec();
}

async function disable(id: Types.ObjectId): Promise<Location | null> {
  return LocationModel.findByIdAndUpdate(id,{'meta.enabled':false},{ new: true }).lean().exec();
}

async function deleteOne(id: Types.ObjectId): Promise<Location | null> {
  return LocationModel.findOneAndDelete({_id:id},{ new: true }).lean().exec();
}

async function filters(filters: any) : Promise<Location[]>{
  return LocationModel.find(filters).lean().exec()
}

async function update(updateOne: Location): Promise<Location | null> {
  return LocationModel.findByIdAndUpdate(updateOne._id,{$set: updateOne},{ new: true }).lean().exec();
}

export default {
  create,
  update,
  enable,
  disable,
  findAll,
  filters,
  delete: deleteOne
};
