import type {HydratedDocument} from 'mongoose';
import type {Insights} from './model';

type InsightsResponse = {
  _id: string;
  userId: string;
  date: string;
  totalTime: string;
};

/**
 * Transform a raw Insights object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Insights>} insights - An insight
 * @returns {InsightsResponse} - The insights object formatted for the frontend
 */
const constructInsightsResponse = (insights: HydratedDocument<Insights>): InsightsResponse => {
  const insightsCopy: Insights = {
    ...insights.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...insightsCopy,
    _id: insightsCopy._id.toString(),
    userId: insightsCopy.userId.toString(),
    date: insightsCopy.date.toString(),
    totalTime: insightsCopy.totalTime.toString()
  };
};

export {
  constructInsightsResponse
};
