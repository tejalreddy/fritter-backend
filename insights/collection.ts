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
     */
    static async upsertOne(userId: Types.ObjectId | string, beginTime: Date, totalTime: number) {
        const insightLog = await InsightsModel.findOne({userId, beginTime: beginTime.toDateString()});
        const endTime = new Date();
        // If there exists a log for the current day
        if (insightLog) {
            // Update log for the current day
            if (beginTime.toDateString() === endTime.toDateString()) {
                insightLog.totalTime += (endTime.getTime() - beginTime.getTime());
                // const insights = new InsightsModel({userId, beginTime: insightLog.beginTime, totalTime: insightLog.totalTime});
                // await insights.save();
            // The begin time and end time are not on the same day
            } else {
                // Finish updating log for the current day
                const newEndTime = new Date(`${beginTime.toDateString()}`);
                newEndTime.setUTCHours(23, 59, 59, 999);
                insightLog.totalTime += (newEndTime.getTime() - beginTime.getTime());
                // const insights1 = new InsightsModel({userId, beginTime: insightLog.beginTime, totalTime: insightLog.totalTime});
                // await insights1.save();

                // Create a new log entry for the new day
                const newBeginTime = new Date();
                newBeginTime.setUTCHours(0, 0, 0, 0);
                const newTotalTime = (endTime.getTime() - newBeginTime.getTime());
                const insights2 = new InsightsModel({userId, beginTime: newBeginTime.toDateString(), newTotalTime});
                await insights2.save();
            }
        } else {
            // Create a new log entry for the new day
            beginTime = new Date();
            const insights2 = new InsightsModel({userId, beginTime: beginTime.toDateString(), totalTime: 0});
            await insights2.save();
        }

        return true;
    }

    /**
     * Delete log for a particular date. Used only for testing purposes
     */
    static async deleteOne(userId: Types.ObjectId | string, beginTime: Date) {
        const insights = await InsightsModel.deleteOne({userId, beginTime: beginTime.toDateString()});
        return insights !== null;
    }

    /**
     * Get information for a particulr day
     */
    static async findByDate(userId: Types.ObjectId | string, beginTime: Date): Promise<HydratedDocument<Insights>> {
        const insights = await InsightsModel.findOne({userId, beginTime: beginTime.toDateString()});
        return insights;
    }

    /**
     * Get all information for a particular user
     */
    static async findByuserId(userId: Types.ObjectId | string) {
        const insights = await InsightsModel.find({userId});
        return insights;
    }
}

export default InsightsCollection;
