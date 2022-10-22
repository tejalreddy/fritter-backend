import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * THis file defines the properties stored in Insights
 */

export type Insights = {
  _id: Types.ObjectId; // MongoDB automatically generates
  userId: Types.ObjectId;
  beginTime: Date;
  endTime: Date;
  totalTime: number;
};

// Mongoose schema definitionfor interfacing with a MongoDB table
const InsightsSchema = new Schema<Insights>({
  // The userId
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The time the user starts using the platform
  beginTime: {
    type: Date,
    required: true
  },
  // The time the user ends using the platform
  endTime: {
    type: Date,
    required: false
  },
  // The total time the user has been using the platform for the current day
  totalTime: {
    type: Number,
    required: true
  }
});

const InsightsModel = model<Insights>('Insights', InsightsSchema);
export default InsightsModel;
