/* eslint-disable @typescript-eslint/indent */
import type {HydratedDocument, Types} from 'mongoose';
import type {Category} from './model';
import type {Freet} from '../freet/model';
import CategoryModel from './model';
import FreetModel from '../freet/model';

/**
 * This file contains a class with functionality to interact with categories stored in MongoDB
 */

class CategoryCollection {
    /**
     * Add a new category
     *
     * @param name the name of the category
     * @param userId the userId of the user creating the category
     * @returns a promise of the created category
     */
    static async addOne(name: string, userId: Types.ObjectId | string): Promise<HydratedDocument<Category>> {
        const category = new CategoryModel({name, userId});
        await category.save();
        return category;
    }

    /**
     * Find a category by its name and userId
     *
     * @param name the name of the category
     * @param userId the userId of the user who created the category
     * @returns the category
     */
    static async findOneByUserIdAndName(name: string, userId: Types.ObjectId | string): Promise<HydratedDocument<Category>> {
        const category = await CategoryModel.findOne({name, userId});
        return category;
    }

    /**
     * Update a category's name
     *
     * @param categoryName the current category name
     * @param newName the new name for the category
     * @param userId the userId of the user updating the category
     * @returns the updated category
     */
    static async updateName(categoryName: string, newName: string, userId: Types.ObjectId | string): Promise<HydratedDocument<Category>> {
        const category = await CategoryModel.findOne({categoryName, userId});
        category.name = newName;
        await category.save();
        return category;
    }

    /**
     * Delete a category
     *
     * @param name the category name
     * @param userId the userId of the user who created the category
     * @returns boolean that is true if the category is deleted
     */
    static async deleteOne(name: string, userId: Types.ObjectId | string): Promise<boolean> {
        const category = await CategoryModel.deleteOne({name, userId});
        return category !== null;
    }

    /**
     * Find all categories belonging to a certain user
     *
     * @param userId the userId of the user whose categories we are finding
     * @returns a list of a user's categories
     */
    static async findAll(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Category>>> {
        return CategoryModel.find({userId});
    }

    /**
     * Find all freets belonging to a certain category
     *
     * @param categoryName the name of the category
     * @param userId the userId of the user who created the categories
     * @returns the freets in a specific category
     */
    static async findFreetsInCategory(categoryName: string, userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Freet>>> {
        const category = await CategoryModel.findOne({categoryName, userId});
        const freets = Promise.all(category.freets.map(async freetId => FreetModel.findById(freetId)));
        return freets;
    }

  /**
   * Add a freet to a category
   *
   * @param categoryName the name of the category
   * @param freetId the freet id to add to the category
   * @returns the updated category
   */
  static async addFreetToCategory(categoryName: string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Category>> {
    const freet = await FreetModel.findOne({_id: freetId});
    const category = await CategoryCollection.findOneByUserIdAndName(categoryName, freet.authorId);
    category.freets.push(freet._id);
    await category.save();
    return category;
  }

  /**
   * Delete freet from a category
   *
   * @param categoryName the name of the category
   * @param freetId the freet id to delete from the category
   * @returns the updated category
   */
  static async deleteFreetFromCategory(categoryName: string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Category>> {
    const freet = await FreetModel.findOne({_id: freetId});
    const category = await CategoryCollection.findOneByUserIdAndName(categoryName, freet.authorId);
    const index = category.freets.indexOf(freet._id);
    if (index > -1) {
      category.freets.splice(index, 1);
    }

    await category.save();
    return category;
  }
}

export default CategoryCollection;
