/* eslint-disable @typescript-eslint/indent */
import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import LikeCollection from './collection';

/**
 * Checks if a user has already liked a freet for liking a freet
 */
 const isLikeExistsForAdding = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const freet = await FreetCollection.findOne(req.body.freetId);
    const like = await LikeCollection.findOneByIds(userId, freet._id);
    if (like) {
        res.status(409).json({
            error: {
                likeFound: 'Already liked this post'
            }
        });
        return;
    }

    next();
};

/**
 * Checks if a user has already liked a freet for unliking a freet
 */
 const isLikeExistsForRemoving = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const freet = await FreetCollection.findOne(req.body.freetId);
    const like = await LikeCollection.findOneByIds(userId, freet._id);
    if (!like) {
        res.status(409).json({
            error: {
                likeFound: 'Already liked this post'
            }
        });
        return;
    }

    next();
};

export {
    isLikeExistsForAdding,
    isLikeExistsForRemoving
};
