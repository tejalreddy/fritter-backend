/* eslint-disable @typescript-eslint/indent */
import type {Request, Response} from 'express';
import express from 'express';
import CategoryCollection from './collection';
import FreetCollection from '../freet/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import * as freetUtil from '../freet/util';
import * as categoryValidator from './middleware';

const router = express.Router();

/**
 * Create a new category
 *
 * @name POST /api/categories
 *
 * @return {CategoryResponse} - The new created category
 * @throws {403} if user is not logged in
 * @throws {400} if category name is not in the current format
 * @throws {409} if a category with the same name already exists
 */
router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        categoryValidator.isValidCategoryNameForCreation,
        categoryValidator.isCategoryExistForCreation
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const category = await CategoryCollection.addOne(req.body.name, userId);
        res.status(201).json({
            message: 'Your category was created successfully.',
            category: util.constructCategoryResponse(category)
          });
    }
);

/**
 * Update a category name
 *
 * @name PUT /api/categories/:categoryName?
 *
 * @return {CategoryResponse} - The new updated category
 * @throws {403} if user is not logged in
 * @throws {400} if category name is not in the current format
 * @throws {409} if a category with the same name already exists
 */
router.put(
    '/:categoryName?',
    [
        userValidator.isUserLoggedIn,
        categoryValidator.isValidCategoryName,
        categoryValidator.isValidCategoryNameForCreation,
        categoryValidator.isCategoryExistForCreation
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const category = await CategoryCollection.updateName(req.params.categoryName, req.body.name, userId);
        res.status(200).json({
            message: 'Category name was updated successfully.',
            category: util.constructCategoryResponse(category)
        });
    }
);

/**
 * Delete a category
 *
 * @name DELETE /api/categories/:categoryName?
 *
 * @return {boolean} - A boolean value indicating if the category was deleted
 * @throws {403} if user is not logged in
 * @throws {400} if category name is not in the current format
 * @throws {409} if the category does not exist
 */
router.delete(
    '/:categoryName?',
    [
        userValidator.isUserLoggedIn,
        categoryValidator.isValidCategoryName,
        categoryValidator.isCategoryExist
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        await CategoryCollection.deleteOne(req.params.categoryName, userId);
        res.status(200).json({
            message: 'The category has been deleted successfully.'
          });
    }
);

/**
 * Add freet to a category
 *
 * @name POST /api/categories/:categoryName?/freets
 *
 * @return {CategoryResponse} - The updated category
 * @throws {403} if user is not logged in
 * @throws {400} if category name is not in the current format
 * @throws {409} if the category does not exist
 * @throws {404} if the freet does not exist
 * @throws {409} if the freet is already in the category
 */
 router.post(
    '/:categoryName?/freets',
    [
      userValidator.isUserLoggedIn,
      categoryValidator.isValidCategoryName,
      categoryValidator.isCategoryExist,
      freetValidator.isFreetInBodyExists,
      categoryValidator.isFreetInCategoryForAddition
    ],
    async (req: Request, res: Response) => {
      const category = await CategoryCollection.addFreetToCategory(req.params.categoryName, req.body.freetId);
      res.status(200).json({
        message: 'The freet was added to your category successfully.',
        freet: util.constructCategoryResponse(category)
      });
    }
  );

  /**
 * Delete freet from a category
 *
 * @name DELETE /api/categories/:categoryName?/freets
 *
 * @return {CategoryResponse} - The updated category
 * @throws {403} if user is not logged in
 * @throws {400} if category name is not in the current format
 * @throws {409} if the category does not exist
 * @throws {404} if the freet does not exist
 * @throws {409} if the freet is not in the category
 */
  router.delete(
    '/:categoryName?/freets',
    [
      userValidator.isUserLoggedIn,
      categoryValidator.isValidCategoryName,
      categoryValidator.isCategoryExist,
      freetValidator.isFreetInBodyExists,
      categoryValidator.isFreetInCategoryForDeletion
    ],
    async (req: Request, res: Response) => {
      const category = await CategoryCollection.deleteFreetFromCategory(req.params.categoryName, req.body.freetId);
      res.status(200).json({
        message: 'The freet was deleted from your category successfully.',
        freet: util.constructCategoryResponse(category)
      });
    }
  );

/**
 * View all categories belonging to a user
 *
 * @name GET /api/categories
 *
 * @return {CategoryResponse[]} - List of all the categories belonging to a user
 * @throws {403} if user is not logged in
 */
router.get(
    '/',
    [
        userValidator.isUserLoggedIn
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const allCategories = await CategoryCollection.findAll(userId);
        const response = allCategories.map(util.constructCategoryResponse);
        res.status(200).json(response);
    }
);

/**
 * Find all freets belonging to a specific category
 *
 * @name GET /api/categories/:categoryname?/freets
 *
 * @return {FreetResponse[]} - List of all the freets belonging to a specific category
 * @throws {403} if user is not logged in
 * @throws {400} if the category name is not valid
 * @throws {404} if the category does not exist
 */
router.get(
    '/:categoryName?/freets',
    [
        userValidator.isUserLoggedIn,
        categoryValidator.isValidCategoryName,
        categoryValidator.isCategoryExist
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const freets = await CategoryCollection.findFreetsInCategory(req.params.categoryName, userId);
        const response = freets.map(freetUtil.constructFreetResponse);
        res.status(200).json(response);
    }
);

export {router as categoryRouter};
