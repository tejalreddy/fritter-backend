import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * THis file defines the properties stored in Insights
 */

export type Insights = {
  _id: Types.ObjectId; // MongoDB automatically generates
  userId: Types.ObjectId;
  date: string;
  totalTime: number;
};

// Mongoose schema definitionfor interfacing with a MongoDB table
const InsightsSchema = new Schema<Insights>({
  // The date of a record
  date: {
    type: String,
    required: true
  },
  // The userId
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The total time the user has been using the platform
  totalTime: {
    type: Number,
    required: true
  }
});

const InsightsModel = model<Insights>('Insights', InsightsSchema);
export default InsightsModel;
