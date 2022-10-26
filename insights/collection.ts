/* eslint-disable capitalized-comments */
/* eslint-disable @typescript-eslint/indent */
import type {HydratedDocument, Types} from 'mongoose';
import type {Insights} from './model';
import InsightsModel from './model';

/**
 * Contains the functionality to explore the Insights stored in MongoDB
 */
class InsightsCollection {
    /**
     * Upsert an Insight log
     *
     * @param {string} userId the user id
     * @param {number} totalTime the total time the user was on the platform
     * @returns {Promise<Array<HydratedDocument<Insights>>>} all of the logs upserted
     */
    static async upsertOne(userId: Types.ObjectId | string, totalTime: number): Promise<Array<HydratedDocument<Insights>>> {
        const currentTime = new Date();
        const startOfDay = new Date(currentTime.getUTCFullYear(), currentTime.getUTCMonth(), currentTime.getUTCDate());

        const insightLog = await InsightsModel.find({userId, date: currentTime.toLocaleString().split(',')[0]}).sort({_id: -1}).limit(1);
        const logsUpserted = [];

        // If the time the user entered and left the page is on the same day
        if (totalTime <= currentTime.getTime() - startOfDay.getTime()) {
            // if there is already a log for the day
            if (insightLog.length > 0) {
                const recentLog = insightLog[0];
                recentLog.totalTime += totalTime;
                await recentLog.save();
                logsUpserted.push(recentLog);
            // if there is not already a log for the day then create a new log
            } else {
                const insights = new InsightsModel({userId, date: currentTime.toLocaleString().split(',')[0], totalTime});
                await insights.save();
                logsUpserted.push(insights);
            }
        // the user entered and left the page on different days
        } else {
            const newTotalTime = currentTime.getTime() - startOfDay.getTime();
            const previousTotalTime = totalTime - newTotalTime;
            const previousDate = new Date();
            previousDate.setDate(currentTime.getDate() - 1);

            // log entry for previous day
            const previousInsightLog = await InsightsModel.find({userId, date: previousDate.toLocaleString().split(',')[0]}).sort({_id: -1}).limit(1);
            if (previousInsightLog.length > 0) {
                const recentLog = insightLog[0];
                recentLog.totalTime += previousTotalTime;
                await recentLog.save();
                logsUpserted.push(recentLog);
            // if there is not already a log for the day then create a new log
            } else {
                const insights = new InsightsModel({userId, date: previousDate.toLocaleString().split(',')[0], totalTime: previousTotalTime});
                await insights.save();
                logsUpserted.push(insights);
            }

            // log the new day (a new entry will be made)
            const newInsights = new InsightsModel({userId, date: currentTime.toLocaleString().split(',')[0], totalTime: newTotalTime});
            await newInsights.save();
            logsUpserted.push(newInsights);
        }

        return logsUpserted;
    }

    /**
     * Get information for a particulr day
     *
     * @param {string} userId - the user id
     * @param {Date} date - the date to find the insight for
     * @returns {Promise<HydratedDocument<Insights>>} the insight for the selected date
     */
    static async findByDate(userId: Types.ObjectId | string, date: Date): Promise<HydratedDocument<Insights>> {
        const insights = await InsightsModel.findOne({userId, date: date.toLocaleString().split(',')[0]});
        return insights;
    }

    /**
     * Get all the insights for a particular user
     *
     * @param userId the user id
     * @returns {Promise<Array<HydratedDocument<Insights>>>} all of the insights for a user
     */
    static async findByuserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Insights>>> {
        const insights = await InsightsModel.find({userId});
        return insights;
    }
}

export default InsightsCollection;
