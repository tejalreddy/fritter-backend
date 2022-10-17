import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties of the follow concept
 */

// Type definition for Follow on the backend
export type Follow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  followerId: Types.ObjectId;
  followedId: Types.ObjectId;
};

// Mongoose schema defintion
const FollowSchema = new Schema<Follow>({
  // The followerId
  followerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

  // The followerId
  followedId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
