import clientPromise from '../helpers/mongodb';
import { insertSchema, querySchema } from '../helpers/schema';
import HttpError from '../helpers/HttpError';

const MONGODB_COLLECTION = 'test';

async function getRecent(query) {
  const validate = querySchema.validate(query, { convert: true });
  if (validate.error)
    throw new HttpError(validate.error.message, 400);

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  const _query = validate.value;
  const limit = _query.limit || 5;
  const skip = _query.skip || 0;
  delete _query.limit;
  delete _query.skip;

  const results = await db.collection(MONGODB_COLLECTION)
    .find(_query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  return results;
}

async function postRecent(body) {
  const validate = insertSchema.validate(body, { convert: true });
  if (validate.error)
    throw new HttpError(validate.error.message, 400);

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  const transaction = validate.value;
  const result = await db.collection(MONGODB_COLLECTION)
    .insertOne(transaction);

  return result;
}

export { getRecent, postRecent };