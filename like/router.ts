/* eslint-disable @typescript-eslint/indent */
import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as likeValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Create a new like
 *
 * @name POST /api/likes
 *
 * @return {LikeResponse} - The like that was created between a user and a freet
 * @throws {403} - If the user is not logged in
 * @throws {404} - The freet does not exist
 * @throws {409} - If the like already exists
 */
router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        freetValidator.isFreetInBodyExists,
        likeValidator.isLikeExistsForAdding
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const freet = await FreetCollection.findOne(req.body.freetId);
        const like = await LikeCollection.addOne(userId, freet._id);
        res.status(201).json({
        message: 'Your like was executed successfully.',
        like: util.constructLikeResponse(like)
        });
    }
);

/**
 * Remove a like
 *
 * @name DELETE /api/likes
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - The freet does not exist
 * @throws {409} - If the user has not liked the post
 */
router.delete(
    '/',
    [
        userValidator.isUserLoggedIn,
        freetValidator.isFreetInBodyExists,
        likeValidator.isLikeExistsForRemoving
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const freet = await FreetCollection.findOne(req.body.freetId);
        await LikeCollection.deleteOne(userId, freet._id);
        res.status(200).json({
        message: 'You unliked the freet successfully.'
        });
    }
);

export {router as likeRouter};
