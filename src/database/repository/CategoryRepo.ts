import Category, { CategoryModel } from '../model/Category';


async function create(category: Category): Promise<Category> {
  const createdOne = await CategoryModel.create(category);
  return createdOne.toObject();
}

async function findAll(options: object): Promise<Category[]> {
  return CategoryModel.find(options)
}

async function detail(id: string): Promise<Category | null> {
  return CategoryModel.findById(id)
}

export default {
  create,
  findAll,
  detail
};
