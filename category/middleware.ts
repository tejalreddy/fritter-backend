/* eslint-disable @typescript-eslint/indent */
import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CategoryCollection from './collection';
import FreetCollection from '../freet/collection';

/**
 * Check to make sure that category name is of valid form
 */
const isValidCategoryName = async (req: Request, res: Response, next: NextFunction) => {
    const categoryRegex = /^\w+$/i;
    if (!categoryRegex.test(req.params.categoryName)) {
        res.status(400).json({
        error: {
            username: 'Category must be a nonempty alphanumeric string.'
        }
        });
        return;
    }

    next();
};

/**
 * Check to make sure that category name in body is of valid form
 */
 const isValidCategoryNameForCreation = async (req: Request, res: Response, next: NextFunction) => {
    const categoryRegex = /^\w+$/i;
    if (!categoryRegex.test(req.body.name)) {
        res.status(400).json({
        error: {
            username: 'Category must be a nonempty alphanumeric string.'
        }
        });
        return;
    }

    next();
};

/**
 * Check to see if category exists when creating a new category
 */
const isCategoryExistForCreation = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const category = await CategoryCollection.findOneByUserIdAndName(req.body.name, userId);

    if (category) {
        res.status(409).json({
            error: {
              categoryFound: `Category ${req.body.name as string} already exists.`
            }
        });
        return;
    }

    next();
};

/**
 * Check to see if category exists
 */
const isCategoryExist = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const category = await CategoryCollection.findOneByUserIdAndName(req.params.categoryName, userId);

    if (!category) {
        res.status(404).json({
            error: {
              categoryNotFound: `Category ${req.params.categoryName} does not exist.`
            }
        });
        return;
    }

    next();
};

/**
 * Check to see if freet is in a category when deleting
 */
const isFreetInCategoryForDeletion = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const category = await CategoryCollection.findOneByUserIdAndName(req.params.categoryName, userId);
    const freet = await FreetCollection.findOne(req.body.freetId);
    const index = category.freets.indexOf(freet._id);
    if (index <= -1) {
        res.status(404).json({
            error: {
              freetNotFound: `Freet with ID ${freet._id as unknown as string} not found in category.`
            }
        });
    }

    next();
};

/**
 * Check to see if freet is in a category when adding
 */
const isFreetInCategoryForAddition = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const category = await CategoryCollection.findOneByUserIdAndName(req.params.categoryName, userId);
    const freet = await FreetCollection.findOne(req.body.freetId);
    const index = category.freets.indexOf(freet._id);
    if (index > -1) {
        res.status(409).json({
            error: {
              freetFound: `Freet with ID ${freet._id as unknown as string} already in category.`
            }
        });
        return;
    }

    next();
};

export {
    isValidCategoryName,
    isCategoryExist,
    isFreetInCategoryForAddition,
    isFreetInCategoryForDeletion,
    isCategoryExistForCreation,
    isValidCategoryNameForCreation
};
