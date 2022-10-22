import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Category
 */
export type Category = {
  _id: Types.ObjectId; // MongoDB automatically generates ID
  name: string;
  userId: Types.ObjectId;
  freets: Types.ObjectId[];
};

// Mongoose schema definition
const CategorySchema = new Schema<Category>({
  // The name of the group
  name: {
    type: String,
    required: true
  },
  // The user who created the group
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  freets: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'Freet'
  }
});

const CategoryModel = model<Category>('Category', CategorySchema);
export default CategoryModel;
