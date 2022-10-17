import type {Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Create a new follow
 *
 * @name POST /api/follows
 *
 * @param {string} followerId - The user doing the following
 * @param {string} username - The user being followed
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 * @throws {409} - If the user is already following a user they want to follow
 * @throws {409} - If the user is tries to follow themselves
 */

router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidUsername,
    followValidator.isFollowExistsForAdding,
    followValidator.isFollowingAnotherUser,
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const followerId = (req.session.userId as string) ?? '';
    const followedId = await UserCollection.findOneByUsername(req.body.username);
    const follow = await FollowCollection.addOne(followerId, followedId._id);
    res.status(201).json({
      message: 'Your follow was executed successfully.',
      follow: util.constructFollowResponse(follow)
    });
  }
);

/**
 * Unfollow a user
 *
 * @name DELETE /api/follows
 *
 *
 * @param {string} followerId - The user doing the following
 * @param {string} username - The user being followed
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 * @throws {409} - If the user is not following a user they want to unfollow
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidUsername,
    followValidator.isFollowExistsForRemoving,
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const followerId = (req.session.userId as string) ?? '';
    const followedId = await UserCollection.findOneByUsername(req.body.username);
    await FollowCollection.deleteOne(followerId, followedId._id);
    res.status(200).json({
      message: 'You unfollowed the user successfully.'
    });
  }
);

export {router as followRouter};

