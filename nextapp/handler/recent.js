import clientPromise from '../helpers/mongodb';
import { insertSchema, querySchema } from '../helpers/schema';
import HttpError from '../helpers/HttpError';
import { TwitterApi } from 'twitter-api-v2';

const MONGODB_COLLECTION = 'test';

async function getRecent(query) {
  const validate = querySchema.validate(query, { convert: true });
  if (validate.error)
    throw new HttpError(validate.error.message, 400);

  const mclient = await clientPromise;
  const db = mclient.db(process.env.MONGODB_DB);

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

  // get twitter user details
  const uniqueTo = results.map(o => o.to).filter((value, index, self) => self.indexOf(value) === index);
  const tclient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN).readOnly;
  const tresults = await tclient.v2.usersByUsernames(uniqueTo, {
    'user.fields': ['profile_image_url','verified'],
  });

  const tuserMap = {};
  tresults.data.forEach(element => tuserMap[element.username] = element);

  return results.map(element => Object.assign(element, { twitter: tuserMap[element.to] }));
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