/* eslint-disable @typescript-eslint/indent */
import type {Request, Response} from 'express';
import express from 'express';
import InsightsCollection from './collection';
import * as userValidator from '../user/middleware';
import * as insightsValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Upsert an insights log
 * After front end is implemented, will be called by the front end which uses a timing package
 *
 * @name PUT /api/insights
 *
 * @param {string} totalTime - the total time spent on the platform
 * @return {InsightsResponse[]} - an object with the logs upserted
 * @throws {403} - If user is not logged in
 */
router.put(
    '/',
    [userValidator.isUserLoggedIn],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const totalTime = parseInt(req.body.totalTime, 10);
        const upsertedLogs = await InsightsCollection.upsertOne(userId, totalTime);
        const response = upsertedLogs.map(util.constructInsightsResponse);
        res.status(200).json(response);
    }
);

/**
 * Get all of a user's insights
 *
 * @name GET /api/insights
 *
 * @return {InsightsResponse[]} - an object with all of a user's insights
 * @throws {403} - If user is not logged in
 */
router.get(
    '/',
    [userValidator.isUserLoggedIn],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const insights = await InsightsCollection.findByuserId(userId);
        const response = insights.map(util.constructInsightsResponse);
        res.status(200).json(response);
    }
);

/**
 * Get a user's insights for a particular day
 *
 * @name GET /api/insights/:date
 *
 * @return {InsightsResponse} - an object with the insights for the selected day
 * @throws {403} - If user is not logged in
 * @throws {400} - If the date format is not valid
 * @throws {404} - If the date does not exist in the user's insights
 */
router.get(
    '/:date',
    [userValidator.isUserLoggedIn,
    insightsValidator.isDateValid,
    insightsValidator.isDateExist],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const [year, month, day] = req.params.date.split('-');
        const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
        const insights = await InsightsCollection.findByDate(userId, date);
        res.status(200).json({
            message: 'Time retrieved successfully',
            insights: util.constructInsightsResponse(insights)
        });
    }
);

export {router as insightsRouter};
