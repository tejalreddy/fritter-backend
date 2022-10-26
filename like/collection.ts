/* eslint-disable @typescript-eslint/indent */
import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';

/**
 * Contains the functionality to explore the likes stored in MongoDB
 */
class LikeCollection {
    /**
     * Add a like
     *
     * @param userId the user Id
     * @param freetId the freet Id
     * @returns {Promise<HydratedDocument<Like>>} a Like object
     */
    static async addOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
        const like = new LikeModel({userId, freetId});
        await like.save(); // Saves follow to MongoDB
        return like;
    }

    /**
     * Delete a like (unlike)
     *
     * @param userId the user Id
     * @param freetId the freet Id
     * @returns {Promise<boolean>} a Boolean detailing if the Like was deleted or not
     */
    static async deleteOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
        const like = await LikeModel.deleteOne({userId, freetId});
        return like !== null;
    }

    /**
     * Find a like by userId and freetId
     *
     * @param userId the user Id
     * @param freetId the freet Id
     * @returns {Promise<HydratedDocument<Like>>} the Like object
     */
    static async findOneByIds(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
        return LikeModel.findOne({userId, freetId});
    }
}

export default LikeCollection;
