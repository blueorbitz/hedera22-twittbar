import clientPromise from '../../helpers/mongodb';
import { insertSchema, querySchema } from '../../helpers/schema';

const MONGODB_COLLECTION = 'test';

export default function handler(req, res) {
  const method = req.method.toUpperCase();
  switch (method) {
    case 'GET':
      getHandler(req, res);
      break;
    case 'POST':
      postHandler(req, res);
      break;
    default:
      res.status(405).send();
  }
}

async function getHandler(req, res) {
  try {
    const validate = querySchema.validate(req.query, { convert: true });
    if (validate.error) {
      res.status(400).json({ error: validate.error.message });
      return;
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const query = validate.value;
    const limit = query.limit || 5;
    const skip = query.skip || 0;
    delete query.limit;
    delete query.skip;

    const results = await db.collection(MONGODB_COLLECTION)
      .find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.status(200).json(results);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
}

async function postHandler(req, res) {
  try {
    const validate = insertSchema.validate(req.body, { convert: true });
    if (validate.error) {
      res.status(400).json({ error: validate.error.message });
      return;
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const transaction = validate.value;
    const result = await db.collection(MONGODB_COLLECTION)
      .insertOne(transaction);
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
}