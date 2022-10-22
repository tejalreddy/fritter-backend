import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';

/**
 * Contains the functionality to explore the follows stored in MongoDB
 */
class FollowCollection {
/**
 * Add a follow
 *
 * @param {string} followerId - The ID of the user who is following
 * @param {string} followerId - The ID of the user who is being followed
 * @return {Promise<HydratedDocument<User>>} - The added follow
 */
  static async addOne(followerId: Types.ObjectId | string, followedId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const follow = new FollowModel({followerId, followedId});
    await follow.save(); // Saves follow to MongoDB
    return follow;
  }

  /**
 * Delete a follow (an unfollow)
 *
 * @param {string} followerId - The ID of the user who is doing the unfollowing
 * @param {string} followerId - The ID of the user who is being unfollowed
 * @return {Promise<Boolean>} - true if the follow has been deleted, false otherwise
 */
  static async deleteOne(followerId: Types.ObjectId | string, followedId: Types.ObjectId | string): Promise<boolean> {
    const follow = await FollowModel.deleteOne({followerId, followedId});
    return follow !== null;
  }

  /**
   *
   * @param {string} followerId - The ID of the user who is doing the following
   * @param {string} followerId - The ID of the user who is being followed
   *
   * @return {Promise<HydratedDocument<Follow>> | Promise<null>} - The follow between the two users, if any
   */
  static async findOneByIds(followerId: Types.ObjectId | string, followedId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    return FollowModel.findOne({followerId, followedId});
  }
}

export default FollowCollection;
