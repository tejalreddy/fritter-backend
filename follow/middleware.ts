/* eslint-disable @typescript-eslint/indent */
import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FollowCollection from './collection';
import UserCollection from '../user/collection';

/**
 * Checks if a user already follows another user
 */
const isFollowExistsForAdding = async (req: Request, res: Response, next: NextFunction) => {
  const followerId = (req.session.userId as string) ?? '';
  const followedId = await UserCollection.findOneByUsername(req.body.username);
  const follow = await FollowCollection.findOneByIds(followerId, followedId._id);
  if (follow) {
    res.status(409).json({
      error: {
        followFound: `Already following user ${req.body.username as string}.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a user already follows another user
 */
 const isFollowExistsForRemoving = async (req: Request, res: Response, next: NextFunction) => {
    const followerId = (req.session.userId as string) ?? '';
    const followedId = await UserCollection.findOneByUsername(req.body.username);
    const follow = await FollowCollection.findOneByIds(followerId, followedId._id);
    if (!follow) {
      res.status(409).json({
        error: {
          followNotFound: `You are not following this user ${req.body.username as string}.`
        }
      });
      return;
    }

    next();
  };

/**
 * Checks to make sure user is not following themself
 */
 const isFollowingAnotherUser = async (req: Request, res: Response, next: NextFunction) => {
  const followerId = (req.session.userId as string) ?? '';
  const followedId = await UserCollection.findOneByUsername(req.body.username);

  if (followedId._id.toString() === followerId) {
    res.status(409).json({
        error: {
          userError: 'User cannot follow themselves.'
        }
      });
      return;
  }

  next();
};

export {
    isFollowExistsForAdding,
    isFollowExistsForRemoving,
    isFollowingAnotherUser
};
