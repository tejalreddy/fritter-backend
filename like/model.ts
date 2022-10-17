import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Like
 */

// Type defintion for Like on the backend
export type Like = {
  _id: Types.ObjectId; // Automically assigned by MongoDB
  userId: Types.ObjectId;
  freetId: Types.ObjectId;
};

// Mongoose schema definition
const LikeSchema = new Schema<Like>({
  // The userId of user who has liked a particular tweet
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The freetId of the freet the user has liked
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  }
});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
