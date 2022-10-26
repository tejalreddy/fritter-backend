/* eslint-disable @typescript-eslint/indent */
import type {HydratedDocument} from 'mongoose';
import type {Like} from './model';

type LikeResponse = {
    _id: string;
    userId: string;
    freetId: string;
};

/**
 * Transform a raw Like object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Like>} like - A like
 * @returns {LikeResponse} - The like object formatted for the frontend
 */
 const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse => {
    const likeCopy: Like = {
      ...like.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };

    return {
      ...likeCopy,
      _id: likeCopy._id.toString(),
      userId: likeCopy.userId.toString(),
      freetId: likeCopy.freetId.toString()
    };
  };

export {
    constructLikeResponse
};
