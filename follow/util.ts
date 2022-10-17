import type {HydratedDocument} from 'mongoose';
import type {Follow} from '../follow/model';

type FollowResponse = {
  _id: string;
  followerId: string;
  followedId: string;
};

/**
 * Transform a raw Follow object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Follow>} follow - A follow
 * @returns {FollowResponse} - The follow object formatted for the frontend
 */
const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowResponse => {
  const followCopy: Follow = {
    ...follow.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...followCopy,
    _id: followCopy._id.toString(),
    followerId: followCopy.followerId.toString(),
    followedId: followCopy.followedId.toString()
  };
};

export {
  constructFollowResponse
};
