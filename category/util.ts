/* eslint-disable @typescript-eslint/indent */
import type {HydratedDocument, Types} from 'mongoose';
import type {Category} from './model';

type CategoryResponse = {
    _id: string; // MongoDB automatically generates ID
    name: string;
    userId: string;
    freets: string[];
};

/**
 * Transforms a raw Category object from database into an object
 */

const constructCategoryResponse = (category: HydratedDocument<Category>): CategoryResponse => {
    const categoryCopy: Category = {
        ...category.toObject({
            versionKey: false
        })
    };

    const freets = (categoryCopy.freets ?? []).map(freet => freet as unknown as string);
    return {
        ...categoryCopy,
        _id: categoryCopy._id.toString(),
        userId: categoryCopy.userId.toString(),
        freets
    };
};

export {
    constructCategoryResponse
};
